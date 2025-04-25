import express from 'express';
import { submitReview, getCourseReviews } from '../../controllers/Instructor-controller/reviewController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Submit review
router.post('/:courseId', protect, submitReview);

// Get all reviews for a course
router.get('/:courseId', getCourseReviews);

export default router;
