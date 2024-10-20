import { useState } from "react";
import { handleSubmit } from "../chapa";
import { useAuth } from "../../Context";
import { Bids } from ".";

const generateTxRef = () => {
  const randomHash = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now();
  return `aucet-tx-${randomHash}-${timestamp}`;
};

export const BuyBid = () => {
  const frontend = import.meta.env.VITE_FRONTEND_URL;
  const publicKey = import.meta.env.VITE_CHAPA_AUTH;
  const bidAmount = Number(import.meta.env.VITE_BID_AMOUNT) || 100;
  const transactionFeePercentage =
    Number(import.meta.env.VITE_TRANSACTION_FEE) || 0;

  const [amountETB, setAmountETB] = useState(0);
  const [numberOfBids, setNumberOfBids] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [txRef, setTxRef] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const totalAmount = amountETB || numberOfBids * bidAmount;
  const transactionFee = (totalAmount * transactionFeePercentage) / 100;
  const totalCost = totalAmount + transactionFee;

  const { profile } = useAuth();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(e.target.value);
    setAmountETB(newAmount);
    setNumberOfBids(newAmount > 0 ? newAmount / bidAmount : 0);
  };

  const handleBidsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBids = Number(e.target.value);
    setNumberOfBids(newBids);
    setAmountETB(newBids * bidAmount);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);

    const newTxRef = generateTxRef();
    const newRedirectUrl = `${frontend}/payments/success/${newTxRef}`;

    setTxRef(newTxRef);
    setRedirectUrl(newRedirectUrl);

    await handleSubmit(
      event,
      numberOfBids,
      bidAmount,
      transactionFeePercentage,
      newTxRef,
      setError,
      profile
    );
    setLoading(false);
  };

  return (
    <div className="bg-secondaryBackground p-8 rounded-lg max-w-[90vw] w-96 shadow-lg">
      <header className="flex justify-between items-center gap-20 border-b-2 pb-4">
        <p className="text-mainText font-extrabold text-2xl">Buy Bids</p>
        <Bids />
      </header>
      <main className="mt-4">
        <form
          method="POST"
          action="https://api.chapa.co/v1/hosted/pay"
          onSubmit={handleFormSubmit}
        >
          <input type="hidden" name="public_key" value={publicKey} />
          <input type="hidden" name="tx_ref" value={txRef} />

          <div className="mb-4">
            <label
              htmlFor="amountETB"
              className="block text-mainText font-semibold"
            >
              Amount (ETB)
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
              htmlFor="numberOfBids"
              className="block text-mainText font-semibold"
            >
              Number of Bids
            </label>
            <input
              type="number"
              value={numberOfBids.toFixed(2)}
              onChange={handleBidsChange}
              className={`mt-1 border rounded-md outline-none p-2 w-full ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              min="0"
              step="0.01"
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <p className="text-mainText">
            Transaction Fee:{" "}
            <span className="font-bold">{transactionFee.toFixed(2)} ETB</span>
          </p>
          <p className="text-mainText">
            Total Amount:{" "}
            <span className="font-bold">{totalCost.toFixed(2)} ETB</span>
          </p>
          <input type="hidden" name="currency" value="ETB" />
          <input type="hidden" name="email" value={profile.email} />
          <input type="hidden" name="first_name" value={profile.firstName} />
          <input type="hidden" name="last_name" value={profile.lastName} />
          <input type="hidden" name="amount" value={totalAmount} />
          <input type="hidden" name="title" value="Let us do this" />
          <input
            type="hidden"
            name="description"
            value="Paying with Confidence with Chapa"
          />
          <input
            type="hidden"
            name="logo"
            value="https://chapa.link/asset/images/chapa_swirl.svg"
          />
          <input type="hidden" name="callback_url" value={redirectUrl} />
          <input type="hidden" name="return_url" value={redirectUrl} />
          <input type="hidden" name="meta[title]" value="test" />
          <button
            type="submit"
            className="mt-6 bg-buttonBackground text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-buttonHover transition duration-300"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </main>
    </div>
  );
};
