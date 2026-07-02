import Aichat from '../utils/aiClint.util.js'; 
import {intentPrompt} from '../Prompt/intent.prompt.js'
import LearnSchema from '../models/Learn.Schema.js'; 

export async function intentNode(userId , message){
    try {
        
        const Aires = await Aichat(intentPrompt , message); 
    
        let result; 
    
        try {
            result = JSON.parse(Aires);
        } catch {
            throw new Error("Invalid JSON returned by AI"); 
        }
    
        if (!result.intent) {
          throw new Error("AI didn't return an intent.");
        }
    
        if (result.intent !== "learn") {
          return {
            success: true,
            intent: result.intent,
            data: result,
          };
        }
    
        const session = await LearnSchema.Create({
            userId, 
            topic: result.topic, 
    
            status: "collecting_context", 
            currentField: "track", 
    
            context: {}, 
        })
    
        return {
          success: true,
    
          sessionId: session._id,
    
          intent: result.intent,
    
          topic: result.topic,
    
          question: result.question,
        };

        
    } catch (error) {
        console.error("Intent Node Error:", error);

        return {
        success: false,
        message: error.message,
        };
    }


}