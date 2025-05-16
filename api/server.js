



import withdrawalRoutes from './routes/PaymentRoutes/withdrawalRoutes.js';

import express from "express";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/admin-Routes/adminRoutes.js";
import User from "./models/User.js";
import userRoutes from "./routes/userRoutes/userRoutes.js";
import otpRoutes from "./routes/otp-Routes/otpRoutes.js";
import routes from "./routes/instructor-Routes/index.js";
import certificateRoutes from "./routes/certificateRoutes/certificateRoutes.js";

import paymentRoutes from "./routes/PaymentRoutes/paymentRoutes.js";
import adminGraphRoutes from "./routes/admin-Routes/graphs.js";
import chatRoutes from "./routes/chatRoutes.js";
import { fileURLToPath } from "url";


dotenv.config();
await connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Track users more effectively
const userSocketMap = new Map(); // userId -> socketId
const onlineUsers = new Set();

io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);

  // When a user logs in
  socket.on("userOnline", (userId) => {
    userSocketMap.set(userId, socket.id);
    onlineUsers.add(userId);
    io.emit("onlineUsers", Array.from(onlineUsers));
  });

  // Typing indicators
  socket.on("typing", ({ conversationId, userId }) => {
    socket.to(conversationId).emit("userTyping", { conversationId, userId });
  });

  socket.on("stoppedTyping", ({ conversationId, userId }) => {
    socket
      .to(conversationId)
      .emit("userStoppedTyping", { conversationId, userId });
  });

  // Conversation rooms
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("leaveConversation", (conversationId) => {
    socket.leave(conversationId);
  });

  // Messages
  socket.on("sendMessage", (message) => {
    io.to(message.conversationId).emit("newMessage", message);
  });
  socket.on("deleteMessage", async ({ messageId, conversationId }) => {
    // Optional: delete from DB here if needed
    socket.to(conversationId).emit("messageDeleted", { messageId });
  });
  socket.on("updateMessage", ({ messageId, newText, conversationId }) => {
    // Optional: update DB
    socket.to(conversationId).emit("messageUpdated", { messageId, newText });
  });

  // Disconnection
  socket.on("disconnect", () => {
    // console.log("User disconnected:", socket.id);

    // Find user associated with this socket
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        userSocketMap.delete(userId);
        break;
      }
    }

    io.emit("onlineUsers", Array.from(onlineUsers));
  });
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan("dev"));
app.use(helmet());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ),
});
const upload = multer({ storage });

app.post("/upload", upload.single("cv"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ message: "File uploaded successfully", file: req.file });
});

app.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "uploads", filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      res.status(404).json({ message: "File not found" });
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
app.use('/api/withdrawals', withdrawalRoutes);


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api", routes);
app.use("/api/payment", paymentRoutes);

app.use(
  "/certificates",
  express.static(path.join(process.cwd(), "certificates"))
);

app.use("/api/certificates", certificateRoutes);
app.use("/api/admin/graphs", adminGraphRoutes);

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use("/api/chat", chatRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});
io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { io };

