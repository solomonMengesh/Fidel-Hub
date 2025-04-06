import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/admin-Routes/adminRoutes.js';
import User from './models/User.js';
import userRoutes from './routes/userRoutes/userRoutes.js';

dotenv.config();
await connectDB(); // Ensure MongoDB is connected before starting server

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

// Track connected users
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('registerUser', async (userId) => {
    try {
      await User.findByIdAndUpdate(userId, { socketId: socket.id });
      console.log(`User ${userId} registered with socket ${socket.id}`);
    } catch (error) {
      console.error('Error registering user socket:', error);
    }
  });

  socket.on('disconnect', async () => {
    try {
      await User.findOneAndUpdate(
        { socketId: socket.id },
        { $set: { socketId: null } }
      );
      console.log(`Client disconnected: ${socket.id}`);
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan('dev'));
app.use(helmet());

// File uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// File upload route
app.post('/upload', upload.single('cv'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ message: 'File uploaded successfully', file: req.file });
});

// File download route
app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Check if file exists before attempting to download
  res.download(filePath, filename, (err) => {
    if (err) {
      res.status(404).json({ message: 'File not found' });
    }
  });
});

app.use('/uploads', cors(), express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', adminRoutes); // Adjust as needed
app.use('/api/users', userRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { io };