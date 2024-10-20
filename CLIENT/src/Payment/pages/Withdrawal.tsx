import { useState } from "react";
import { usePayment } from "../../Context";

export const Withdrawal = () => {
  const [amountETB, setAmountETB] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { totalSpentBids, totalBoughtBids } = usePayment();
  const net = totalBoughtBids - totalSpentBids;
  const calc = import.meta.env.VITE_BID_AMOUNT;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(e.target.value);
    setAmountETB(newAmount);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (amountETB <= 1) {
      setError("Amount must be greater than one.");
      return;
    }
    if (amountETB > net) {
      setError("Insufficient funds.");
      return;
    }
    setLoading(true);

    console.log("Withdrawn amount:", amountETB);
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

          <p className="mt-4 text-mainText">You can withdraw min 1 BID.</p>
          <p className="text-mainText">
            Total Amount:{" "}
            <span className="font-bold">
              {(amountETB * calc).toFixed(2)} ETB
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
