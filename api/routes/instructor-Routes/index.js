import express from 'express';
import courseRoutes from './courseRoutes.js';
import lessonRoutes from './lessonRoutes.js';
import moduleRoutes from './moduleRoutes.js';
import quizRoutes from './quizRoutes.js';
import mediaRoutes from './mediaRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';
import progressRoutes from './progressRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import graphRoutes from './graphs.js';
import recommendationsRoutes from './recommendationRoutes.js';
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
router.use('/enrollments', enrollmentRoutes);
// Route for progress
router.use('/progress', progressRoutes);
router.use('/review', reviewRoutes);
// Route for graphs
router.use('/graphs', graphRoutes);

// Route for recommendations
router.use('/recommendations', recommendationsRoutes);

export default router;
