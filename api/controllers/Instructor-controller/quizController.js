import QuizQuestion from '../../models/QuizQuestion.js';
import Lesson from '../../models/Lesson.js';
import asyncHandler from 'express-async-handler';

// @desc    Add quiz question to lesson
// @route   POST /api/lessons/:lessonId/questions
// @access  Private/Instructor
export const addQuizQuestion = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const { question, options, type, points } = req.body;

  const lesson = await Lesson.findById(lessonId).populate({
    path: 'module',
    populate: {
      path: 'course'
    }
  });

  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  if (lesson.module.course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to add questions to this lesson');
  }

  if (lesson.type !== 'quiz') {
    res.status(400);
    throw new Error('Lesson is not a quiz');
  }

  const quizQuestion = new QuizQuestion({
    question,
    options,
    type: type || 'single',
    points: points || 1,
    lesson: lessonId
  });

  const createdQuestion = await quizQuestion.save();

  // Add question to lesson's quizQuestions array
  lesson.quizQuestions.push(createdQuestion._id);
  await lesson.save();

  res.status(201).json(createdQuestion);
});

// @desc    Update quiz question
// @route   PUT /api/questions/:questionId
// @access  Private/Instructor
export const updateQuizQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const { question, options, type, points } = req.body;

  const quizQuestion = await QuizQuestion.findById(questionId)
    .populate({
      path: 'lesson',
      populate: {
        path: 'module',
        populate: {
          path: 'course'
        }
      }
    });

  if (!quizQuestion) {
    res.status(404);
    throw new Error('Question not found');
  }

  if (quizQuestion.lesson.module.course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this question');
  }

  quizQuestion.question = question || quizQuestion.question;
  quizQuestion.options = options || quizQuestion.options;
  quizQuestion.type = type || quizQuestion.type;
  quizQuestion.points = points || quizQuestion.points;

  const updatedQuestion = await quizQuestion.save();
  res.json(updatedQuestion);
});

// @desc    Delete quiz question
// @route   DELETE /api/questions/:questionId
// @access  Private/Instructor
export const deleteQuizQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  const quizQuestion = await QuizQuestion.findById(questionId)
    .populate({
      path: 'lesson',
      populate: {
        path: 'module',
        populate: {
          path: 'course'
        }
      }
    });

  if (!quizQuestion) {
    res.status(404);
    throw new Error('Question not found');
  }

  if (quizQuestion.lesson.module.course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this question');
  }

  // Remove question from lesson's quizQuestions array
  await Lesson.updateOne(
    { _id: quizQuestion.lesson._id },
    { $pull: { quizQuestions: quizQuestion._id } }
  );

  await quizQuestion.deleteOne();
  res.json({ message: 'Question removed' });
});

// @desc    Get all quiz questions for a lesson
// @route   GET /api/lessons/:lessonId/questions
// @access  Private (Instructor or Student)
export const getQuizQuestionsByLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;

  const lesson = await Lesson.findById(lessonId).populate({
    path: 'quizQuestions',
  });

  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  res.json(lesson.quizQuestions);
});
