import express from 'express';
import { createSubscription, verifySubscription } from '../controllers/subscriptionController.js';
import protect from '../middlewares/auth.middlerware.js';

const router = express.Router();

router.post('/create', protect, createSubscription);
router.post('/verify', protect, verifySubscription);

export default router;