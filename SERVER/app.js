const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const twilio = require("twilio");
const axios = require("axios");

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
const client = twilio(accountSid, authToken);

app.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    res
      .status(200)
      .json({ message: "OTP sent successfully", sid: verification.sid });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP", details: error });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: otp });

    if (verificationCheck.status === "approved") {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ error: "Verification failed", details: error });
  }
});

// Chapa payment integration
const CHAPA_URL =
  process.env.CHAPA_URL || "https://api.chapa.co/v1/transaction/initialize";
const CHAPA_AUTH = "CHAPUBK_TEST-vxAH7K5JAqaZCING3COqKWxpSl9hAf6V";

const config = {
  headers: {
    Authorization: `Bearer ${CHAPA_AUTH}`,
    "Content-Type": "application/json",
  },
};

app.post("/initialize-payment", async (req, res) => {
  const CALLBACK_URL = "http://localhost:3000/api/verify-payment/";
  const RETURN_URL = "http://localhost:3000/api/payment-success/";
  const TEXT_REF = "tx-myecommerce12345-" + Date.now();

  const data = {
    amount: req.body.amount,
    currency: "ETB",
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    tx_ref: TEXT_REF,
    callback_url: CALLBACK_URL + TEXT_REF,
    return_url: RETURN_URL,
  };

  try {
    const response = await axios.post(CHAPA_URL, data, config);
    res.redirect(response.data.data.checkout_url);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Payment initialization failed", details: error });
  }
});

app.get("/api/verify-payment/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${req.params.id}`,
      config
    );
    console.log("Payment was successfully verified");
    res.status(200).json(response.data);
  } catch (error) {
    console.log("Payment can't be verified", error);
    res.status(500).json({ error: "Verification failed", details: error });
  }
});

app.get("/api/payment-success", (req, res) => {
  res.status(200).json({ message: "Payment success!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
