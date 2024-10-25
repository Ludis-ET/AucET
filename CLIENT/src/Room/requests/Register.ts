import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

type UserRegistration = {
  userId: string;
  roomId: string;
  name: string;
  email: string;
  pic: string;
  date: string;
};

export const registerUser = async (registrationData: UserRegistration) => {
  await addDoc(collection(db, "Room-Registration"), registrationData);
};

export const fetchRegisteredUsers = async () => {
  const usersSnapshot = await getDocs(collection(db, "Room-Registration"));
  return usersSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId || "",
      roomId: data.roomId || "",
      name: data.name || "",
      email: data.email || "",
      pic: data.pic || "",
      date: data.date || "",
    };
  });
};

export const unregisterUser = async (userId: string, roomId: string) => {
  const usersSnapshot = await getDocs(collection(db, "Room-Registration"));
  const userDocs = usersSnapshot.docs.filter((doc) => {
    const data = doc.data();
    return data.userId === userId && data.roomId === roomId;
  });

  for (const userDoc of userDocs) {
    await deleteDoc(doc(db, "Room-Registration", userDoc.id));
  }
};
