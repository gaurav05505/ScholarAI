import {intentNode} from '../node/intent.node.js'; 

export const startLearning = async(req , res) => {
    try {
        
        const {userId , message} = req.body; 

        if(!userId || !message ){
            return res.status(400).json({
                success: false,
                message: "userId and message are required.",
            })
        }

        const result = await intentNode(userId , message);

        return res.status(200).json(result); 


    } catch (error) {
        console.error(error);

        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}