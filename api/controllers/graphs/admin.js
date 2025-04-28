import Enrollment from '../../models/Enrollment.js';
import Course from '../../models/Course.js';

export const getStudentEnrollmentsPerCourse = async (req, res) => {
  try {
    const courses = await Course.find().select('_id title category');

    const data = await Promise.all(
      courses.map(async (course) => {
        const count = await Enrollment.countDocuments({ courseId: course._id });
        return {
          courseId: course._id,
          courseTitle: course.title,
          category: course.category, // Including category
          enrollments: count,
        };
      })
    );

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch enrollment data', error: err.message });
  }
};
