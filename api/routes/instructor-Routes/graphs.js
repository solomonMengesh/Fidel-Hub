import express from 'express';
import { getInstructorEnrollmentsPerCourse,getStudentProgressCompletion } from '../../controllers/graphs/instructor.js';
import { protect } from '../../middleware/authMiddleware.js';

const instructorRouter = express.Router();
instructorRouter.use( protect);
instructorRouter.get('/enrollments-per-course', getInstructorEnrollmentsPerCourse);
instructorRouter.get('/student-progress-completion', getStudentProgressCompletion);

export default instructorRouter;