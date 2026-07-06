import express from "express";
import { chat } from "../controllers/chat.controller.js";
import protect from "../middlewares/auth.middlerware.js";

const router = express.Router();

router.post("/", protect, chat);

export default router;