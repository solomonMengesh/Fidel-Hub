import express from 'express';
import { enrollStudent, checkEnrollment } from '../../controllers/Instructor-controller/enrollmentController.js';

const router = express.Router();

// Enroll a student
router.post('/', enrollStudent);

// Check if a student is enrolled in a course and has paid
router.get('/:studentId/:courseId', checkEnrollment);

export default router;
