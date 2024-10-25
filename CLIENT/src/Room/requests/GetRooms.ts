import {
  collection,
  query,
  Timestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Profile } from "../../Context";

export interface RoomType {
  id: string;
  coverPhoto: string;
  video: string;
  createdAt: Timestamp;
  images: string[];
  newFormValues: Record<string, string | Timestamp>;
}

export const getRoom = async (profile: Profile): Promise<RoomType[] | null> => {
  try {
    const fireRoom = collection(db, "New-Rooms");
    const myRoom = query(fireRoom, where("creator", "==", profile.userId));
    const querySnapshot = await getDocs(myRoom);

    
    const roomData = querySnapshot.docs.map((doc) => ({
      id: doc.id, 
      ...doc.data(),
    })) as RoomType[];

    return roomData.length > 0 ? roomData : null;
  } catch (error) {
    console.error("Error fetching room:", error);
    return null;
  }
};
