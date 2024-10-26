import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../Context";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export const NameSetup = () => {
  const { profile, setProfile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!firstName || !lastName) {
        toast.error("Please enter both your first and last names.");
        return;
      }

      if (profile && profile.userId) {
        const userProfilesRef = collection(db, "User-Profiles");
        const userQuery = query(
          userProfilesRef,
          where("userId", "==", profile.userId)
        );
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].ref;

          await updateDoc(userDoc, {
            firstName,
            lastName,
          });

          // Update local profile state
          const updatedProfile = {
            ...profile,
            firstName,
            lastName,
          };
          if (setProfile) {
            setProfile(updatedProfile);
          }

          toast.success("Name updated successfully!");
        } else {
          toast.error("User profile not found.");
        }
      }
    } catch (error) {
      toast.error("Failed to update name. Please try again.");
      console.error("Name update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-mainBackground to-secondaryBackground flex justify-center items-center h-screen">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-mainText">
          Welcome! Let’s Get to Know You
        </h2>
        <p className="text-center mb-4 text-gray-600">
          Please enter your first and last names to personalize your profile.
        </p>
        <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="p-3 border rounded-md w-full border-gray-300 focus:outline-none focus:border-mainText"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="p-3 border rounded-md w-full border-gray-300 focus:outline-none focus:border-mainText"
            required
          />
          <button
            type="submit"
            className={`bg-buttonBackground text-white py-2 px-4 rounded-md hover:bg-buttonHover transition-colors duration-300 w-full ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};
