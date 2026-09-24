import razorpay from '../services/razorpay.service.js';
import crypto from 'crypto';
import UserModel from '../models/user.model.js';

const PLANS = {
  pro: {
    amount: 499 * 100, // 49900 paise = ₹499
    name: 'Pro',
    durationDays: 30,
  },
  premium: {
    amount: 799 * 100, // 79900 paise = ₹799
    name: 'Premium',
    durationDays: 30,
  },
};

// 1. Create a Razorpay Order
export async function createOrder(req, res) {
  try {
    const rawPlan = req.body.plan;
    const plan = typeof rawPlan === 'string' ? rawPlan.toLowerCase().trim() : '';

    if (!plan || !PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan. Choose "pro" or "premium".',
      });
    }

    const selectPlan = PLANS[plan];
    const userId = req.user?._id?.toString() || 'anonymous';

    const options = {
      amount: selectPlan.amount, // in paise
      currency: 'INR',
      receipt: `rcpt_${userId.slice(-6)}_${Date.now()}`,
      notes: {
        userId: userId,
        plan: plan,
      },
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: plan,
      planName: selectPlan.name,
      keyId: process.env.RAZORPAY_KEY_ID || '',
    });
  } catch (error) {
    console.error('Razorpay create order error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order.',
    });
  }
}

// 2. Verify Razorpay Payment Signature and Activate Subscription
export async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
    const userId = req.user?._id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification parameters are missing.',
      });
    }

    const normalizedPlan = typeof plan === 'string' ? plan.toLowerCase().trim() : 'pro';

    if (!PLANS[normalizedPlan]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan.',
      });
    }

    // Verify HMAC-SHA256 signature
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed. Untrusted payment.',
      });
    }

    // Update user subscription in database
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (PLANS[normalizedPlan].durationDays || 30));

    user.subscription = {
      plan: normalizedPlan,
      status: 'active',
      startDate: startDate,
      endDate: endDate,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    };

    // Reset chat usage for the upgraded tier
    user.usage.weeklyChats = 0;
    user.usage.monthlyChats = 0;
    const nextWeek = new Date(startDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    user.usage.weekResetAt = nextWeek;
    user.usage.monthResetAt = endDate;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Subscription successfully upgraded to ${PLANS[normalizedPlan].name}!`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        usage: user.usage,
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify payment.',
    });
  }
}

// 3. Get Current Payment / Subscription Status
export async function getPaymentStatus(req, res) {
  try {
    const user = await UserModel.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      subscription: user.subscription,
      usage: user.usage,
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve subscription status',
    });
  }
}

export default {
  createOrder,
  verifyPayment,
  getPaymentStatus,
};