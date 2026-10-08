import crypto from "crypto";
import razorpay from "../services/razorpay.service.js";
import Payment from "../models/payment.model.js";
import UserModel from "../models/user.model.js";
import PLANS from "../config/plans.js";

const safeEqual = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};

const publicPlan = ({
  id,
  name,
  amount,
  currency,
  durationDays,
  weeklyChatLimit,
  monthlyChatLimit,
}) => ({
  id,
  name,
  amount,
  currency,
  durationDays,
  weeklyChatLimit,
  monthlyChatLimit,
});

export async function getPlans(req, res) {
  return res.json({
    success: true,
    plans: Object.values(PLANS).map(publicPlan),
  });
}

export async function createOrder(req, res) {
  try {
    const planId =
      typeof req.body?.plan === "string"
        ? req.body.plan.trim().toLowerCase()
        : "";
    const plan = PLANS[planId];
    if (!plan || planId === "free")
      return res
        .status(400)
        .json({ success: false, message: "Choose an available paid plan." });
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res
        .status(503)
        .json({
          success: false,
          message: "Payments are temporarily unavailable.",
        });
    }

    const user = await UserModel.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    if (
      ["pro", "premium"].includes(user.subscription?.plan) &&
      user.subscription?.status === "active" &&
      user.subscription?.endDate > new Date()
    ) {
      return res
        .status(409)
        .json({
          success: false,
          message: "You already have an active paid plan.",
          subscription: user.subscription,
        });
    }

    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: plan.currency,
      receipt: `u${String(user._id).slice(-8)}_${crypto.randomUUID().replaceAll("-", "").slice(0, 16)}`,
      notes: { userId: String(user._id), plan: planId },
    });
    await Payment.create({
      user: user._id,
      plan: planId,
      orderId: order.id,
      amount: plan.amount,
      currency: plan.currency,
    });

    return res.status(201).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: planId,
      planName: plan.name,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(
      "Razorpay order creation failed:",
      error.statusCode || error.name || "payment error",
    );
    return res
      .status(502)
      .json({
        success: false,
        message: "Could not create a payment order. Please try again.",
      });
  }
}

export async function verifyPayment(req, res) {
  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = req.body || {};
  if (
    ![orderId, paymentId, signature].every(
      (value) =>
        typeof value === "string" && value.length > 0 && value.length <= 200,
    )
  ) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Valid payment verification details are required.",
      });
  }
  if (!process.env.RAZORPAY_KEY_SECRET)
    return res
      .status(503)
      .json({
        success: false,
        message: "Payments are temporarily unavailable.",
      });

  try {
    const paymentRecord = await Payment.findOne({
      orderId,
      user: req.user._id,
    });
    if (!paymentRecord)
      return res
        .status(404)
        .json({
          success: false,
          message: "Payment order was not found for this account.",
        });
    if (
      paymentRecord.status === "paid" &&
      paymentRecord.paymentId === paymentId
    ) {
      const user = await UserModel.findById(req.user._id).select("-password");
      return res.json({
        success: true,
        duplicate: true,
        message: "Payment already verified.",
        user: safeUser(user),
      });
    }
    if (paymentRecord.status === "payment_failed")
      return res
        .status(409)
        .json({ success: false, message: "This payment order has failed." });

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
    if (!safeEqual(expected, signature))
      return res
        .status(400)
        .json({
          success: false,
          message: "Payment signature verification failed.",
        });

    const now = new Date();
    const lock = await Payment.findOneAndUpdate(
      {
        _id: paymentRecord._id,
        $or: [
          { status: "pending" },
          {
            status: "verifying",
            verificationStartedAt: {
              $lt: new Date(now.getTime() - 2 * 60 * 1000),
            },
          },
        ],
      },
      { $set: { status: "verifying", verificationStartedAt: now, paymentId } },
      { new: true },
    );
    if (!lock) {
      const latest = await Payment.findById(paymentRecord._id);
      if (latest?.status === "paid" && latest.paymentId === paymentId) {
        const user = await UserModel.findById(req.user._id).select("-password");
        return res.json({
          success: true,
          duplicate: true,
          message: "Payment already verified.",
          user: safeUser(user),
        });
      }
      return res
        .status(409)
        .json({
          success: false,
          message:
            "Payment verification is already in progress. Please refresh shortly.",
        });
    }

    try {
      const [order, razorpayPayment] = await Promise.all([
        razorpay.orders.fetch(orderId),
        razorpay.payments.fetch(paymentId),
      ]);
      const belongsToUser =
        String(order.notes?.userId || "") === String(req.user._id);
      const orderMatches =
        razorpayPayment.order_id === orderId && order.id === orderId;
      const orderValid =
        order.amount === paymentRecord.amount &&
        order.currency === paymentRecord.currency &&
        order.notes?.plan === paymentRecord.plan;
      const paymentValid =
        razorpayPayment.amount === paymentRecord.amount &&
        razorpayPayment.currency === paymentRecord.currency &&
        razorpayPayment.status === "captured";
      if (!belongsToUser || !orderMatches || !orderValid || !paymentValid) {
        await Payment.updateOne(
          { _id: lock._id, status: "verifying" },
          {
            $set: { status: "pending", verificationStartedAt: null },
            $unset: { paymentId: 1 },
          },
        );
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Payment does not match this account and order, or has not been captured.",
          });
      }

      const user = await UserModel.findById(req.user._id);
      if (!user) throw new Error("user missing");
      const plan = PLANS[paymentRecord.plan];
      if (user.subscription?.razorpayPaymentId !== paymentId) {
        const startDate = new Date();
        const endDate = new Date(
          startDate.getTime() + plan.durationDays * 86400000,
        );
        user.subscription = {
          plan: plan.id,
          status: "active",
          startDate,
          endDate,
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySubscriptionId: null,
        };
        user.usage.weeklyChats = 0;
        user.usage.monthlyChats = 0;
        user.usage.weekResetAt = new Date(startDate.getTime() + 7 * 86400000);
        user.usage.monthResetAt = endDate;
        await user.save();
      }
      await Payment.updateOne(
        { _id: lock._id, status: "verifying", paymentId },
        { $set: { status: "paid", verifiedAt: new Date() } },
      );
      const freshUser = await UserModel.findById(req.user._id).select(
        "-password",
      );
      return res.json({
        success: true,
        message: `Plan activated: ${plan.name}.`,
        user: safeUser(freshUser),
      });
    } catch (error) {
      await Payment.updateOne(
        { _id: lock._id, status: "verifying" },
        {
          $set: { status: "pending", verificationStartedAt: null },
          $unset: { paymentId: 1 },
        },
      ).catch(() => {});
      throw error;
    }
  } catch (error) {
    console.error(
      "Payment verification failed:",
      error.statusCode || error.name || "payment error",
    );
    return res
      .status(502)
      .json({
        success: false,
        message:
          "Could not verify payment right now. If you were charged, contact support with your order ID.",
      });
  }
}

function safeUser(user) {
  if (!user) return null;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    subscription: user.subscription,
    usage: user.usage,
  };
}

export async function getPaymentStatus(req, res) {
  try {
    const user = await UserModel.findById(req.user._id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    return res.json({
      success: true,
      subscription: user.subscription,
      usage: user.usage,
    });
  } catch {
    return res
      .status(500)
      .json({
        success: false,
        message: "Could not retrieve subscription status.",
      });
  }
}
