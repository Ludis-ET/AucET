import express from "express";
import bodyParser from "body-parser";
import { Twilio } from "twilio";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const otps: { [key: string]: string } = {};

app.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    otps[phoneNumber] = otp;

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

app.post("/verify-otp", (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (otps[phoneNumber] === otp) {
    delete otps[phoneNumber];
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
