import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { PaymentContext } from "./PaymentContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const usePayment = () => {
  const context = useContext(PaymentContext);

  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }

  return context;
};

export { AuthProvider } from "./AuthContext";
export { PaymentProvider } from "./PaymentContext";

export type { Profile } from "./AuthContext";
export type { BuyBid, SpendBid } from "./PaymentContext";

