import express from 'express';
import { approveInstructor ,listPendingInstructors ,rejectInstructor} from '../../controllers/admin-conroller/adminController.js';
import { adminAuth } from '../../middleware/authMiddleware.js';
 
const router = express.Router();

// Approve an instructor
router.put('/approve-instructor/:userId', adminAuth, approveInstructor);
// Reject and delete instructor route
router.delete('/reject-instructor/:id', adminAuth, rejectInstructor);

// List all pending instructors for approval
router.get('/pending-instructors', adminAuth, listPendingInstructors);

export default router;
