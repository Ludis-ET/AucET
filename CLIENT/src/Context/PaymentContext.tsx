import { createContext, ReactNode, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from ".";

export interface SpendBid {
  user: string;
  reason: string;
  amount: number;
  status: string;
  bids: number;
  createdAt: Date;
}

export interface BuyBid {
  txRef: string;
  amount: number;
  transactionFee: number;
  totalCost: number;
  numberOfBids: number;
  status: string;
  createdAt: Date;
  user: string;
}

export interface WithdrawnBid {
  user: string;
  amount: number;
  bids: number;
  status: string;
  createdAt: Date;
}

interface PaymentState {
  totalSpent: number;
  totalBought: number;
  totalBoughtBids: number;
  totalSpentBids: number;
  netTotalBids: number;
  spendBids: SpendBid[];
  buyBids: BuyBid[];
  withdrawnBids: WithdrawnBid[];
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
    netTotalBids: 0,
    spendBids: [],
    buyBids: [],
    withdrawnBids: [],
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

      const withdrawnCollection = collection(db, "Withdrawn-Bids");
      const withdrawnQuery = query(
        withdrawnCollection,
        where("user", "==", profile.userId)
      );
      const withdrawnSnapshot = await getDocs(withdrawnQuery);
      const withdrawnData = withdrawnSnapshot.docs.map((doc) => ({
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as WithdrawnBid[];

      const totalWithdrawnBids = withdrawnData.reduce(
        (total, bid) => total + bid.bids,
        0
      );

      const netTotalBids =
        totalBoughtBids - (totalSpentBids + totalWithdrawnBids);

      setPaymentState({
        totalSpent,
        totalBought,
        totalBoughtBids,
        totalSpentBids,
        netTotalBids,
        spendBids: spendData,
        buyBids: completedBuyBids,
        withdrawnBids: withdrawnData,
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
