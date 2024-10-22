import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";

export const Step3 = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState<number | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    // Filter images and video
    const images = acceptedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const video = acceptedFiles.find((file) => file.type.startsWith("video/"));

    if (images.length + files.length > 5) {
      toast.error("You can only upload a total of 5 images.");
      return;
    }

    // Accept images immediately
    if (images.length > 0) {
      setFiles((prevFiles) => [...prevFiles, images[0]]);
      toast.success("Image uploaded successfully!");
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
      newFiles[index] = updatedImage; // Update the selected image
      return newFiles;
    });
    toast.success("Image updated successfully!");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
  });

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Upload Images and Video</h3>

      <div
        {...getRootProps()}
        className="border-2 border-brown-500 rounded-lg p-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        Drag and drop your images and videos here, or click to select files.
      </div>

      <div className="grid grid-cols-5 gap-4 mt-4">
        {files.map((file, index) => (
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
            <div className="absolute bottom-0 right-0 flex space-x-2 p-2">
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

      {/* Add further steps or a submit button here if needed */}
    </div>
  );
};
