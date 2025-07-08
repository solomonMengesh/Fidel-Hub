import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'computer-science', 'programming', 'web-development', 
      'business', 'marketing', 'data-science', 'psychology',
      'finance', 'design', 'languages', 'Health & Fitness',
      'mathematics', 'photography', 'music', 'other','Machine Learning',
    ]
  },
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  thumbnail: {
    url: String,
    publicId: String
  },
  requirements: [String],
  published: {
    type: Boolean,
    default: false
  },
  embedding: {
    type: [Number],
    default: [],
  },
  isActive: {
  type: Boolean,
  default: true  
}
,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

 courseSchema.virtual('modules', {
  ref: 'Module',
  localField: '_id',
  foreignField: 'course',
  justOne: false
});

// Cascade delete modules when a course is deleted
courseSchema.pre('deleteOne', { document: true }, async function(next) {
  await this.model('Module').deleteMany({ course: this._id });
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;