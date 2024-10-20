import { createContext, ReactNode } from "react";

interface PaymentContextType {
  payment: string;
}

export const PaymentContext = createContext<PaymentContextType | null>(null);

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider = ({ children }: PaymentProviderProps) => {
  return (
    <PaymentContext.Provider value={{ payment: "Payment" }}>
      {children}
    </PaymentContext.Provider>
  );
};
