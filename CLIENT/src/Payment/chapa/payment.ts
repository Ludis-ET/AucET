import { Profile } from "../../Context";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  numberOfBids: number,
  bidAmount: number,
  transactionFeePercentage: number,
  txRef: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
  profile: Profile
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
    user: profile.userId,
  };

  try {
    await addDoc(collection(db, "Buy-Bids"), paymentData);
    (event.target as HTMLFormElement).submit();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const addSpendBid = async (
  profile: Profile,
  reason: string,
  amount: number
) => {
  const bidAmount = Number(import.meta.env.VITE_BID_AMOUNT) || 100;
  try {
    const spendData = {
      user: profile.userId,
      reason,
      bids: amount,
      status: "frozen",
      amount: amount * bidAmount,
      createdAt: new Date(),
    };

    await addDoc(collection(db, "Spend-Bids"), spendData);
  } catch (error) {
    console.error("Error adding spend record: ", error);
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
