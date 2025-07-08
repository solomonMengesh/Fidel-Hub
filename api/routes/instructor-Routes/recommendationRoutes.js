import express from 'express';
import { getRelatedCourses } from '../../controllers/Instructor-controller/courseController.js';
const router = express.Router();

router.get('/courses/:courseId/related', getRelatedCourses);


export default router;
