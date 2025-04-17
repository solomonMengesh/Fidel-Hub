const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Start or get a conversation
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    let conversation = await Conversation.findOne({
      course: courseId,
      student: studentId,
    }).populate("lastMessage");

    if (!conversation) {
      conversation = new Conversation({
        course: courseId,
        student: studentId,
        instructor: req.user.id, // Assuming instructor is logged in
      });
      await conversation.save();
    }

    // Get messages (paginated)
    const messages = await Message.find({ conversation: conversation._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ conversation, messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle block status
exports.toggleBlock = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });

    conversation.isBlocked = !conversation.isBlocked;
    conversation.blockedBy = conversation.isBlocked ? req.user.id : null;
    await conversation.save();

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
