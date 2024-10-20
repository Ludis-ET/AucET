import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { updatePaymentStatus } from "../chapa";

export const Callback = () => {
  const { txref } = useParams<{ txref: string }>();

  useEffect(() => {
    if (txref) {
      updatePaymentStatus(txref);
    }
  }, [txref]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-mainBackground p-4">
      <div className="bg-secondaryBackground rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-extrabold text-mainText mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-otherText mb-4">
          Your payment status has been successfully updated.
        </p>
        <a
          href="/"
          className="mt-4 bg-buttonBackground text-white font-bold py-2 px-4 rounded-full hover:bg-buttonHover transition duration-300"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};
