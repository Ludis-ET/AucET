import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import {
  query,
  where,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import "react-phone-input-2/lib/style.css";
import { Profile, useAuth } from "../../Context";

export const PhoneNumberVerification = () => {
  const { profile, setProfile } = useAuth();
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit } = useForm();
  const userid = profile.userId;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userid) return;

      const userProfilesRef = collection(db, "User-Profiles");
      const userQuery = query(userProfilesRef, where("userId", "==", userid));

      try {
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          const userProfileData = querySnapshot.docs[0].data();
          const profileData: Profile = {
            userId: userProfileData.userId,
            email: userProfileData.email,
            displayName: userProfileData.displayName,
            firstName: userProfileData.firstName,
            lastName: userProfileData.lastName,
            phoneNumber: userProfileData.phoneNumber,
            phoneVerified: userProfileData.phoneVerified,
            photoURL: userProfileData.photoURL,
          };
          if (setProfile) {
            setProfile(profileData);
          }
        } else {
          toast.error("Profile not found.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, [userid, setProfile]);

  const isValidEthiopianPhoneNumber = (number: string) => {
    return number.length === 12 && number.startsWith("2519");
  };

  const handleSendOTP = async () => {
    if (!isValidEthiopianPhoneNumber(phoneNumber.toString())) {
      toast.error("Please enter a valid Ethiopian phone number.");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("http://localhost:3000/send-otp", { phoneNumber });
      toast.success("OTP sent successfully!");
      setIsOtpSent(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/verify-otp", {
        phoneNumber,
        otp,
      });
      if (response.status === 200) {
        toast.success("OTP verified successfully!");

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
              phoneNumber,
              phoneVerified: true,
            });

            const updatedProfile = {
              ...profile,
              phoneNumber,
              phoneVerified: true,
            };
            if (setProfile) {
              setProfile(updatedProfile);
            }
          } else {
            toast.error("User profile not found.");
          }
        }
      }
    } catch (error) {
      toast.error("Invalid OTP or verification failed.");
      console.error("OTP verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-mainBackground to-secondaryBackground flex justify-center items-center h-screen">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-mainText">
          Verify Your Phone Number
        </h2>
        <form
          onSubmit={handleSubmit(handleSendOTP)}
          className="flex gap-4 flex-col items-center justify-center w-full"
        >
          <PhoneInput
            country={"et"}
            value={phoneNumber}
            onChange={setPhoneNumber}
            dropdownClass={""}
            placeholder="Enter phone number"
            disableDropdown={true}
          />
          <button
            type="submit"
            className={`bg-buttonBackground text-white py-2 px-4 rounded-md hover:bg-buttonHover transition-colors duration-300 w-full ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </form>
        {isOtpSent && (
          <div className="mt-6">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-3 border rounded-md w-full border-gray-300"
            />
            <button
              onClick={handleVerifyOTP}
              className={`bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 w-full mt-4 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
