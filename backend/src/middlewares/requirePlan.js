const requirePlan = (requiredPlan) => (req, res, next) => {
  const subscription = req.user?.subscription;
  const active = subscription?.status === 'active'
    && subscription?.endDate
    && new Date(subscription.endDate) > new Date();
  const allowed = requiredPlan === 'premium'
    ? subscription?.plan === 'premium'
    : requiredPlan === 'pro'
      ? ['pro', 'premium'].includes(subscription?.plan)
      : false;

  if (!active || !allowed) {
    return res.status(403).json({ success: false, message: `An active ${requiredPlan} plan is required for this feature.`, upgradeRequired: true });
  }
  return next();
};

export default requirePlan;
