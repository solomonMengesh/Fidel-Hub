import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";

dotenv.config();
dotenv.config();

const app = express();
process.setMaxListeners(15); // Increase the max listeners limit
// Middleware
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("Error: MONGODB_URI is not defined in the environment variables.");
  process.exit(1);
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);

// Error handling middleware (if required)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
