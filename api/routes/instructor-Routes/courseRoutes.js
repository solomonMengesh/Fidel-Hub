import express from 'express';
import {
  createCourse,
  getCourses,
  getInstructorCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} from '../../controllers/Instructor-controller/courseController.js';
import { protect, instructor } from '../../middleware/authMiddleware.js';
import { upload } from '../../middleware/uploadToCloudinary.js';

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, instructor, upload.single('thumbnail'), createCourse);

router.route('/instructor')
  .get(protect, instructor, getInstructorCourses);

router.route('/:id')
  .get(getCourseById)
  .put(protect, instructor, upload.single('thumbnail'), updateCourse)
  .delete(protect, instructor, deleteCourse);

export default router;