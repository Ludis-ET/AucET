import { db } from "../../firebase";
import { collection, addDoc, updateDoc, query, where, getDocs } from "firebase/firestore";

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


export const updatePaymentStatus = async (txref: string) => {
  try {
    if (txref) {
      const paymentQuery = query(
        collection(db, "Buy-Bids"),
        where("txRef", "==", txref)
      );

      const querySnapshot = await getDocs(paymentQuery);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref; 

        await updateDoc(docRef, {
          status: "completed",
        });

        console.log(`Payment status for ${txref} updated to completed.`);
      } else {
        console.error(`No payment found with txref: ${txref}`);
      }
    } else {
      console.error("Transaction reference (txref) is undefined.");
    }
  } catch (error) {
    console.error("Error updating payment status: ", error);
  }
};