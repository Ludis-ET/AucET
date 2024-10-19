import {
  getAuth,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from "firebase/auth";

const auth = getAuth();

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

export default auth;
