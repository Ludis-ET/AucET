import { createContext, useEffect, useState, ReactNode } from "react";
import { User } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore"; 
import { auth, db } from "../firebase";

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const checkAndCreateUserById = async (userId: string, userData) => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("userId", "==", userId));

      try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const existingUser = querySnapshot.docs[0].data();
          return existingUser;
        } else {
          const newUserRef = doc(usersRef);
          await setDoc(newUserRef, { userId, ...userData });
          return { userId, ...userData };
        }
      } catch (error) {
        console.error("Error checking/creating user:", error);
        throw error;
      }
    };

  }, [currentUser]);


  const value = {
    currentUser,
    setCurrentUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
