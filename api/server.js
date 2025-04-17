// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import multer from 'multer';
// import path from 'path';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import morgan from 'morgan';
// import helmet from 'helmet';
// import cookieParser from 'cookie-parser';
// import jwt from 'jsonwebtoken';
// import { fileURLToPath } from 'url';
// import connectDB from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
// import adminRoutes from './routes/admin-Routes/adminRoutes.js';
// import User from './models/User.js';
// import userRoutes from './routes/userRoutes/userRoutes.js';
// import otpRoutes from './routes/otp-Routes/otpRoutes.js';

// dotenv.config();
// await connectDB(); // Ensure MongoDB is connected before starting server

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const httpServer = http.createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//   },
// });

// // Socket authentication
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return next(new Error("Authentication error"));
//     socket.user = decoded.user;
//     next();
//   });
// });

// // Attach controller
// import socketController from './controllers/socketController.js';
// socketController(io);

// // Middleware setup
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
// app.use(morgan('dev'));
// app.use(helmet());

// // File uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) =>
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)),
// });
// const upload = multer({ storage });

// // File upload route
// app.post('/upload', upload.single('cv'), (req, res) => {
//   if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
//   res.json({ message: 'File uploaded successfully', file: req.file });
// });

// // File download route
// app.get('/download/:filename', (req, res) => {
//   const { filename } = req.params;
//   const filePath = path.join(__dirname, 'uploads', filename);

//   // Check if file exists before attempting to download
//   res.download(filePath, filename, (err) => {
//     if (err) {
//       res.status(404).json({ message: 'File not found' });
//     }
//   });
// });

// app.use('/uploads', cors(), express.static('uploads'));

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/users', userRoutes); // Adjusted to avoid duplication
// app.use('/api/otp', otpRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Server error', error: err.message });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// httpServer.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// export { io };
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/admin-Routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes/userRoutes.js";
import otpRoutes from "./routes/otp-Routes/otpRoutes.js";
import handleSocketEvents from "./controllers/socketController.js";

dotenv.config();
await connectDB(); // Ensure MongoDB is connected before starting server

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Socket Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error("Authentication error"));
    socket.user = decoded.user;
    next();
  });
});

// Handle Socket Connections
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  handleSocketEvents(io, socket);
});

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan("dev"));
app.use(helmet());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/courses", );



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { io };