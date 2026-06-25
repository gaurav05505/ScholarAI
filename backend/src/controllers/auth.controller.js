import UserModel from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { model } from 'mongoose';


// user register 
async function userRegister(req , res){

    try {
        
        const {name , email , password } = req.body; 
    
        const alreadyExitsUser = await UserModel.findOne({
            email
        })
    
        if(alreadyExitsUser){
            return res.status(400).json({
                message: "User already exist"
            })
        }
    
        const salt = await bcrypt.genSalt(10); 
        const hashedpassword = await bcrypt.hash(password , salt); 
    
        const newUser = await UserModel.create({
            name, 
            email, 
            password: hashedpassword, 
        })
    
        const token = jwt.sign(
            {id: newUser._id}, 
            process.env.JWT_SECRET, 
            {
                expiresIn : '7d',
            }
        )
    
        return res.status(201).json({
            message: "User registered Successfully", 
            token,
            user:{
                id : newUser._id, 
                name: newUser.name, 
                email: newUser.email, 
            }
        })


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: 'Internal server error', 
        })
        
    }




}

// user login 
async function userLogin(req , res){
    try {
        const {name , email , password } = req.body; 

        if(!email || !password ){
            return res.status(400).json({
                message: 'Email and password are requires',
            })
        }

        const user = await UserModel.findOne({email}); 

        if(!user){
            return res.status(401).json({
                message: 'invalid credentials', 
            })
        }

        const isPasswordCorrect = await bcrypt.compare(
            password, 
            user.password
        )

        if(!isPasswordCorrect){
            return res.startus(401).json({
                message: "invalid credentials"
            })
        }

        const token = jwt.sign(
            {id: user._id}, 
            process.env.JWT_SECRET, 
            {
                expiresIn : '7d',
            }
        )

        return res.status(200).json({
            message : "Login successful", 
            token, 
            user: {
                id : user._id, 
                name: user.name, 
                email: user.email, 
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
             
            message: "server error"
        })
    }
    


}


export default {
  userRegister,
  userLogin
};