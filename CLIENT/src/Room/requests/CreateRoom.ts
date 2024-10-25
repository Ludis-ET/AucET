import { getFirestore, Timestamp, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { addSpendBid } from "../../Payment/chapa";
import { Profile } from "../../Context";
import { RoomType } from "./GetRooms";
import { db } from "../../firebase";

const uploadFileToFirebase = async (file: File, folder: string) => {
  try {
    const storage = getStorage();
    const fileRef = ref(storage, `${folder}/${uuidv4()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    toast.error("Error uploading file.");
    throw error;
  }
};

export const uploadData = async (
  newFormValues: { [key: string]: string },
  files: File[],
  videoFile: File | null,
  coverPhotoIndex: number | null,
  profile: Profile
) => {
  try {
    const firestore = getFirestore();
    const documentId = uuidv4();
    const docRef = doc(firestore, "New-Rooms", documentId);

    const imageUploadPromises = files.map((file) =>
      uploadFileToFirebase(file, "images")
    );
    const imageUrls = await Promise.all(imageUploadPromises);

    let videoUrl = null;
    if (videoFile) {
      videoUrl = await uploadFileToFirebase(videoFile, "videos");
    }

    const dataToSave = {
      newFormValues,
      images: imageUrls,
      video: videoUrl,
      creator: profile.userId,
      coverPhoto: coverPhotoIndex !== null ? imageUrls[coverPhotoIndex] : null,
      createdAt: Timestamp.now(),
    };

    await setDoc(docRef, dataToSave);
    if (newFormValues.roomtype === "large")
      await addSpendBid(profile, "Room Creation", 2, "spent");
    toast.success("Data uploaded successfully!");
    return documentId;
  } catch (error) {
    console.error("Error uploading data to Firestore:", error);
    toast.error("Error uploading data.");
    throw error;
  }
};

export const peopleStarter = async (
  room: RoomType,
  profile: Profile,
  bid: number
) => {
  try {
    const dataToSave = {
      userId: profile.userId,
      roomId: room.id,
      bidAmount: bid,
      name: `${profile.firstName} ${profile.lastName}`,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      photoURL: profile.photoURL || "",
      timestamp: new Date().toISOString(),
    };

    const docRef = doc(db, "Room-Starter", `${room.id}_${profile.userId}`);
    await setDoc(docRef, dataToSave);

    toast.success("Registration saved successfully!");
  } catch (error) {
    console.error("Error saving registration:", error);
    toast.error("Failed to save registration.");
  }
};