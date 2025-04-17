import express from 'express';
import courseRoutes from './courseRoutes.js';
import lessonRoutes from './lessonRoutes.js';
import moduleRoutes from './moduleRoutes.js';
import quizRoutes from './quizRoutes.js';
import mediaRoutes from './mediaRoutes.js';

const router = express.Router();

// Route for courses
router.use('/courses', courseRoutes);

// Route for lessons
router.use('/lessons', lessonRoutes);

// Route for modules
router.use('/modules', moduleRoutes);

// Route for quizzes
router.use('/quizzes', quizRoutes);

// Route for media
router.use('/media', mediaRoutes);

export default router;
