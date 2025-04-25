import express from "express";
import {
  getConversations,
  createConversation,
} from "../controllers/conversationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getConversations);
router.post("/", createConversation);

export default router;
