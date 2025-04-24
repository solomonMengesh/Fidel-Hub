import express from 'express';
import { enrollStudent, checkEnrollment,getEnrolledCourses } from '../../controllers/Instructor-controller/enrollmentController.js';
import Enrollment from '../../models/Enrollment.js';

const router = express.Router();

router.post('/', enrollStudent);
router.get("/:studentId/courses", getEnrolledCourses);
router.get('/:studentId/:courseId', checkEnrollment);

router.get('/check', async (req, res) => {
    const { studentId, courseId } = req.query;
  
    try {
      const enrollment = await Enrollment.findOne({ studentId, courseId });
      res.json({ isEnrolled: !!enrollment });
    } catch (error) {
      console.error("Enrollment check error:", error);
      res.status(500).json({ error: "Server error checking enrollment" });
    }
  });
export default router;
