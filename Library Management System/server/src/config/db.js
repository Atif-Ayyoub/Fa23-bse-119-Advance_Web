import mongoose from 'mongoose';

export const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing in environment variables.');
  }

  const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  if (isProduction && /(localhost|127\.0\.0\.1)/i.test(uri)) {
    throw new Error('MONGODB_URI cannot use localhost in production. Use MongoDB Atlas connection string.');
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected successfully');
};
