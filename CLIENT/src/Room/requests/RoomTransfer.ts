import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const roomTransfer = async (
  roomId: string,
  RemovedfromCollection: string,
  toCollection: string
) => {
  try {
    const roomRef = doc(db, RemovedfromCollection, roomId);
    const roomSnap = await getDoc(roomRef);

    if (roomSnap.exists()) {
      await setDoc(doc(db, toCollection, roomId), roomSnap.data());
      await deleteDoc(roomRef);
      console.log(
        `Room ${roomId} transferred from ${RemovedfromCollection} to ${toCollection}`
      );
    } else {
      console.log(
        `Room with ID ${roomId} does not exist in ${RemovedfromCollection}`
      );
    }
  } catch (error) {
    console.error("Error transferring room:", error);
  }
};
