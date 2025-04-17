import express from 'express';
import {
  createModule,
  updateModule,
  reorderModules,
  deleteModule
} from '../../controllers/Instructor-controller/moduleController.js';
import { protect, instructor } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, instructor, createModule);

router.route('/:id')
  .put(protect, instructor, updateModule)
  .delete(protect, instructor, deleteModule);

router.route('/:courseId/reorder')
  .put(protect, instructor, reorderModules);

export default router; 