// import Message from "../models/Message.js";
// import Conversation from "../models/Conversation.js";
// import multer from "multer";
// import path from "path";

// // File upload config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Log the destination path for file storage
//     console.log(
//       "File is being uploaded to:",
//       path.join(process.cwd(), "config", "uploads")
//     );
//     cb(null, path.join(process.cwd(), "config", "uploads"));
//   },
//   filename: (req, file, cb) => {
//     const filename = `${Date.now()}-${file.originalname}`;
//     // Log the file name that will be saved
//     console.log("Saving file with name:", filename);
//     cb(null, filename);
//   },
// });

// export const upload = multer({ storage });

// // Send Message Controller
// export const sendMessage = async (req, res) => {
//   try {
//     // Log the entire request body
//     console.log("📥 Request Body:", req.body);

//     // Log the uploaded file information
//     console.log("📁 Uploaded File:", req.file);

//     // Extract conversationId and content from the request body
//     const { content, conversationId } = req.body;
//     const file = req.file;

//     // Validate the required conversationId
//     if (!conversationId) {
//       console.error("❌ conversationId is missing");
//       return res.status(400).json({ message: "conversationId is required" });
//     }

//     const messageData = {
//       conversation: conversationId,
//       sender: req.user?._id || "system", // fallback if user is not authenticated
//       type: file ? "file" : "text",
//     };

//     // If there is a file, include file information in the message data
//     if (file) {
//       messageData.fileInfo = {
//         name: file.originalname,
//         type: file.mimetype,
//         size: file.size,
//         url: `/uploads/${file.filename}`,
//       };
//     } else if (content?.trim()) {
//       messageData.content = content.trim();
//     } else {
//       console.error("❌ No content or file provided");
//       return res
//         .status(400)
//         .json({ message: "Content or file must be provided" });
//     }

//     // Save the new message to the database
//     const message = new Message(messageData);
//     await message.save();
//     console.log("✅ Message saved successfully:", message);

//     // Update the conversation with the last message
//     await Conversation.findByIdAndUpdate(conversationId, {
//       lastMessage: message._id,
//     });

//     // Send the response with the new message
//     res.status(201).json(message);
//   } catch (err) {
//     // Log the error to help with debugging
//     console.error("❌ Error sending message:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // export const sendMessage = async (req, res) => {
// //   try {
// //     const { content, conversationId } = req.body;

// //     const message = new Message({
// //       conversation: conversationId,
// //       sender: req.user._id,
// //       content,
// //       type: "text",
// //     });

// //     await message.save();

// //     await Conversation.findByIdAndUpdate(conversationId, {
// //       lastMessage: message._id,
// //     });

// //     res.status(201).json(message);
// //   } catch (err) {
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// export const getMessages = async (req, res) => {
//   try {
//     const messages = await Message.find({
//       conversation: req.params.conversationId,
//     }).populate("sender", "name profilePic");

//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ Update a message
// export const updateMessage = async (req, res) => {
//   try {
//     const { content } = req.body;
//     const message = await Message.findById(req.params.id);

//     if (!message) return res.status(404).json({ message: "Message not found" });
//     if (message.sender.toString() !== req.user._id.toString())
//       return res.status(403).json({ message: "Unauthorized" });

//     message.content = content || message.content;
//     await message.save();

//     res.json(message);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ Delete a message
// export const deleteMessage = async (req, res) => {
//   try {
//     const message = await Message.findById(req.params.id);

//     if (!message) {
//       return res.status(404).json({ message: "Message not found" });
//     }

//     // Optional: Check if user is sender
//     if (message.sender.toString() !== req.user._id.toString()) {
//       return res
//         .status(403)
//         .json({ message: "Not authorized to delete this message" });
//     }

//     await message.deleteOne();

//     res.json({ message: "Message deleted" });
//   } catch (err) {
//     console.error("Delete error:", err); // <- This will show the real problem
//     res.status(500).json({ message: "Server error" });
//   }
// };
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// File filter to accept only certain types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, PDFs and documents are allowed."
      ),
      false
    );
  }
};

// Initialize multer
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Send message controller
export const sendMessage = async (req, res) => {
  try {
    const { content, conversationId } = req.body;
    const file = req.file;

    // Validate required fields
    if (!conversationId) {
      if (file) {
        // Clean up uploaded file if validation fails
        fs.unlinkSync(path.join(process.cwd(), "uploads", file.filename));
      }
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    // Prepare message data
    const messageData = {
      conversation: conversationId,
      sender: req.user._id,
      type: file ? "file" : "text",
    };

    // Add file info if file exists
    if (file) {
      messageData.fileInfo = {
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
      };
    } else if (content && content.trim()) {
      messageData.content = content.trim();
    } else {
      return res
        .status(400)
        .json({ message: "Message content or file is required" });
    }

    // Save message
    const message = new Message(messageData);
    await message.save();

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Error sending message:", err);

    // Clean up file if error occurs
    if (req.file) {
      try {
        fs.unlinkSync(path.join(process.cwd(), "uploads", req.file.filename));
      } catch (cleanupErr) {
        console.error("Error cleaning up file:", cleanupErr);
      }
    }

    res.status(500).json({
      message: "Failed to send message",
      error: err.message,
    });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId,
    }).populate("sender", "name profilePic");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to get messages" });
  }
};

// Update message
export const updateMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) return res.status(404).json({ message: "Message not found" });
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    message.content = content || message.content;
    await message.save();

    res.json(message);
  } catch (err) {
    res.status(500).json({ message: "Failed to update message" });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete associated file if exists
    if (message.type === "file" && message.fileInfo?.url) {
      const filePath = path.join(process.cwd(), message.fileInfo.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await message.deleteOne();

    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete message" });
  }
};