import React, { useState } from "react";

export const Dashboard = () => {
  const publicKey = import.meta.env.VITE_CHAPA_AUTH;
  const txRef = `negade-tx-${Date.now()}`;
  const bidAmount = Number(import.meta.env.VITE_BID_AMOUNT) || 100;
  const transactionFeePercentage =
    Number(import.meta.env.VITE_TRANSACTION_FEE) || 0;

  const [numberOfBids, setNumberOfBids] = useState(1);
  const [error, setError] = useState("");

  const totalAmount = numberOfBids * bidAmount;
  const transactionFee = (totalAmount * transactionFeePercentage) / 100;
  const totalCost = totalAmount + transactionFee;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (numberOfBids <= 0) {
      setError("Number of bids must be greater than 0");
      return;
    }

    setError("");

    // Create headers for the request
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${publicKey}`); // Use the public key for authorization
    myHeaders.append("Content-Type", "application/json");

    // Create the request body
    const raw = JSON.stringify({
      amount: totalAmount.toString(), // Convert to string
      currency: "ETB",
      email: "leulsegedmelaku1020@gmail.com", // Your email or any dynamic email
      first_name: "Israel",
      last_name: "Goytom",
      tx_ref: txRef,
      callback_url: "http://payment.localhost:5173/success", // Replace with your actual callback URL
      return_url: "http://payment.localhost:5173/success", // Replace with your actual return URL
      customization: {
        title: "Payment for my favourite merchant",
        description: "I love online payments",
      },
      meta: {
        hide_receipt: "true",
      },
    });

    // Request options
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    try {
      const response = await fetch(
        "https://api.chapa.co/v1/transaction/initialize",
        requestOptions
      );
      const result = await response.json(); // Parse the JSON response

      if (response.ok) {
        // Redirect to the payment URL
        window.location.href = result.data.link; // Assuming result.data.link contains the payment URL
      } else {
        setError(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log("Error:", error);
      setError("Network error. Please try again.");
    }
  };

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
          <form onSubmit={handleSubmit}>
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
