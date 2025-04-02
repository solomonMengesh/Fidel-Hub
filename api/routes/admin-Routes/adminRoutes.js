import express from 'express';
import { approveInstructor } from '../../controllers/admin-conroller/adminController.js';
import { adminAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Approve an instructor
router.put('/approve-instructor/:userId', adminAuth, approveInstructor);

export default router;
