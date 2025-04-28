import express from 'express';
import { getStudentEnrollmentsPerCourse } from '../../controllers/graphs/admin.js';
import { protect, adminAuth } from '../../middleware/authMiddleware.js';

const adminRouter = express.Router();
adminRouter.use(protect, adminAuth);
adminRouter.get('/enrollments-per-course', getStudentEnrollmentsPerCourse);

export default adminRouter;