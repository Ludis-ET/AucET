import {
  collection,
  query,
  Timestamp,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Profile } from "../../Context";

export interface RoomType {
  id: string;
  coverPhoto: string;
  video: string;
  creator:string;
  createdAt: Timestamp;
  images: string[];
  newFormValues: Record<string, string | Timestamp>;
}

export const getRoomByProfile = async (
  profile: Profile
): Promise<RoomType[] | null> => {
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

export const getRooms = async (): Promise<RoomType[] | null> => {
  try {
    const fireRoom = collection(db, "New-Rooms");
    const querySnapshot = await getDocs(fireRoom);

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

export const getRoomById = async (id: string): Promise<RoomType | null> => {
  try {
    const roomRef = doc(db, "New-Rooms", id);
    const roomSnapshot = await getDoc(roomRef);

    if (roomSnapshot.exists()) {
      const roomData = {
        id: roomSnapshot.id,
        ...roomSnapshot.data(),
      } as RoomType;

      return roomData;
    } else {
      console.error("Room not found:", id);
      return null;
    }
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    return null;
  }
};

export const getStarter = async (profile: Profile, room: RoomType) => {
  try {
    const AuctionRoom = collection(db, "Room-Starter");
    const myRooms = query(AuctionRoom, where("userId", "==", profile.userId));
    const starterQuery = query(myRooms, where("roomId", "==", room.id));

    const snap = await getDocs(starterQuery);

    if (!snap.empty) {
      return snap.docs[0].data();
    } else {
      console.log("No matching starter document found.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving starter document:", error);
    return null;
  }
};
