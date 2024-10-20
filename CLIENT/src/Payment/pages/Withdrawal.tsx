import { useState } from "react";
import { useAuth } from "../../Context";

export const Withdrawal = () => {
  const frontend = import.meta.env.VITE_FRONTEND_URL;
  const publicKey = import.meta.env.VITE_CHAPA_AUTH;
  const [amountETB, setAmountETB] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [txRef, setTxRef] = useState("");

  const { profile } = useAuth();

  const generateTxRef = () => {
    const randomHash = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    return `withdrawal-tx-${randomHash}-${timestamp}`;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = Number(e.target.value);
    setAmountETB(newAmount);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    setLoading(true);
    const newTxRef = generateTxRef();
    setTxRef(newTxRef);

    // This is where you could add any additional validation or processing

    // Proceed to handle submission to the Chapa API
    const formData = new FormData(event.target as HTMLFormElement);

    // Add any additional fields here if necessary
    const requestOptions = {
      method: "POST",
      action: "https://api.chapa.co/v1/hosted/pay",
      body: formData,
    };

    fetch(requestOptions.action, {
      method: requestOptions.method,
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result); // Handle success response
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error during withdrawal:", error); // Handle error response
        setError("Withdrawal failed. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="bg-secondaryBackground p-8 rounded-lg max-w-[90vw] w-96 shadow-lg">
      <header className="flex justify-between items-center gap-20 border-b-2 pb-4">
        <p className="text-mainText font-extrabold text-2xl">Withdrawal</p>
      </header>
      <main className="mt-4">
        <form method="POST" onSubmit={handleFormSubmit}>
          <input type="hidden" name="public_key" value={publicKey} />
          <input type="hidden" name="tx_ref" value={txRef} />
          <input type="hidden" name="currency" value="ETB" />
          <input type="hidden" name="email" value={profile.email} />
          <input type="hidden" name="first_name" value={profile.firstName} />
          <input type="hidden" name="last_name" value={profile.lastName} />
          <input type="hidden" name="amount" value={amountETB} />
          <input type="hidden" name="title" value="Withdrawal Request" />
          <input
            type="hidden"
            name="description"
            value="Withdrawal from account"
          />
          <input
            type="hidden"
            name="logo"
            value="https://chapa.link/asset/images/chapa_swirl.svg"
          />
          <input
            type="hidden"
            name="callback_url"
            value={`${frontend}/withdrawals/callback`}
          />
          <input
            type="hidden"
            name="return_url"
            value={`${frontend}/withdrawals/success`}
          />

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
