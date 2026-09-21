import razorpay from '../services/razorpay.service.js';

const PLANS = {

    PRO: {
        amount: 499, 
        name: "Pro", 

    },
    premium : {
        amount: 799, 
        name : "premium", 
    }, 
}


export async function createOrder(req , res ){
    try {
        
        const {plan}  = req.body; 

        if(!plan || !PLANS[plan]){
            return res.status(400).json({
                success : false, 
                message : "Invalid subscription plan.",
            })
        }

        const selectPlan = PLANS[plan]; 

        const option = { 
            amount : selectPlan.amount, 
            currency: "INR",

            receipt : `receipt_${req.user._id}_${Date.now()}`,

            notes: {
                userId: req.user._id.toString(), 
                plan: plan, 
            }
        }

        const order = await razorpay.orders.create(option);

        return res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            plan: plan,
            keyId: process.env.RAZORPAY_KEY_ID,
        });


    } catch (error) {
        console.error("Razorpay create order error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create payment order.",
        });
    }
}