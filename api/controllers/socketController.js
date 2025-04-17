import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

const handleSocketEvents = (io, socket) => {
  // Debugging Socket Connection
  console.log("Socket initialized:", socket.id);

  // Join Conversation Room
  socket.on("joinConversation", (conversationId) => {
    console.log(`Joining conversation: ${conversationId}`);
    socket.join(conversationId);
  });

  // Send Message Event
  socket.on("sendMessage", async (data) => {
    try {
      console.log("Message Data:", data);

      // Save message to DB
      const message = await Message.create(data);

      // Broadcast message to conversation room
      io.to(data.conversation).emit("newMessage", message);

      // Update conversation with last message
      await Conversation.findByIdAndUpdate(data.conversation, {
        lastMessage: message._id,
        $inc: { unreadCount: 1 },
      });
    } catch (err) {
      console.error("Error handling sendMessage:", err);
      socket.emit("error", err.message);
    }
  });

  // Handle Socket Disconnection
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
};

export default handleSocketEvents;
