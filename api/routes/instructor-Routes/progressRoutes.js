import express from 'express';
import { updateProgress ,getCompletedLessons ,getProgressData,getAllStudentsProgress} from '../../controllers/Instructor-controller/progressController.js';

const router = express.Router();

// Update student progress
router.post('/', updateProgress);
router.get('/:studentId/:courseId/completedLessons', getCompletedLessons);
router.get('/:studentId/:courseId', getProgressData);
router.get('/all-progress/:courseId', getAllStudentsProgress);

export default router;
