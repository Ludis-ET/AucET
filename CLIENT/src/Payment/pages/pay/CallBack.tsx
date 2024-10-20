import { useEffect } from "react";
import { db } from "../../../firebase";
import { doc, updateDoc } from "firebase/firestore";

export const Callback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const txRef = urlParams.get("txRef");
  const status = urlParams.get("status");

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (!txRef || !status) return;

      try {
        const paymentRef = doc(db, "payments", txRef);
        await updateDoc(paymentRef, {
          status: status === "successful" ? "completed" : "failed",
        });
        console.log("Payment status updated successfully");
      } catch (error) {
        console.error("Error updating payment status: ", error);
      }
    };

    updatePaymentStatus();
  }, [txRef, status]);

  return (
    <div>
      <h2>Payment Callback</h2>
      <p>Payment status has been processed.</p>
    </div>
  );
};
