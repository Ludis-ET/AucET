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
import { toast } from "react-hot-toast";

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
    toast.success("Payment successfully processed.");
    (event.target as HTMLFormElement).submit();
  } catch (e) {
    toast.error("Error adding payment document.");
    console.error("Error adding document: ", e);
  }
};

export const addWithdrawnBid = async (
  profile: Profile,
  amount: number,
  bids: number
) => {
  try {
    const withdrawnBidData = {
      user: profile.userId,
      amount,
      bids,
      status: "withdrawn",
      createdAt: new Date(),
    };

    await addDoc(collection(db, "Withdrawn-Bids"), withdrawnBidData);
    toast.success(
      `Withdrawn bid of ${amount} added for user ${profile.userId}.`
    );
  } catch (error) {
    toast.error("Error adding withdrawn bid record.");
    console.error("Error adding withdrawn bid record: ", error);
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
    toast.success("Spend bid successfully added.");
  } catch (error) {
    toast.error("Error adding spend record.");
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

        toast.success(`Payment status for ${txref} updated to completed.`);
      } else {
        toast.error(`No payment found with txref: ${txref}.`);
        console.error(`No payment found with txref: ${txref}`);
      }
    } else {
      toast.error("Transaction reference (txref) is undefined.");
      console.error("Transaction reference (txref) is undefined.");
    }
  } catch (error) {
    toast.error("Error updating payment status.");
    console.error("Error updating payment status: ", error);
  }
};
