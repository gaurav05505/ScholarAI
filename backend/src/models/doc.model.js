import mongoose from 'mongoose'; 

const docSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true, 
        index: true , 
    }, 
    sourceType: {
        type: String, 
        enum: ['pdf', 'url'], 
        required: true, 
    }, 
    title:{
        type: String, 
        required: true, 
        trim: true, 
    }, 

    originalName: {
        type: String, 
        trim: true, 
    }, 

    sourceUrl: {
        type: String, 
        trim: true, 
    }, 
    storageFileId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    fileSize: {
        type: Number, 
    }, 
    mimeType : {
        type:String, 
    },
    status:{
        type: String, 
        enum: [
            'queued',
            'pending',
            'processing',
            'completed',
            'failed',
        ], 
        default: 'queued', 
        index: true, 
    },
    chunkCount: {
        type:Number, 
        default: 0, 
    },
    errorMessage:{
        type:String,
        default: null
    }, 
    vectorCount:{
        type:Number, 
        default: 0,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

} , {
    timestamps: true,
})


const doc = mongoose.model(
    'Doc',
    docSchema
)

export default doc; 
