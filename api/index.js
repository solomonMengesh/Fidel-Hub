// Import Express
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 5000;



const MONGO_URI = process.env.MONGO_URI;

// MongoDB Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Stop server if DB connection fails
  }
};


// Start the server
app.listen(PORT, () => {
   connectDB();
  console.log(`🚀 Backend server is running on port ${PORT}!`);
});
