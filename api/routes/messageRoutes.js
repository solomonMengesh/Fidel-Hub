// import express from "express";
// import {
//   sendMessage,
//   getMessages,
//   updateMessage,
//   deleteMessage,
//   upload,
// } from "../controllers/messageController.js";
// import { protect } from "../middleware/authMiddleware.js";
// import { uploadPDF } from "../middleware/uploadMiddleware.js";

// const router = express.Router();

// // Protect the routes with authentication middleware
// router.use(protect);

// // POST route for sending messages with optional file upload
// router.post("/", upload.single("file"), sendMessage);

// // Other routes
// router.get("/:conversationId", getMessages);
// router.put("/:id", updateMessage); // ✅ Update message
// router.delete("/:id", deleteMessage); // ✅ Delete message

// export default router;
import express from "express";
import {
  sendMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  upload,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Message routes
router.post("/", upload.single("file"), sendMessage);
router.get("/:conversationId", getMessages);
router.put("/:id", updateMessage);
router.delete("/:id", deleteMessage);

export default router;