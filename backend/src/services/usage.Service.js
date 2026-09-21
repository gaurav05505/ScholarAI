import UserModel from '../models/user.model.js';

export const recordChatUsage = async (userId) => {
  try {
    if (!userId) return null;
    const user = await UserModel.findById(userId);

    if (!user) {
      return null;
    }

    const plan = user.subscription?.plan || 'free';

    if (plan === 'free') {
        user.usage.weeklyChats = (user.usage.weeklyChats || 0) + 1;
    } else if (plan === 'pro') {
        user.usage.monthlyChats = (user.usage.monthlyChats || 0) + 1;
    }

    await user.save();
    return user;
  } catch (error) {
      console.error('Failed to record chat usage:', error);
      return null;
  }
};
