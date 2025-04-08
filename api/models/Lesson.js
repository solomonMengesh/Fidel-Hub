const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  title: { type: String, required: true },
  lessonType: {
    type: String,
    enum: ['video', 'quiz'],
    required: true
  },
  videoUrl: { type: String }, 
  quizQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuizQuestion' }], // For quiz lessons
  description: { type: String },  
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
