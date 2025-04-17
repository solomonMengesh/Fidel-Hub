const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// Send message (text or file)
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const file = req.file; // Assuming you're using multer for file uploads

    // Check if conversation exists and isn't blocked
    const conversation = await Conversation.findById(conversationId);
    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });
    if (conversation.isBlocked)
      return res.status(403).json({ error: "Conversation is blocked" });

    const message = new Message({
      conversation: conversationId,
      sender: req.user.id,
      content: file ? file.originalname : content,
      file: file
        ? {
            url: file.path,
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
          }
        : undefined,
    });

    await message.save();

    // Update conversation last message
    conversation.lastMessage = message._id;
    if (message.sender.toString() !== conversation.instructor.toString()) {
      conversation.unreadCount += 1;
    }
    await conversation.save();

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit message
exports.editMessage = async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      sender: req.user.id, // Only sender can edit
    });

    if (!message) return res.status(404).json({ error: "Message not found" });

    message.content = req.body.content;
    message.isEdited = true;
    await message.save();

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete message (soft delete)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      sender: req.user.id, // Only sender can delete
    });

    if (!message) return res.status(404).json({ error: "Message not found" });

    message.isDeleted = true;
    await message.save();

    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
