import { Router } from "express";
import { sendSMS, verifySMS } from "../controllers/smsController";

const router = Router();

router.post("/send-sms", sendSMS);
router.post("/verify-sms", verifySMS);

export default router;
