import express from 'express';
import { enrollStudent, checkEnrollment } from '../../controllers/Instructor-controller/enrollmentController.js';

const router = express.Router();

router.post('/', enrollStudent);
router.get('/:studentId/:courseId', checkEnrollment);

export default router;
