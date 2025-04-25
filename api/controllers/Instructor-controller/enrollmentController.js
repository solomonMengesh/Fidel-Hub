import Enrollment from '../../models/Enrollment.js';
import mongoose from 'mongoose';

export const enrollStudent = async (req, res) => {
  const { studentId, courseId } = req.body;

  try {
    // Check if the student is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    
    if (existingEnrollment) {
      return res.status(400).json({ error: "Student is already enrolled in this course" });
    }

    // Create new enrollment if not already enrolled
    const enrollment = await Enrollment.create(req.body);
    res.status(201).json(enrollment);
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const checkEnrollment = async (req, res) => {
  const { studentId, courseId } = req.params;

  try {
    const enrollment = await Enrollment.findOne({ studentId, courseId }).populate('paymentId');

    if (enrollment && enrollment.paymentId?.status === 'success') {
      res.json({ access: true });
    } else {
      res.json({ access: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const getEnrolledCourses = async (req, res) => {
  try {
    const { studentId } = req.params;

    const enrollments = await Enrollment.find({ studentId })
      .populate({
        path: 'courseId',
        select: 'title thumbnail category level createdAt updatedAt',
        populate: {
          path: 'instructor',
          select: 'name profilePicture',
        },
      })
      .populate({
        path: 'paymentId',
        select: 'status',
      })
      .exec();

    const successfulEnrollments = enrollments.filter(enrollment => enrollment.paymentId?.status === 'success');

    if (successfulEnrollments.length === 0) {
      return res.status(404).json({ message: 'No successful enrollments found for this student.' });
    }

    const courses = successfulEnrollments.map(enrollment => enrollment.courseId);

    const uniqueCourses = Array.from(new Set(courses.map(course => course._id.toString())))
      .map(id => courses.find(course => course._id.toString() === id));

    return res.status(200).json(uniqueCourses);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


