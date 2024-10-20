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
  profile: Profile;
  loading: boolean;
  setProfile?: (profile: Profile) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export interface Profile {
  userId: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  photoURL: string;
  phoneNumber: string;
  phoneVerified: boolean;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>({
    userId: "",
    email: "",
    displayName: "",
    photoURL: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    phoneVerified: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const checkAndCreateUserById = async () => {
      setLoading(true);
      const usersRef = collection(db, "User-Profiles");
      const q = query(usersRef, where("userId", "==", currentUser.uid));

      try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const existingUser = querySnapshot.docs[0].data() as Profile;
          setProfile(existingUser);
        } else {
          const newUserRef = doc(usersRef);
          const newUser: Profile = {
            userId: currentUser.uid,
            email: currentUser.email || "",
            firstName: "",
            lastName: "",
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
      } finally {
        setLoading(false);
      }
    };

    checkAndCreateUserById();
  }, [currentUser]);

  const value = {
    currentUser,
    setCurrentUser,
    profile,
    setProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
