import mongoose from 'mongoose'; 

const LearningSession = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
    },

    status: {
        type:String, 
        enum: ["collecting_context", "completed"], 
        default: "collecting_context",
    }, 
    topic: {
        type: String, 
        default: "", 
    },
    context: {
        track: String , 
        level: String,
        goal: String, 
        weeklyHours: Number, 
        learningStyle: String , 
    }, 
    currentField: {
        type: String, 
        default: "Track", 
    },
    roadmapId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Roadmap", 
        default: null 
    }

} , {
    timestamps: true, 
})

export default mongoose.model("LearningSession" , LearningSession);