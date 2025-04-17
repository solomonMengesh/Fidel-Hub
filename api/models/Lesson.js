import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['video', 'quiz'],
    default: 'video'
  },
  position: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    default: '0:00'
  },
  content: {
    type: String,
    trim: true
  },
  video: {
    url: String,
    publicId: String,
    thumbnailUrl: String,
    thumbnailPublicId: String
  },
  free: {
    type: Boolean,
    default: false
  },
  quizQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizQuestion'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;