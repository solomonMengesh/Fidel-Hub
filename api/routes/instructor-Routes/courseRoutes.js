import express from 'express';
import {
  createCourse,
  getCourses,
  getInstructorCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getStudentCountForCourse,
  getInstructorCoursesWithProgress,
  getCourseAverageProgress,
  setCourseStatus,
} from '../../controllers/Instructor-controller/courseController.js';
import { protect, instructor } from '../../middleware/authMiddleware.js';
import { upload } from '../../middleware/uploadToCloudinary.js';

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, instructor, upload.single('thumbnail'), createCourse);
  router.get('/:courseId/student-count', getStudentCountForCourse);
  router.patch("/:courseId/status", protect, setCourseStatus);

// router.route('/instructor')
//   .get(protect, instructor, getInstructorCourses);

router.route('/:id')
  .get(getCourseById)
  .put(protect, instructor, upload.single('thumbnail'), updateCourse)
  .delete(protect, instructor, deleteCourse);
  router.get('/:instructorId/courses/progress', getInstructorCoursesWithProgress);
  router.get("/:instructorId/course/:courseId/average-progress", getCourseAverageProgress);
  router.get('/instructor/:instructorId/courses', getInstructorCourses);

  
export default router;