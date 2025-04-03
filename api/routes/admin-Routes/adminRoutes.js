import express from 'express';
import { 
    approveInstructor, 
    rejectInstructor, 
    listPendingInstructors, 
    listActiveInstructors, 
    listAllUsers,
    getUsersByRole
} from '../../controllers/admin-conroller/adminController.js';
import { adminAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Approve an instructor
router.put('/approve-instructor/:userId', adminAuth, approveInstructor);

// Reject and delete instructor route
router.delete('/reject-instructor/:id', adminAuth, rejectInstructor);

// List all pending instructors for approval
router.get('/pending-instructors', adminAuth, listPendingInstructors);

// List all active instructors
router.get('/active-instructors', adminAuth, listActiveInstructors);

// List all users (students, instructors, admins)
router.get('/all-users', adminAuth, listAllUsers);
router.get('/role/:role', adminAuth, getUsersByRole); 

export default router;
