import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
} from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../../firebase";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container", // The ID of the recaptcha container div
      {
        size: "invisible", // Correct placement for size
        callback: () => {
          toast.success("Recaptcha verified successfully!");
        },
        "expired-callback": () => {
          toast.error("Recaptcha expired. Please try again.");
        },
      }
    );
  }
};

// Send OTP to the user's phone number
export const sendOTP = async (phoneNumber: string): Promise<string | null> => {
  try {
    // Ensure the phone number is from Ethiopia (+251)
    if (!phoneNumber.startsWith("+251")) {
      toast.error("Phone number must start with +251 for Ethiopia.");
      return null;
    }

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    );
    toast.success("OTP sent successfully!");
    return confirmationResult.verificationId;
  } catch (error) {
    toast.error((error as Error).message);
    throw error;
  }
};

// Verify OTP code and link phone number to the user's account
export const verifyOTP = async (
  verificationId: string,
  verificationCode: string,
  phoneNumber: string,
  setPhoneNumber: (phone: string) => void
) => {
  try {
    const credential = PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );
    await auth.currentUser?.linkWithCredential(credential);
    setPhoneNumber(phoneNumber);
    toast.success("Phone number verified successfully!");
  } catch (error) {
    toast.error((error as Error).message);
    throw error;
  }
};
