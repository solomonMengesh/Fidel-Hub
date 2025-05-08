// routes/chatRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  sendMessage,
  getMessages,
  createConversation,
  updateMessage,
  deleteMessage,
  getConversations,
} from "../controllers/chatController.js";
import { upload } from "../middleware/uploadfile.js";

const router = express.Router();

router.post("/conversations", createConversation); // Create conversation for students and instructors
router.get("/conversations", protect, getConversations);
router.post("/messages", upload.single("file"), sendMessage);  //
router.get("/messages/:conversationId", getMessages); // Get all messages in a conversation
router.put("/messages/:messageId", updateMessage); // Update a message
router.delete("/messages/:messageId", deleteMessage); // Delete a message

export default router;
