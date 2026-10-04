import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = keyId && keySecret ? new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
}) : {
  orders: {
    create: async () => { throw new Error('Razorpay is not configured'); },
    fetch: async () => { throw new Error('Razorpay is not configured'); },
  },
  payments: {
    fetch: async () => { throw new Error('Razorpay is not configured'); },
  },
};

export default razorpay;
