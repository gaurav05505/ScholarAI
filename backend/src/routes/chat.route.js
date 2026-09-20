import express from "express";
import { chat } from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middlerware.js";
import subscriptionMiddleware from "../middlewares/subscriptionMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  subscriptionMiddleware,
  chat
);

export default router;