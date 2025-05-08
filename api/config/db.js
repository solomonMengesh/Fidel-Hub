import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Check if we can use transactions
    const canUseTransactions = conn.connection.host !== 'localhost' && 
                             conn.connection.host !== '127.0.0.1';
    
    return { connection: conn, canUseTransactions };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;