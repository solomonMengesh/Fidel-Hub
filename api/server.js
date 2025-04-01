 

import express from 'express';import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
import cors from 'cors';

dotenv.config();
connectDB();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',  // Your frontend origin
  credentials: true  // If you need to send cookies
}));
// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination directory for uploaded files
    cb(null, 'uploads/');  // Specify your folder here
  },
  filename: (req, file, cb) => {
    // Define the filename for the uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

// Middleware to handle the file upload (e.g., for user CV upload)
app.post('/upload', upload.single('cv'), (req, res) => {
  // Access the uploaded file via `req.file`
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  
  // Send back the file info as a response
  res.send({
    message: 'File uploaded successfully',
    file: req.file
  });
});

// Serve static files (optional if you want to serve the uploaded files)
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
