import express from 'express';
import { updateProgress } from '../../controllers/Instructor-controller/progressController.js';

const router = express.Router();

// Update student progress
router.post('/', updateProgress);

export default router;
