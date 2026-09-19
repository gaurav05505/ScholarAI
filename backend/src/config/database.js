import mongoose from 'mongoose';

const connectDb = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/docai';
  try {
    await mongoose.connect(uri);
    console.log('Database connected successfully');
  } catch (error) {
    console.warn('Initial DB connection failed with URI, attempting 127.0.0.1 fallback:', error.message);
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/docai');
      console.log('Database connected via 127.0.0.1 fallback');
    } catch (fallbackError) {
      console.error('Database connection failed:', fallbackError.message);
    }
  }
};

export default connectDb;
