 const mongoose = require('mongoose');

const lessonAccessSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  isAccessible: { type: Boolean, default: false },  
}, { timestamps: true });

module.exports = mongoose.model('LessonAccess', lessonAccessSchema);
