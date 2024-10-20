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

interface PaymentContextType {
  totalSpent: number;
  totalBought: number;
  totalBoughtBids: number;
  totalSpentBids: number;
  spendBids: SpendBid[];
  buyBids: BuyBid[];
  loading: boolean;
}

export const PaymentContext = createContext<PaymentContextType | null>(null);

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider = ({ children }: PaymentProviderProps) => {
  const { profile } = useAuth();
  const [spendBids, setSpendBids] = useState<SpendBid[]>([]);
  const [buyBids, setBuyBids] = useState<BuyBid[]>([]);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [totalBought, setTotalBought] = useState<number>(0);
  const [totalBoughtBids, setTotalBoughtBids] = useState<number>(0);
  const [totalSpentBids, setTotalSpentBids] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile || !profile.userId) return;

      setLoading(true);

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

      setSpendBids(spendData);
      setTotalSpent(spendData.reduce((total, bid) => total + bid.amount, 0));
      setTotalSpentBids(spendData.reduce((total, bid) => total + bid.bids, 0));

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

      setBuyBids(completedBuyBids);
      setTotalBought(
        completedBuyBids.reduce((total, bid) => total + bid.amount, 0)
      );
      setTotalBoughtBids(
        completedBuyBids.reduce((total, bid) => total + bid.numberOfBids, 0)
      );

      setLoading(false);
    };

    fetchData();
  }, [profile]);

  const value = {
    totalSpent,
    totalBought,
    spendBids,
    buyBids,
    totalBoughtBids,
    totalSpentBids,
    loading,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};
