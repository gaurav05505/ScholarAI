import UserModel from '../models/user.model.js';
import PLANS from '../config/plans.js';

const subscriptionMiddleware = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User identification required.',
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const now = new Date();
    let plan = PLANS[user.subscription?.plan] ? user.subscription.plan : 'free';

    if (plan !== 'free' && (user.subscription?.status !== 'active' || !user.subscription?.endDate || user.subscription.endDate <= now)) {
      plan = 'free';
      if (user.subscription?.status === 'active' && user.subscription?.endDate && user.subscription.endDate <= now) {
        user.subscription.status = 'expired';
        await user.save();
      }
    }

    // 1. FREE PLAN
    if (plan === 'free') {
      const resetAt = new Date(user.usage?.weekResetAt || now);

      // Reset weekly usage if 7 days have passed
      if (now >= resetAt) {
        user.usage.weeklyChats = 0;
        const nextReset = new Date(now);
        nextReset.setDate(nextReset.getDate() + 7);
        user.usage.weekResetAt = nextReset;
        await user.save();
      }

      const limit = PLANS.free.weeklyChatLimit;
      const reservation = await UserModel.updateOne({ _id: user._id, 'usage.weeklyChats': { $lt: limit } }, { $inc: { 'usage.weeklyChats': 1 } });
      if (!reservation.modifiedCount) return limitReached(res, 'free', limit, user.usage.weeklyChats);
    }

    // 2. PRO PLAN
    if (plan === 'pro') {
      const resetAt = new Date(user.usage?.monthResetAt || now);

      // Reset monthly usage if 1 month has passed
      if (now >= resetAt) {
        user.usage.monthlyChats = 0;
        const nextReset = new Date(now);
        nextReset.setMonth(nextReset.getMonth() + 1);
        user.usage.monthResetAt = nextReset;
        await user.save();
      }

      const limit = PLANS.pro.monthlyChatLimit;
      const reservation = await UserModel.updateOne({ _id: user._id, 'usage.monthlyChats': { $lt: limit } }, { $inc: { 'usage.monthlyChats': 1 } });
      if (!reservation.modifiedCount) return limitReached(res, 'pro', limit, user.usage.monthlyChats);
    }

    // 3. PREMIUM PLAN: Unlimited access
    if (plan === 'premium') {
      // No limits enforced
    }

    req.currentUser = user;
    next();
  } catch (error) {
    console.error('Subscription middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Subscription verification failed',
    });
  }
};

function limitReached(res, plan, limit, used) {
  const period = plan === 'free' ? 'weekly free' : 'monthly Pro';
  return res.status(403).json({
    success: false,
    message: `You have reached your ${period} chat limit (${limit} chats). Please upgrade for more.`,
    plan, limit, used, upgradeRequired: true,
  });
}

export default subscriptionMiddleware;
