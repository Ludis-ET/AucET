import { useState } from "react";
import { useAuth, usePayment } from "../../Context";
import { addWithdrawnBid } from "../chapa";

export const Withdrawal = () => {
  const [amountETB, setAmountETB] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { net } = usePayment();
  const calc = import.meta.env.VITE_BID_AMOUNT;
  const { profile } = useAuth();
  const transactionFeePercentage = 0.1;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(e.target.value);
    setAmountETB(newAmount);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const withdrawalAmount = amountETB * calc;
    const transactionFee = withdrawalAmount * transactionFeePercentage;
    const amountAfterFee = withdrawalAmount + transactionFee;
    const bidAfterFee = amountAfterFee / calc;

    if (amountETB <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    if (amountAfterFee <= 0) {
      setError(
        "Withdrawal amount after transaction fee must be greater than zero."
      );
      return;
    }
    if (bidAfterFee > net) {
      setError("Insufficient funds.");
      return;
    }

    setLoading(true);
    await addWithdrawnBid(profile, amountAfterFee, phoneNumber);
    setLoading(false);
  };

  return (
    <div className="bg-secondaryBackground p-8 rounded-lg max-w-[90vw] min-w-[20vw] shadow-lg">
      <header className="flex justify-between items-center gap-20 border-b-2 pb-4">
        <p className="text-mainText font-extrabold text-2xl">Withdrawal</p>
      </header>
      <main className="mt-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="amountETB"
              className="block text-mainText font-semibold"
            >
              Amount (BIDS)
            </label>
            <input
              type="number"
              value={amountETB.toFixed(2)}
              onChange={handleAmountChange}
              className={`mt-1 border rounded-md outline-none p-2 w-full ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              min="0"
              step="0.01"
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-mainText font-semibold"
            >
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber || profile.phoneNumber}
              onChange={handlePhoneChange}
              className={`mt-1 border rounded-md outline-none p-2 w-full ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
          </div>

          <p className="mt-4 text-mainText">You can withdraw min 1 BID.</p>
          <p className="text-mainText">
            Total Amount After Fee:{" "}
            <span className="font-bold">
              {(
                amountETB * calc +
                amountETB * calc * transactionFeePercentage
              ).toFixed(2)}{" "}
              ETB
            </span>
          </p>
          <p className="text-mainText">
            Transaction Fee:{" "}
            <span className="font-bold">
              {(amountETB * calc * transactionFeePercentage).toFixed(2)} ETB
            </span>
          </p>

          <button
            type="submit"
            className="mt-6 bg-buttonBackground text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-buttonHover transition duration-300"
            disabled={loading}
          >
            {loading ? "Processing..." : "Withdraw Now"}
          </button>
        </form>
      </main>
    </div>
  );
};
