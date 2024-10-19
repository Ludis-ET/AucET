import { auth } from "../../firebase";
import { getRedirectResult, GoogleAuthProvider, User } from "firebase/auth";
import toast from "react-hot-toast";
import { FirebaseError } from "firebase/app";

export const handleAuthRedirect = async (): Promise<User | null> => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      toast.success(`Welcome, ${user.displayName}!`);
      return user;
    }
  } catch (error) {
    const firebaseError = error as FirebaseError;
    const errorMessage = firebaseError.message;
    console.error(`Error: ${firebaseError.code} - ${errorMessage}`);
    toast.error(`Login failed: ${errorMessage}`);
  }
  return null;
};

export const isLoggedIn = (): boolean => {
  return auth.currentUser !== null;
};
