import express from "express";
import {
  getPlatformStats,
  getUserGrowthData
} from "../../controllers/admin-conroller/analyticsController.js";

const router = express.Router();

router.get("/platform-stats", getPlatformStats);
router.get("/user-growth", getUserGrowthData);

export default router;
