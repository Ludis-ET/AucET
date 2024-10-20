import { createContext, ReactNode, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from ".";

interface SpendBid {
  user: string;
  reason: string;
  amount: number;
  bids: number;
  createdAt: Date;
}

interface BuyBid {
  txRef: string;
  amount: number;
  transactionFee: number;
  totalCost: number;
  numberOfBids: number;
  status: string;
  createdAt: Date;
  user: string;
}

interface PaymentState {
  totalSpent: number;
  totalBought: number;
  totalBoughtBids: number;
  totalSpentBids: number;
  spendBids: SpendBid[];
  buyBids: BuyBid[];
  loading: boolean;
}

export const PaymentContext = createContext<PaymentState | null>(null);

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider = ({ children }: PaymentProviderProps) => {
  const { profile } = useAuth();
  const [paymentState, setPaymentState] = useState<PaymentState>({
    totalSpent: 0,
    totalBought: 0,
    totalBoughtBids: 0,
    totalSpentBids: 0,
    spendBids: [],
    buyBids: [],
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!profile || !profile.userId) return;

      setPaymentState((prevState) => ({ ...prevState, loading: true }));

      const spendCollection = collection(db, "Spend-Bids");
      const spendQuery = query(
        spendCollection,
        where("user", "==", profile.userId)
      );
      const spendSnapshot = await getDocs(spendQuery);
      const spendData = spendSnapshot.docs.map((doc) => ({
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as SpendBid[];

      
      const totalSpent = spendData.reduce(
        (total, bid) => total + bid.amount,
        0
      );
      const totalSpentBids = spendData.reduce(
        (total, bid) => total + bid.bids,
        0
      );

      
      const buyCollection = collection(db, "Buy-Bids");
      const buyQuery = query(
        buyCollection,
        where("user", "==", profile.userId)
      );
      const buySnapshot = await getDocs(buyQuery);
      const buyData = buySnapshot.docs.map((doc) => ({
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as BuyBid[];

      
      const completedBuyBids = buyData.filter(
        (bid) => bid.status === "completed"
      );

      
      const totalBought = completedBuyBids.reduce(
        (total, bid) => total + bid.amount,
        0
      );
      const totalBoughtBids = completedBuyBids.reduce(
        (total, bid) => total + bid.numberOfBids,
        0
      );

      
      setPaymentState({
        totalSpent,
        totalBought,
        totalBoughtBids,
        totalSpentBids,
        spendBids: spendData,
        buyBids: completedBuyBids,
        loading: false,
      });
    };

    fetchData();
  }, [profile]);

  return (
    <PaymentContext.Provider value={paymentState}>
      {children}
    </PaymentContext.Provider>
  );
};
