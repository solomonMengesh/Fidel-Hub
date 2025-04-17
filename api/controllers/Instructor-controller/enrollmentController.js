 import Enrollment from '../../models/Enrollment.js';  // Correct relative path

export const enrollStudent = async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const checkEnrollment = async (req, res) => {
  const { studentId, courseId } = req.params;
  const enrollment = await Enrollment.findOne({ studentId, courseId });
  if (enrollment && enrollment.paymentStatus === 'paid') {
    res.json({ access: true });
  } else {
    res.json({ access: false });
  }
};
