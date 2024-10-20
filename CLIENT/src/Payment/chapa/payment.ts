import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

export const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  numberOfBids: number,
  bidAmount: number,
  transactionFeePercentage: number,
  txRef: string,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  event.preventDefault();

  if (numberOfBids <= 0) {
    setError("Number of bids must be greater than 0");
    return;
  }

  setError("");

  const totalAmount = numberOfBids * bidAmount;
  const transactionFee = (totalAmount * transactionFeePercentage) / 100;
  const totalCost = totalAmount + transactionFee;

  const paymentData = {
    txRef,
    amount: totalAmount,
    transactionFee,
    totalCost,
    numberOfBids,
    status: "pending",
    createdAt: new Date(),
  };

  try {
    await addDoc(collection(db, "Buy-Bids"), paymentData);
    (event.target as HTMLFormElement).submit();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
