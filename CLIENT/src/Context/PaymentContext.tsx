import { createContext, ReactNode, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from ".";

export interface SpentBid {
  user: string;
  amount: number;
  reason?: string;
  status: "spent" | "refund" | "frozen";
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
  status: string;
  createdAt: Date;
}

interface PaymentState {
  totalSpentBids: number;
  totalBoughtBids: number;
  totalWithdrawnBids: number;
  totalRefundBids: number;
  totalFrozenBids: number;
  net: number;
  spentBids: SpentBid[];
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
    totalSpentBids: 0,
    totalBoughtBids: 0,
    totalWithdrawnBids: 0,
    totalFrozenBids: 0,
    totalRefundBids:0,
    net: 0,
    spentBids: [],
    buyBids: [],
    withdrawnBids: [],
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!profile || !profile.userId) return;

      setPaymentState((prevState) => ({ ...prevState, loading: true }));

      const spentCollection = collection(db, "Spend-Bids");
      const spentQuery = query(
        spentCollection,
        where("user", "==", profile.userId)
      );
      const spentSnapshot = await getDocs(spentQuery);
      const spentData = spentSnapshot.docs.map((doc) => ({
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as SpentBid[];

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

      const totalSpentBids = spentData
        .filter((spent) => spent.status === "spent")
        .reduce((total, bid) => total + bid.amount, 0);

      const totalBoughtBids = buyData.reduce(
        (total, bid) => total + bid.numberOfBids,
        0
      );

      const totalWithdrawnBids = withdrawnData.reduce(
        (total, bid) => total + bid.amount,
        0
      );

      const totalFrozenBids = spentData
        .filter((bid) => bid.status === "frozen")
        .reduce((total, bid) => total + bid.amount, 0);

      const totalRefundBids = spentData
        .filter((bid) => bid.status === "refund")
        .reduce((total, bid) => total + bid.amount, 0);

      const net =
        totalBoughtBids +
        totalRefundBids -
        (totalSpentBids + totalWithdrawnBids + totalFrozenBids);

      setPaymentState({
        totalSpentBids,
        totalBoughtBids,
        totalWithdrawnBids,
        totalFrozenBids,
        totalRefundBids,
        net,
        spentBids: spentData,
        buyBids: buyData,
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
