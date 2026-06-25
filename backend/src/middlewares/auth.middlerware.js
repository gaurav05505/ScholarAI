import jwt from 'jsonwebtoken'; 
import UserModel from '../models/user.model.js'; 

async function protect(req , res , next){
    try {   
        let token;
        const authHeader = req.headers.authorization; 

        if(authHeader && authHeader.startsWith("Bearer")){
            token = authHeader.split(" ")[1]; 
        }

        if(!token){
            return res.status(401).json({
                success: false, 
                message: "Access denied. No token provided."
            })
        }

        const decoded  = jwt.verify(
            token, 
            process.env.JWT_SECRET
        )

        const user = await UserModel.findById(decoded.id); 
        if(!user){
            return res.status(401).json({
                success: false, 
                message: "User no longer exists."
            })
        }

        req.user = user; 

        next(); 

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        })
    }
}

export default protect;
