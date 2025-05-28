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
  setCourseVisibility,
  getActiveCourses,
  getAllCourses,
} from '../../controllers/Instructor-controller/courseController.js';
import { protect, instructor } from '../../middleware/authMiddleware.js';
import { upload } from '../../middleware/uploadToCloudinary.js';

const router = express.Router();

 router.route('/')
  .get(getCourses)
  .post(protect, instructor, upload.single('thumbnail'), createCourse);

 router.get('/active', getActiveCourses);
router.get('/:courseId/student-count', getStudentCountForCourse);
router.patch('/:courseId/status', protect, setCourseStatus);
router.patch('/visibility/:id', setCourseVisibility);
router.get('/:instructorId/courses/progress', getInstructorCoursesWithProgress);
router.get('/:instructorId/course/:courseId/average-progress', getCourseAverageProgress);
router.get('/instructor/:instructorId/courses', getInstructorCourses);

 router.route('/:id')
  .get(getCourseById)
  .put(protect, instructor, upload.single('thumbnail'), updateCourse)
  .delete(protect, instructor, deleteCourse);
router.get('/courses', getAllCourses);

export default router;
