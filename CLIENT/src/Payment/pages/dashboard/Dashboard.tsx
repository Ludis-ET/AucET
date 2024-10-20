import { useState } from "react";
import { handleSubmit } from "../../chapa";

export const Dashboard = () => {
  const publicKey = import.meta.env.VITE_CHAPA_AUTH;
  const txRef = `aucet-tx-${Date.now()}`;
  const bidAmount = Number(import.meta.env.VITE_BID_AMOUNT) || 100;
  const transactionFeePercentage =
    Number(import.meta.env.VITE_TRANSACTION_FEE) || 0;
  const [numberOfBids, setNumberOfBids] = useState(1);
  const [error, setError] = useState("");

  const totalAmount = numberOfBids * bidAmount;
  const transactionFee = (totalAmount * transactionFeePercentage) / 100;
  const totalCost = totalAmount + transactionFee;

  return (
    <div className="bg-mainBackground h-screen overflow-hidden flex justify-center items-center p-4">
      <div className="bg-secondaryBackground p-8 rounded-lg min-w-96 shadow-lg">
        <header className="flex justify-between items-center gap-20 border-b-2 pb-4">
          <p className="text-mainText font-extrabold text-2xl">
            Ludis Payment Page
          </p>
          <span className="bg-buttonBackground text-white p-2 rounded-full flex gap-2 font-bold">
            {numberOfBids} <span className="font-normal">BIDS</span>
          </span>
        </header>
        <main className="mt-4">
          <form
            method="POST"
            action="https://api.chapa.co/v1/hosted/pay"
            onSubmit={(event) =>
              handleSubmit(
                event,
                numberOfBids,
                bidAmount,
                transactionFeePercentage,
                txRef,
                setError
              )
            }
          >
            <input type="hidden" name="public_key" value={publicKey} />
            <input type="hidden" name="tx_ref" value={txRef} />
            <div className="mb-4">
              <label
                htmlFor="numberOfBids"
                className="block text-mainText font-semibold"
              >
                Number of Bids
              </label>
              <input
                type="number"
                value={numberOfBids}
                onChange={(e) => setNumberOfBids(Number(e.target.value))}
                className={`mt-1 border rounded-md p-2 w-full ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                min="1"
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
            <input
              type="hidden"
              name="email"
              value="leulsegedmelaku1020@gmail.com"
            />
            <input type="hidden" name="first_name" value="Israel" />
            <input type="hidden" name="last_name" value="Goytom" />
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
            <input
              type="hidden"
              name="callback_url"
              value="http://payment.localhost:5173/success/:callback"
            />
            <input
              type="hidden"
              name="return_url"
              value="http://payment.localhost:5173/txref"
            />
            <input type="hidden" name="meta[title]" value="test" />
            <button
              type="submit"
              className="mt-6 bg-buttonBackground text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-buttonHover transition duration-300"
            >
              Pay Now
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};
