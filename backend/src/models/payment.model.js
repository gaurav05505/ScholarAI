import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  plan: { type: String, enum: ['pro', 'premium'], required: true },
  orderId: { type: String, required: true, unique: true },
  paymentId: { type: String, default: undefined, unique: true, sparse: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'INR' },
  status: { type: String, enum: ['pending', 'verifying', 'paid', 'payment_failed'], default: 'pending', index: true },
  verificationStartedAt: { type: Date, default: null },
  verifiedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
