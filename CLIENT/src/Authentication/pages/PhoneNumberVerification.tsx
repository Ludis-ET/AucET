import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../../firebase";

export const PhoneNumberVerification = () => {
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { handleSubmit } = useForm();
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    const verifier = new RecaptchaVerifier(auth, "recaptcha", {
      size: "invisible",
      callback: (response: string) => {
        console.log("Captcha resolved", response);
      },
      "expired-callback": () => {
        console.log("Captcha expired");
      },
    });
    setRecaptchaVerifier(verifier);
  }, []);

  const handleSendOTP = async () => {
    try {
      if (!recaptchaVerifier) {
        throw new Error("Recaptcha verifier is not initialized");
      }
      const token = await recaptchaVerifier.verify();
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
      }
    } catch (error) {
      toast.error("Invalid OTP or verification failed.");
      console.error("OTP verification failed:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-teal-500 flex justify-center items-center h-screen">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Verify Your Phone Number
        </h2>
        <form onSubmit={handleSubmit(handleSendOTP)} className="space-y-4">
          <PhoneInput
            country="ET"
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder="Enter phone number"
          />
          <div id="recaptcha"></div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 w-full"
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
