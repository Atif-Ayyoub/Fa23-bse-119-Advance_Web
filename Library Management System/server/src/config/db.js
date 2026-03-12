import mongoose from 'mongoose';

export const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing in environment variables.');
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected successfully');
};
