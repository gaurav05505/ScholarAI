import mongoose from 'mongoose'; 

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("database connected");
         
    } catch (error) {
        console.log("database conniction failed" , error.message);
        // process.exist(1); 
    }
}

export default connectDb; 