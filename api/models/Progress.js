import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: { type: [mongoose.Schema.Types.ObjectId], ref: 'Lesson', default: [] },  
  totalLessons: { type: Number, required: true }, 
  progressPercentage: { type: Number, default: 0 },  
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
