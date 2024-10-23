import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { uploadData } from "../../requests";

interface Props {
  form: { [key: number]: (string | Timestamp)[] };
}

export const Step5 = ({ form }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState<number | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const names: { [key: string]: string[] } = {
    1: ["Buy/Sell", "Visibility", "starter"],
    2: ["start date", "duration", "bid"],
    3: ["description"],
    4: ["type"],
  };
  const newFormValues: { [key: string]: string } = {};
  Object.keys(form).forEach((key) => {
    const numKey = Number(key);
    for (let i = 0; i < (form[numKey] as (string | Timestamp)[]).length; i++) {
      newFormValues[names[numKey][i]] = form[numKey][i] as string;
    }
  });

  const onDrop = (acceptedFiles: File[]) => {
    const images = acceptedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const video = acceptedFiles.find((file) => file.type.startsWith("video/"));

    if (images.length + files.length > 5) {
      toast.error("You can only upload a total of 5 images.");
      return;
    }

    if (images.length > 0) {
      setFiles((prevFiles) => [...prevFiles, images[0]]);
      toast.success("Image uploaded successfully!");
    }
    if (video) {
      if (video.size > 3 * 1024 * 1024) {
        toast.error("Video file size must not exceed 3MB.");
        return;
      }
      setVideoFile(video);
      toast.success("Video uploaded successfully!");
    }
    if (video) {
      setVideoFile(video);
      toast.success("Video uploaded successfully!");
    }
  };

  const handleCoverPhotoSelect = (index: number) => {
    setCoverPhotoIndex(index);
  };

  const handleDeleteImage = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    toast.success("Image deleted successfully!");
  };

  const handleUpdateImage = (index: number, acceptedFiles: File[]) => {
    const updatedImage = acceptedFiles[0];
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = updatedImage;
      return newFiles;
    });
    toast.success("Image updated successfully!");
  };

  const handleSubmit = async () => {
    if (files.length === 0 || !form) {
      toast.error("Please upload files and fill the form before submitting.");
      return;
    }

    try {
      setIsLoading(true);
      const documentId = await uploadData(
        newFormValues,
        files,
        videoFile,
        coverPhotoIndex
      );
      toast.success(`Data uploaded successfully! Document ID: ${documentId}`);
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
  });

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex flex-col gap-4 items-center justify-center">
        <div className="loader"></div>
        <h1 className="text-2xl font-bold text-buttonBackground">Uploading</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Upload Images and Video</h3>
      <div
        {...getRootProps()}
        className="border-2 border-brown-500 rounded-lg p-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        Drag and drop or upload 5 images individually and one short video
      </div>
      <div className="flex gap-6 flex-wrap justify-center">
        {files.reverse().map((file, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt={`preview-${index}`}
              className={`h-32 w-32 object-cover rounded-lg ${
                coverPhotoIndex === index ? "border-4 border-blue-500" : ""
              }`}
              onClick={() => handleCoverPhotoSelect(index)}
            />
            {coverPhotoIndex === index && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-50 text-white font-bold rounded-lg">
                Cover
              </div>
            )}
            <div className="flex space-x-2 p-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    handleUpdateImage(index, Array.from(e.target.files));
                  }
                }}
                className="hidden"
                id={`update-image-${index}`}
              />
              <label
                htmlFor={`update-image-${index}`}
                className="cursor-pointer text-blue-500 underline"
              >
                Update
              </label>
              <button
                onClick={() => handleDeleteImage(index)}
                className="text-red-500 underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {videoFile && (
        <div className="mt-4">
          <h4 className="font-medium">Video Preview</h4>
          <video
            controls
            src={URL.createObjectURL(videoFile)}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}
      <button
        onClick={handleSubmit}
        className="bg-buttonBackground hover:bg-buttonHover text-white rounded-lg px-4 py-2 mt-4"
        disabled={isLoading}
      >
        Submit
      </button>
    </div>
  );
};
