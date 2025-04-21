import Enrollment from '../../models/Enrollment.js';

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
