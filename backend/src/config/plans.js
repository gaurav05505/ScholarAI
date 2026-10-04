const PLANS = Object.freeze({
  free: Object.freeze({ id: 'free', name: 'Standard', amount: 0, currency: 'INR', durationDays: null, weeklyChatLimit: 2, monthlyChatLimit: 0 }),
  pro: Object.freeze({ id: 'pro', name: 'Pro', amount: 49900, currency: 'INR', durationDays: 30, weeklyChatLimit: 0, monthlyChatLimit: 50 }),
  premium: Object.freeze({ id: 'premium', name: 'Researcher', amount: 79900, currency: 'INR', durationDays: 30, weeklyChatLimit: 0, monthlyChatLimit: null }),
});

export default PLANS;
