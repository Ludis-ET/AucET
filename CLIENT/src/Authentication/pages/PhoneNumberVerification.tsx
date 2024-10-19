import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/style.css";
import { useAuth } from "../../Context";

export const PhoneNumberVerification = () => {
  const { profile, setProfile } = useAuth();
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { handleSubmit } = useForm();

  const isValidEthiopianPhoneNumber = (number: string) => {
    return number.length === 12 && number.startsWith("2519");
  };

  const handleSendOTP = async () => {
    try {
      if (!isValidEthiopianPhoneNumber(phoneNumber.toString())) {
        toast.error("Please enter a valid Ethiopian phone number.");
        return;
      }

      await axios.post("http://localhost:3000/send-otp", { phoneNumber });
      toast.success("OTP sent successfully!");
      setIsOtpSent(true);
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post("http://localhost:3000/verify-otp", {
        phoneNumber,
        otp,
      });
      if (response.status === 200) {
        toast.success("OTP verified successfully!");

        if (profile) {
          const updatedProfile = {
            ...profile,
            phoneNumber,
            phoneVerified: true,
          };

          if (setProfile) {
            setProfile(updatedProfile);
          }
        }
      }
    } catch (error) {
      toast.error("Invalid OTP or verification failed.");
      console.error("OTP verification failed:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-mainBackground to-secondaryBackground flex justify-center items-center h-screen">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-mainText">
          Verify Your Phone Number
        </h2>
        <form onSubmit={handleSubmit(handleSendOTP)} className="space-y-4">
          <PhoneInput
            country={"et"}
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder="Enter phone number"
            disableDropdown={true}
          />
          <button
            type="submit"
            className="bg-buttonBackground text-white py-2 px-4 rounded-md hover:bg-buttonHover transition-colors duration-300 w-full"
          >
            Send OTP
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
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 w-full mt-4"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );

};
