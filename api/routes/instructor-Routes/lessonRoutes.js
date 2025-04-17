import express from 'express';
import {
  createLesson,
  uploadLessonVideo,
  updateLesson,
  reorderLessons,
  deleteLesson,
  convertLessonType
} from '../../controllers/Instructor-controller/lessonController.js';
import { protect, instructor } from '../../middleware/authMiddleware.js';
import { uploadVideo } from '../../middleware/uploadToCloudinary.js';

const router = express.Router();
 
router.route('/')
  .post(protect, instructor, createLesson);

router.route('/:id/video')
  .put(protect, instructor, uploadVideo.single('video'), uploadLessonVideo);

router.route('/:id')
  .put(protect, instructor, updateLesson)
  .delete(protect, instructor, deleteLesson);

router.route('/:id/convert')
  .put(protect, instructor, convertLessonType);

router.route('/:moduleId/reorder')
  .put(protect, instructor, reorderLessons);

export default router;