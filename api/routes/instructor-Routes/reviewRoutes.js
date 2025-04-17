import express from 'express';
import { addReview, getCourseReviews } from '../../controllers/Instructor-controller/reviewController.js';

const router = express.Router();

// Add a review for a course
router.post('/', addReview);

// Get reviews for a specific course
router.get('/:courseId', getCourseReviews);

export default router;
