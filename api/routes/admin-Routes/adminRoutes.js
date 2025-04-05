import express from "express";
import {
  approveInstructor,
  rejectInstructor,
  listPendingInstructors,
  listActiveInstructors,
  listAllUsers,
  getUsersByRole,
  blockUser,
  unblockUser,
  getUserById,
} from "../../controllers/admin-conroller/adminController.js";
import { adminAuth } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.put("/approve-instructor/:userId", adminAuth, approveInstructor);

router.delete("/reject-instructor/:id", adminAuth, rejectInstructor);

router.get("/pending-instructors", adminAuth, listPendingInstructors);

router.get("/active-instructors", adminAuth, listActiveInstructors);

router.get("/all-users", adminAuth, listAllUsers);
router.get("/role/:role", adminAuth, getUsersByRole);
router.put("/block/:id", blockUser);
router.put("/unblock/:id", unblockUser);
router.get("/:id", getUserById);

export default router;
