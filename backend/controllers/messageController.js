import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import { io, onlineUsers } from "../socket/socket.js";

// ================= SEND MESSAGE =================
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, text } = req.body;
    const senderId = req.user;

    if (!conversationId || !receiverId || !text) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create message
    const message = await Message.create({
      conversationId,
      senderId,
      receiverId,
      text,
    });

    // Update conversation last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
    });

    // 🔥 Emit real-time message to receiver
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId && io) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error("Send Message Error:", error.message);
    res.status(500).json({ message: "Server error while sending message" });
  }
};

// ================= GET MESSAGES =================
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversationId,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error.message);
    res.status(500).json({ message: "Server error while fetching messages" });
  }
};

// ================= MARK AS SEEN =================
export const markAsSeen = async (req, res) => {
  try {
    const { conversationId, senderId } = req.body;
    const userId = req.user;

    if (!conversationId || !senderId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await Message.updateMany(
      {
        conversationId,
        receiverId: userId,
        senderId,
        seen: false,
      },
      { seen: true },
    );

    // 🔥 Emit real-time seen update to sender
    const senderSocketId = onlineUsers.get(senderId);

    if (senderSocketId && io) {
      io.to(senderSocketId).emit("messagesSeen", {
        conversationId,
      });
    }

    res.status(200).json({ message: "Messages marked as seen" });
  } catch (error) {
    console.error("Mark As Seen Error:", error.message);
    res.status(500).json({ message: "Server error while marking as seen" });
  }
};
