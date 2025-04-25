import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name profilePic")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { courseId, participantId } = req.body;

    let conversation = await Conversation.findOne({
      course: courseId,
      participants: { $all: [req.user._id, participantId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        course: courseId,
        participants: [req.user._id, participantId],
      });
      await conversation.save();
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
