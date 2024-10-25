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

export interface RefundBid {
  user: string;
  reason: string;
  amount: number;
  status: string;
  createdAt: Date;
}

export interface FrozenBids {
  user: string;
  reason: string;
  amount: number;
  status: string;
  createdAt: Date;
}

interface PaymentState {
  totalSpentBids: number;
  totalBoughtBids: number;
  totalWithdrawnBids: number;
  totalFrozenBids: number;
  totalRefundBids: number;
  net: number;
  spendBids: SpendBid[];
  buyBids: BuyBid[];
  withdrawnBids: WithdrawnBid[];
  refundBids: RefundBid[];
  frozenBids: FrozenBids[];
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
    totalRefundBids: 0,
    net: 0,
    spendBids: [],
    buyBids: [],
    withdrawnBids: [],
    refundBids: [],
    frozenBids: [],
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

      const frozenCollection = collection(db, "Frozen-Bids");
      const frozenQuery = query(
        frozenCollection,
        where("user", "==", profile.userId)
      );
      const frozenSnapshot = await getDocs(frozenQuery);
      const frozenData = frozenSnapshot.docs.map((doc) => ({
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as FrozenBids[];

      const refundCollection = collection(db, "Refund-Bids");
      const refundQuery = query(
        refundCollection,
        where("user", "==", profile.userId)
      );
      const refundSnapshot = await getDocs(refundQuery);
      const refundData = refundSnapshot.docs.map((doc) => ({
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as RefundBid[];

      const totalSpentBids = spendData.reduce(
        (total, bid) => total + bid.bids,
        0
      );
      const totalBoughtBids = buyData.reduce(
        (total, bid) => total + bid.numberOfBids,
        0
      );
      const totalWithdrawnBids = withdrawnData.reduce(
        (total, bid) => total + bid.bids,
        0
      );
      const totalFrozenBids = frozenData.reduce(
        (total, bid) => total + bid.amount,
        0
      );
      const totalRefundBids = refundData.reduce(
        (total, bid) => total + bid.amount,
        0
      );
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
        spendBids: spendData,
        buyBids: buyData,
        withdrawnBids: withdrawnData,
        refundBids: refundData,
        frozenBids: frozenData,
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