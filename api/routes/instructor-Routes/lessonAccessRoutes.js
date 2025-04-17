import express from 'express';
import { grantLessonAccess, checkLessonAccess } from '../../controllers/Instructor-controller/lessonAccess.js';

const router = express.Router();

// Grant access to a lesson for a student
router.post('/', grantLessonAccess);

// Check if a student has access to a specific lesson
router.get('/:studentId/:lessonId', checkLessonAccess);

export default router;
