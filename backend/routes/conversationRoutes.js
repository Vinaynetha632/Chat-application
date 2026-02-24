import express from "express";
import {
  createConversation,
  getConversations,
} from "../controllers/conversationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create or get existing conversation
router.post("/", protect, createConversation);

// Get all conversations of logged-in user
router.get("/", protect, getConversations);

export default router;