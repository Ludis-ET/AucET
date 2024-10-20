import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PaymentInfo {
  txRef: string | null;
  amount: string | null;
  currency: string | null;
}

export const Success = () => {
  const location = useLocation();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    const txRef = params.get("tx_ref");
    const amount = params.get("amount");
    const currency = params.get("currency");

    if (status === "success") {
      setPaymentInfo({
        txRef,
        amount,
        currency,
      });
    }
  }, [location]);
  console.log(paymentInfo); 

  return (
    <div className="bg-mainBackground h-screen flex justify-center items-center p-4">
      <div className="bg-secondaryBackground p-8 rounded-lg min-w-96 shadow-lg">
        <h1 className="text-mainText font-extrabold text-2xl">
          Payment Successful
        </h1>
        {paymentInfo && (
          <div className="mt-4">
            <p>Transaction Reference: {paymentInfo.txRef}</p>
            <p>
              Amount Paid: {paymentInfo.amount} {paymentInfo.currency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
