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
// import connectDB from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
// import adminRoutes from './routes/admin-Routes/adminRoutes.js';
// import User from './models/User.js';
// import userRoutes from './routes/userRoutes/userRoutes.js';
// import otpRoutes from './routes/otp-Routes/otpRoutes.js';
// import routes from './routes/instructor-Routes/index.js';

// import paymentRoutes from './routes/PaymentRoutes/paymentRoutes.js';
// // Add these with your other route imports
// import conversationRoutes from './routes/conversationRoutes.js';
// import messageRoutes from './routes/messageRoutes.js';
// dotenv.config();
// await connectDB(); // Ensure MongoDB is connected before starting server

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL,
//     credentials: true
//   }
// });

// // // Track connected users
// // io.on('connection', (socket) => {
// //   console.log('New client connected:', socket.id);

// //   socket.on('registerUser', async (userId) => {
// //     try {
// //       await User.findByIdAndUpdate(userId, { socketId: socket.id });
// //       console.log(`User ${userId} registered with socket ${socket.id}`);
// //     } catch (error) {
// //       console.error('Error registering user socket:', error);
// //     }
// //   });

// //   socket.on('disconnect', async () => {
// //     try {
// //       await User.findOneAndUpdate(
// //         { socketId: socket.id },
// //         { $set: { socketId: null } }
// //       );
// //       console.log(`Client disconnected: ${socket.id}`);
// //     } catch (error) {
// //       console.error('Error handling disconnect:', error);
// //     }
// //   });
// // });
// // Track connected users and messaging
// io.on('connection', (socket) => {
//   console.log('New client connected:', socket.id);

//   // 1. Your existing user registration handler
//   socket.on('registerUser', async (userId) => {
//     try {
//       await User.findByIdAndUpdate(userId, { socketId: socket.id });
//       console.log(`User ${userId} registered with socket ${socket.id}`);
//     } catch (error) {
//       console.error('Error registering user socket:', error);
//     }
//   });

//   // 2. New messaging handlers
//   socket.on('joinConversation', (conversationId) => {
//     socket.join(conversationId);
//     console.log(`User joined conversation: ${conversationId}`);
//   });

//   socket.on('leaveConversation', (conversationId) => {
//     socket.leave(conversationId);
//     console.log(`User left conversation: ${conversationId}`);
//   });

//   socket.on('typing', (data) => {
//     const { conversationId, userId } = data;
//     socket.to(conversationId).emit('userTyping', {
//       userId,
//       isTyping: true
//     });
//   });

//   // 3. Your existing disconnect handler
//   socket.on('disconnect', async () => {
//     try {
//       await User.findOneAndUpdate(
//         { socketId: socket.id },
//         { $set: { socketId: null } }
//       );
//       console.log(`Client disconnected: ${socket.id}`);
//     } catch (error) {
//       console.error('Error handling disconnect:', error);
//     }
//   });
// });
// // Middleware setup
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
// app.use(morgan('dev'));
// app.use(helmet());
// // import path from "path";
// import fs from "fs";
// const uploadDir = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }
// // Serve static files from uploads directory
// app.use("/uploads", express.static(uploadDir));
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
// app.use('/api/users', adminRoutes); // Adjust as needed
// app.use('/api/users', userRoutes);
// app.use('/api/otp', otpRoutes);
// app.use('/api', routes);
// app.use('/api/payment', paymentRoutes);
// // Add these with your other route middleware
// app.use('/api/conversations', conversationRoutes);
// app.use('/api/messages', messageRoutes);
// app.use("/uploads", express.static(path.join(process.cwd(), "config/uploads")));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Server error', error: err.message });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// export { io };
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import dotenv from "dotenv";
// import cors from "cors";
// import morgan from "morgan";
// import helmet from "helmet";
// import cookieParser from "cookie-parser";
// import connectDB from "./config/db.js";
// import Message from "./models/Message.js";
// import Conversation from "./models/Conversation.js";
// import User from "./models/User.js";
// import authRoutes from "./routes/authRoutes.js";
// import adminRoutes from "./routes/admin-Routes/adminRoutes.js";
// import userRoutes from "./routes/userRoutes/userRoutes.js";
// import otpRoutes from "./routes/otp-Routes/otpRoutes.js";
// import routes from "./routes/instructor-Routes/index.js";
// import paymentRoutes from "./routes/PaymentRoutes/paymentRoutes.js";
// import conversationRoutes from "./routes/conversationRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";
// // import { upload } from "./middleware/uploadMiddleware.js"; // Adjust the import path as needed


// dotenv.config();
// await connectDB(); // Ensure MongoDB is connected before starting server

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//     methods: ["GET", "POST"],
//   },
// });

// // Track connected users
// io.on('connection', (socket) => {
//   console.log('New client connected:', socket.id);

//   // Register user with their socket ID
//   socket.on("registerUser", async (userId) => {
//     try {
//       await User.findByIdAndUpdate(userId, { socketId: socket.id });
//       console.log(`User ${userId} registered with socket ${socket.id}`);
//     } catch (error) {
//       console.error("Error registering user socket:", error);
//     }
//   });

//   // Join conversation room
//   socket.on("joinConversation", (conversationId) => {
//     socket.join(conversationId);
//     console.log(`User joined conversation: ${conversationId}`);
//   });

//   // Leave conversation room
//   socket.on("leaveConversation", (conversationId) => {
//     socket.leave(conversationId);
//     console.log(`User left conversation: ${conversationId}`);
//   });

//   // Typing indicator
//   socket.on("typing", (data) => {
//     socket.to(data.conversationId).emit("userTyping", {
//       userId: data.userId,
//       isTyping: data.isTyping,
//     });
//   });

//   // Handle new messages
//   socket.on("sendMessage", async (data) => {
//     try {
//       // Save message to database
//       const message = new Message({
//         conversation: data.conversationId,
//         sender: data.senderId,
//         content: data.content,
//         type: data.type,
//         fileInfo: data.fileInfo,
//       });

//       await message.save();

//       // Update conversation's last message
//       await Conversation.findByIdAndUpdate(data.conversationId, {
//         lastMessage: message._id,
//       });

//       // Populate sender info before emitting
//       const populatedMessage = await Message.populate(message, {
//         path: "sender",
//         select: "name profilePic",
//       });

//       // Broadcast to all in the conversation room except sender
//       socket.to(data.conversationId).emit("receiveMessage", populatedMessage);

//       // Send back to sender (for confirmation)
//       socket.emit("messageSent", populatedMessage);
//     } catch (error) {
//       console.error("Error handling message:", error);
//       socket.emit("messageError", { error: "Failed to send message" });
//     }
//   });

//   // Handle disconnection
//   socket.on("disconnect", async () => {
//     try {
//       await User.findOneAndUpdate(
//         { socketId: socket.id },
//         { $set: { socketId: null } }
//       );
//       console.log(`Client disconnected: ${socket.id}`);
//     } catch (error) {
//       console.error("Error handling disconnect:", error);
//     }
//   });
// });

//  app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
// app.use(morgan("dev"));
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


// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/users', adminRoutes); 
// app.use('/api/users', userRoutes);
// app.use('/api/otp', otpRoutes);
// app.use('/api', routes);
// app.use('/api/payment', paymentRoutes);
// // Add these with your other route middleware
// app.use('/api/conversations', conversationRoutes);
// app.use('/api/messages', messageRoutes);
// app.use("/uploads", express.static(path.join(process.cwd(), "config/uploads")));

// app.use('/certificates', express.static(path.join(process.cwd(), 'certificates')));


// app.use('/api/certificates', certificateRoutes);


// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Server error", error: err.message });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// export { io };
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
import otpRoutes from './routes/otp-Routes/otpRoutes.js';
import routes from './routes/instructor-Routes/index.js';
import certificateRoutes from './routes/certificateRoutes/certificateRoutes.js';

import paymentRoutes from './routes/PaymentRoutes/paymentRoutes.js';
import adminGraphRoutes from './routes/admin-Routes/graphs.js';

dotenv.config();
await connectDB();  

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});


 io.on('connection', (socket) => {
   

  socket.on('registerUser', async (userId) => {
    try {
      await User.findByIdAndUpdate(userId, { socketId: socket.id });
       
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

 app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan('dev'));
app.use(helmet());

 const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

 app.post('/upload', upload.single('cv'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ message: 'File uploaded successfully', file: req.file });
});

 app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

   res.download(filePath, filename, (err) => {
    if (err) {
      res.status(404).json({ message: 'File not found' });
    }
  });
});

app.use('/uploads', cors(), express.static('uploads'));


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', adminRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api', routes);
app.use('/api/payment', paymentRoutes);


app.use('/certificates', express.static(path.join(process.cwd(), 'certificates')));


app.use('/api/certificates', certificateRoutes);
app.use('/api/admin/graphs', adminGraphRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { io };