import { useState } from "react";
import toast from "react-hot-toast";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";

export const PhoneNumberVerification = () => {
  const [phoneNumber, setPhoneNumberLocal] = useState("");

  const handleSendOTP = async () => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptcha
      );
      toast.success("OTP sent successfully!");
      console.log(confirmation);
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
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
        <div id="recaptcha-container"></div> {/* Invisible recaptcha */}
      </div>
    </div>
  );
};
