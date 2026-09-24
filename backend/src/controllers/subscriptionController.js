import razorpay from '../services/razorpay.service.js';
import crypto from 'crypto';
import UserModel from '../models/user.model.js';

export const createSubscription = async (req, res) => {
  try {
    const rawPlan = req.body.plan;
    const plan = typeof rawPlan === 'string' ? rawPlan.toLowerCase().trim() : '';

    if (plan !== 'pro' && plan !== 'premium') {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan. Must be "pro" or "premium".',
      });
    }

    const planId =
      plan === 'pro' ? process.env.RAZORPAY_PRO_PLAN_ID : process.env.RAZORPAY_PREMIUM_PLAN_ID;

    if (!planId) {
      return res.status(500).json({
        success: false,
        message: `Razorpay plan ID for ${plan} is not configured in environment variables.`,
      });
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 12, // 12 billing cycles
      customer_notify: 1,
      notes: {
        userId: req.user?._id?.toString() || 'anonymous',
        plan: plan,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      subscriptionId: subscription.id,
      plan,
      keyId: process.env.RAZORPAY_KEY_ID || '',
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create subscription',
    });
  }
};

export const verifySubscription = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, plan } = req.body;
    const userId = req.user?._id;

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing subscription verification parameters.',
      });
    }

    // Verify HMAC-SHA256 signature for Razorpay Subscriptions
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${razorpay_payment_id}|${razorpay_subscription_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Subscription payment verification failed. Invalid signature.',
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const targetPlan = plan === 'premium' ? 'premium' : 'pro';
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    user.subscription = {
      plan: targetPlan,
      status: 'active',
      startDate: startDate,
      endDate: endDate,
      razorpaySubscriptionId: razorpay_subscription_id,
      razorpayPaymentId: razorpay_payment_id,
    };

    user.usage.weeklyChats = 0;
    user.usage.monthlyChats = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Subscription successfully activated for ${targetPlan}!`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        usage: user.usage,
      },
    });
  } catch (error) {
    console.error('Verify subscription error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify subscription.',
    });
  }
};

export default {
  createSubscription,
  verifySubscription,
};