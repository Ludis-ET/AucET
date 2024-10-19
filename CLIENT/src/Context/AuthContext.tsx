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
  profile?: Profile;
  setProfile?: (profile: Profile) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

interface Profile {
  userId: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  phoneVerified: boolean;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const checkAndCreateUserById = async () => {
      const usersRef = collection(db, "User-Profiles");
      const q = query(usersRef, where("userId", "==", currentUser.uid));

      try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const existingUser = querySnapshot.docs[0].data();
          return existingUser;
        } else {
          const newUserRef = doc(usersRef);
          const newUser = {
            userId: currentUser.uid,
            email: currentUser.email || "",
            displayName: currentUser.displayName || "",
            photoURL: currentUser.photoURL || "",
            phoneNumber: "",
            phoneVerified: false,
          };
          await setDoc(newUserRef, newUser);
          setProfile(newUser);
        }
      } catch (error) {
        console.error("Error checking/creating user:", error);
        throw error;
      }
    };
    checkAndCreateUserById();
  }, [currentUser]);

  const value = {
    currentUser,
    setCurrentUser,
    profile,
    setProfile,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
