import Conversation from "../models/Conversation.js";

// CREATE or GET existing conversation
export const createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID required" });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (conversation) {
      return res.status(200).json(conversation);
    }

    // Create new conversation
    conversation = await Conversation.create({
      members: [senderId, receiverId],
    });

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all conversations of logged-in user
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.user,
    })
      .populate("members", "fullName email profilePic status isOnline")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
