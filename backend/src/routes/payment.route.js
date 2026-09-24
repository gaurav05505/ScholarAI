import express from 'express';
import { createOrder, verifyPayment, getPaymentStatus } from '../controllers/payment.controller.js';
import protect from '../middlewares/auth.middlerware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/status', protect, getPaymentStatus);

export default router;
