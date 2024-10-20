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
    <div>
      <h1>Payment Status Update</h1>
      <p>
        Your payment status has been updated. Transaction Reference: {txref}
      </p>
    </div>
  );
};
