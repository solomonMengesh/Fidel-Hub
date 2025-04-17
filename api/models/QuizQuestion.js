import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters']
  },
  options: [{
    text: {
      type: String,
      required: [true, 'Option text is required'],
      trim: true,
      maxlength: [200, 'Option cannot exceed 200 characters']
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  type: {
    type: String,
    enum: ['single', 'multiple'],
    default: 'single'
  },
  points: {
    type: Number,
    default: 1,
    min: [1, 'Points must be at least 1']
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
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

// Validate at least one correct answer
quizQuestionSchema.pre('save', function(next) {
  if (this.type === 'single') {
    const correctOptions = this.options.filter(opt => opt.isCorrect);
    if (correctOptions.length !== 1) {
      throw new Error('Single-choice questions must have exactly one correct answer');
    }
  } else {
    const correctOptions = this.options.filter(opt => opt.isCorrect);
    if (correctOptions.length < 1) {
      throw new Error('Multiple-choice questions must have at least one correct answer');
    }
  }
  next();
});

const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);

export default QuizQuestion;