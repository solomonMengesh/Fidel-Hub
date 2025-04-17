import express from 'express';
import { uploadVideos } from '../../controllers/Instructor-controller/videoUploadController.js';  // Import video upload controller
 
const router = express.Router();

// Route to handle video upload for a specific lesson
router.post('/:lessonId/upload-videos', uploadVideos);

export default router;
