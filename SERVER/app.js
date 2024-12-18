const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const twilio = require("twilio");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
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
      .verifications.create({ to: `+${phoneNumber}`, channel: "sms" });
    res
      .status(200)
      .json({ message: "OTP sent successfully", sid: verification.sid });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Failed to send OTP", details: error.message });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { phoneNumber, otp } = req.body;
  try {
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: `+${phoneNumber}`, code: otp });
    if (verificationCheck.status === "approved") {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
    console.log(error);
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Verification failed", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
