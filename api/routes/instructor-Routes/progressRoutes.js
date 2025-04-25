import express from 'express';
import { 
  updateProgress, 
  getCompletedLessons, 
  getProgressData, 
  getAllStudentsProgress, 
  getCourseProgressSummary 
} from '../../controllers/Instructor-controller/progressController.js';

const router = express.Router();

// Update student progress
router.post('/', updateProgress);

// Get completed lessons for a student in a course
router.get('/:studentId/:courseId/completedLessons', getCompletedLessons);

// Get progress data for a specific student in a course
router.get('/:studentId/:courseId', getProgressData);

// Get progress summary for all students in a course
router.get('/all-progress/:courseId', getAllStudentsProgress);

// Get course progress summary (e.g., average progress, student count)
router.get('/:courseId/summary', getCourseProgressSummary);

export default router;
