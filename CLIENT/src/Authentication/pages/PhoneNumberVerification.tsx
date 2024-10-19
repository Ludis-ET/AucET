import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios"; 
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";

export const PhoneNumberVerification = () => {
  const [phoneNumber, setPhoneNumberLocal] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); 
  const backend = import.meta.env.VITE_BACKEND_URL;

  const handleSendOTP = async () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptcha
      );

      
      await axios.post(`${backend}/send-otp`, { phoneNumber });

      toast.success("OTP sent successfully!");
      console.log(confirmation);
      setIsOtpSent(true);
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(`${backend}/verify-otp`, {
        phoneNumber,
        otp,
      });

      if (response.status === 200) {
        toast.success("OTP verified successfully!");
      }
    } catch (error) {
      toast.error("Invalid OTP or verification failed.");
      console.error(error);
    }
  };

  return (
    <div className="bg-mainBackground flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Verify Your Phone Number</h2>
        <input
          type="tel"
          placeholder="Enter phone number (+251...)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumberLocal(e.target.value)}
          className="p-2 border rounded-md w-full mb-4"
        />
        <div id="recaptcha"></div>
        <button
          onClick={handleSendOTP}
          className="bg-buttonBackground text-white py-2 px-4 rounded-md hover:bg-buttonHover"
        >
          Send OTP
        </button>
        {isOtpSent && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-2 border rounded-md w-full mb-4"
            />
            <button
              onClick={handleVerifyOTP}
              className="bg-buttonBackground text-white py-2 px-4 rounded-md hover:bg-buttonHover"
            >
              Verify OTP
            </button>
          </div>
        )}
        <div id="recaptcha-container"></div> {/* Invisible recaptcha */}
      </div>
    </div>
  );
};
