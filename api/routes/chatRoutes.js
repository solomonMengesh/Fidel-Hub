const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");
const messageController = require("../controllers/messageController");
const upload = require("../middleware/multer"); // For file uploads
const auth = require("../middleware/auth"); // Authentication middleware

// =======================
//   CONVERSATION ROUTES
// =======================
router.get(
  "/courses/:courseId/conversations/:studentId",
  auth,
  conversationController.getOrCreateConversation
);

router.patch(
  "/conversations/:id/block",
  auth,
  conversationController.toggleBlock
);

// =================
//   MESSAGE ROUTES
// =================
router.post(
  "/messages",
  auth,
  upload.single("file"), // Handles file uploads
  messageController.sendMessage
);

router.patch("/messages/:id", auth, messageController.editMessage);

router.delete("/messages/:id", auth, messageController.deleteMessage);

// ======================
//   SOCKET.IO ENDPOINT
// ======================
router.post("/socket-auth", auth, (req, res) => {
  // This endpoint validates socket connections
  res.json({ userId: req.user.id });
});

module.exports = router;
