import { signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import toast from "react-hot-toast";

import { auth } from "../../firebase";

export const signUpWithGoogle = async (setCurrentUser: (user: User | null) => void) => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    setCurrentUser(user);
    toast.success(
      "Signed up with Google successfully! Welcome " + user.displayName
    );
    return user;
  } catch (error) {
    toast.error((error as Error).message);
    throw error;
  }
};

export const signOut = async (setCurrentUser: (user: User | null) => void) => {
  try {
    await auth.signOut();
    setCurrentUser(null); 
    toast.success("Signed out successfully");
  } catch (error) {
    toast.error((error as Error).message);
    throw error;
  }
};
