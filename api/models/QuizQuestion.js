 const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  question: { type: String, required: true },
  options: [
    {
      optionText: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
