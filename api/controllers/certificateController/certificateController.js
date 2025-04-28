// server/controllers/Student-controller/certificateController.js

import Progress from '../../models/Progress.js';
import Certificate from '../../models/Certificate.js';
import { generateCertificate } from '../../utils/certificateGenerator.js';
import Student from '../../models/User.js';
import Course from '../../models/Course.js';

export const generateCertificateForStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const progress = await Progress.findOne({ studentId, courseId });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found for the student in this course' });
    }

    if (progress.progressPercentage !== 100) {
      return res.status(400).json({ message: 'Course not completed yet' });
    }

    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ message: 'Student or Course not found' });
    }

    const certificateUrl = await generateCertificate(studentId, courseId, student.name, course.title);

    const newCertificate = new Certificate({
      studentId,
      courseId,
      certificateUrl,
    });

    await newCertificate.save();

    res.json({
      success: true,
      message: 'Certificate generated successfully',
      certificateUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
