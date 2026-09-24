import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name : {
        type: String, 
        required: true, 
        trim: true
    },
    email : {
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim:true
    },
    password: {
        type: String, 
        required: true, 
        minlength:3,

    },
    subscription : {

        plan :{
            type: String, 
            enum : ["free", "pro", "premium"], 
            default : "free", 
        }, 
        status: {
            type : String, 
            enum : ["active", "cancelled", "expired", "pending"],
            default : "active", 

        },
        startDate: {
            type: Date,
            default: Date.now,
        },

        endDate: {
            type: Date,
            default: null,
        },
        razorpaySubscriptionId: {
            type: String,
            default: null,
        },
        razorpayPaymentId: {
            type: String,
            default: null,
        },
        razorpayOrderId: {
            type: String,
            default: null,
        },
    }, 


    usage: {
      weeklyChats: {
        type: Number,
        default: 0,
      },

      monthlyChats: {
        type: Number,
        default: 0,
      },

      weekResetAt: {
        type: Date,
        default: Date.now,
      },

      monthResetAt: {
        type: Date,
        default: Date.now,
      },
    },



} , {
    timestamps: true, 
})

const user = mongoose.model("User" , userSchema); 
export default user; 