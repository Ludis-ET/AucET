import Chapa from "chapa";

const chapaKey = "secret-key"; // Your Chapa secret key
const myChapa = new Chapa(chapaKey);

// Customer information for the payment
const customerInfo = {
  amount: "100",
  currency: "ETB",
  email: "abebe@bikila.com",
  first_name: "Abebe",
  last_name: "Bikila",
  callback_url: "https://chapa.co", // Your callback URL
  customization: {
    title: "I love e-commerce",
    description: "It is time to pay",
  },
};

// Initialize the payment using async/await
export const initiatePayment = async () => {
  try {
    const response = await myChapa.initialize(customerInfo, { autoRef: true });
    console.log("Payment Initialized:", response);

    // Use response.data.checkout_url for redirect or next steps
    const checkoutUrl = response.data.checkout_url;
    return checkoutUrl; // You can return this or handle it further
  } catch (error) {
    console.error("Payment Initialization Failed:", error);
  }
};

// Verify the transaction
export const verifyPayment = async (txnRef: string) => {
  try {
    const response = await myChapa.verify(txnRef);
    console.log("Payment Verified:", response);
    return response; // You can return this or handle it further
  } catch (error) {
    console.error("Payment Verification Failed:", error);
  }
};
