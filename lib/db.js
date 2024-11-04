import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Suggested by  ChatGPT for integrating MongoDB with NextAuth.js
// const connectDB = async () => {
//   if (mongoose.connection.readyState >= 1) return;

//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,  // Depricated
//       useUnifiedTopology: true,  // Depricated
//     });
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   }
// };

export default connectDB;