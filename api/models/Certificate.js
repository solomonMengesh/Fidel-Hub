 import mongoose from 'mongoose';

const { Schema } = mongoose;

const CertificateSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    certificateUrl: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Certificate = mongoose.model('Certificate', CertificateSchema);

export default Certificate;
