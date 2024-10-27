import { User } from "firebase/auth";
import { Profile } from "../Context";

export const isLoggedin = (currentUser: User | null, profile: Profile) => {
  return !(
    !currentUser ||
    !profile ||
    !profile.phoneVerified ||
    !profile.firstName.length ||
    !profile.lastName.length
  );
};
