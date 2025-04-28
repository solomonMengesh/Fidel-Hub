import express from 'express';
import {
  addQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  getQuizQuestionsByLesson
} from '../../controllers/Instructor-controller/quizController.js';
import { protect, instructor } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:lessonId/questions')
  .post(protect, instructor, addQuizQuestion);

router.route('/questions/:questionId')
  .put(protect, instructor, updateQuizQuestion)
  .delete(protect, instructor, deleteQuizQuestion);

  router.get('/:lessonId/questions', protect, getQuizQuestionsByLesson);


export default router; 