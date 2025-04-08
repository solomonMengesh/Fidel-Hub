 const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  category: { type: String, required: true },
  price: { type: Number, required: true },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prerequisites: { type: String },
  technicalRequirements: { type: String },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  totalLessons: { type: Number, required: true }, 
  courseImage: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
