import { Request, Response } from "express";
import twilioClient from "../config/twilioConfig";

export const sendSMS = async (req: Request, res: Response) => {
  const { phoneNumber, message } = req.body;

  try {
    const messageSent = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    res
      .status(200)
      .json({
        success: true,
        message: "SMS sent successfully!",
        messageId: messageSent.sid,
      });
  } catch (error) {
    throw new Error("Error sending SMS");
  }
};

export const verifySMS = async (req: Request, res: Response) => {
  const { phoneNumber, verificationCode } = req.body;

  const isCodeValid = verificationCode === "123456";

  if (isCodeValid) {
    res
      .status(200)
      .json({ success: true, message: "Phone number verified successfully!" });
  } else {
    throw new Error("Invalid verification code");
  }
};
