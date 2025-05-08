// controllers/chatController.js
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import asyncHandler from "express-async-handler";

export const createConversation = async (req, res) => {
  const { studentId, instructorId, courseId } = req.body;

  try {
    let conversation = await Conversation.findOne({
      courseId: courseId,
      instructor: instructorId,
      members: { $all: [studentId, instructorId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        courseId: courseId,
        instructor: instructorId,
        members: [studentId, instructorId],
      });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const { conversationId, senderId, text } = req.body;
  const file = req.file;

  try {
    const message = new Message({
      conversationId,
      sender: senderId,
      text: text || "",
      fileUrl: file ? `/uploads/chat/${file.filename}` : null,
      fileType: file ? normalizeFileType(file.mimetype) : null,
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper function to normalize file types
function normalizeFileType(mimetype) {
  if (mimetype.startsWith("image")) return "image";
  if (mimetype.startsWith("video")) return "video";
  if (mimetype === "application/pdf") return "pdf";
  if (mimetype.includes("msword") || mimetype.includes("document"))
    return "doc";
  return "other";
}





export const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMessage = async (req, res) => {
  const { messageId } = req.params;
  const { text } = req.body;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { text },
      { new: true }
    );
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  try {
    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConversations = async (req, res) => {
  const userId = req.query.userId || req.body.userId;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const conversations = await Conversation.find({
      members: userId,
    }).populate("members", "name email");

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

