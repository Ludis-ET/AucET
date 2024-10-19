import { useState } from "react";
import toast from "react-hot-toast";

export const PhoneNumberVerification = ({
  setPhoneNumber,
}: {
  setPhoneNumber: (phone: string) => void;
}) => {
  const [phoneNumber, setPhoneNumberLocal] = useState("");

  const handleVerifyPhone = () => {
    if (phoneNumber.length >= 10) {
      // Add Firebase verification logic here
      setPhoneNumber(phoneNumber);
      toast.success("Phone number verified successfully!");
    } else {
      toast.error("Please enter a valid phone number.");
    }
  };

  return (
    <div className="bg-mainBackground flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Verify Your Phone Number</h2>
        <input
          type="tel"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumberLocal(e.target.value)}
          className="p-2 border rounded-md w-full mb-4"
        />
        <button
          onClick={handleVerifyPhone}
          className="bg-buttonBackground text-white py-2 px-4 rounded-md hover:bg-buttonHover"
        >
          Verify
        </button>
      </div>
    </div>
  );
};
