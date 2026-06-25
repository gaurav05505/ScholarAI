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

    }
} , {
    timestamps: true, 
})

const user = mongoose.model("User" , userSchema); 
export default user; 