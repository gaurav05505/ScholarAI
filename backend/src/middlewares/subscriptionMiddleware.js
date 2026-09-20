import UserModel from '../models/user.model.js';

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

    const plan = user.subscription?.plan || 'free';
    const now = new Date();

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

      // Free plan limit: 2 chats per week
      if (user.usage.weeklyChats >= 2) {
        return res.status(403).json({
          success: false,
          message: 'You have reached your weekly free chat limit (2 chats). Please upgrade to Pro for more.',
          plan: 'free',
          limit: 2,
          used: user.usage.weeklyChats,
          upgradeRequired: true,
        });
      }
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

      // Pro plan limit: 50 chats per month
      if (user.usage.monthlyChats >= 50) {
        return res.status(403).json({
          success: false,
          message: 'You have reached your monthly Pro chat limit (50 chats). Please upgrade to Premium for unlimited access.',
          plan: 'pro',
          limit: 50,
          used: user.usage.monthlyChats,
          upgradeRequired: true,
        });
      }
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

export default subscriptionMiddleware;
