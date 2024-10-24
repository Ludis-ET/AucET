import {
  collection,
  query,
  Timestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Profile } from "../../Context";

interface RoomType {
  coverPhoto: string;
  video: string;
  createdAt: Timestamp;
  images: string[];
  newFormValues: { [key: number]: (string | Timestamp)[] };
}

export const getRoom = async (profile: Profile): Promise<RoomType | null> => {
  try {
    const fireRoom = collection(db, "New-Room");
    const myRoom = query(fireRoom, where("creator", "==", profile.userId));
    const querySnapshot = await getDocs(myRoom);
    const roomData =
      querySnapshot.docs.map((doc) => doc.data() as RoomType)[0] || null;

    return roomData;
  } catch (error) {
    console.error("Error fetching room:", error);
    return null;
  }
};
