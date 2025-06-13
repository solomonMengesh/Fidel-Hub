import express from "express";
import {
  getPlatformStats,
  getUserGrowthData
} from "../../controllers/admin-conroller/analyticsController.js";
import {
 getCategoryCompletionRates
} from "../../controllers/admin-conroller/progressController.js";

const router = express.Router();

router.get("/platform-stats", getPlatformStats);
router.get("/user-growth", getUserGrowthData);
router.get("/course-completion", getCategoryCompletionRates);

export default router;
