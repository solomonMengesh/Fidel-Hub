import Enrollment from '../../models/Enrollment.js';
import Course from '../../models/Course.js';
import Progress from '../../models/Progress.js';

export const getInstructorEnrollmentsPerCourse = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const courses = await Course.find({ instructor: instructorId }).select('_id title');

    const data = await Promise.all(
      courses.map(async course => {
        const count = await Enrollment.countDocuments({ courseId: course._id });
        return {
          courseId: course._id,
          courseTitle: course.title,
          enrollments: count
        };
      })
    );

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch enrollment data', error: err.message });
  }
};



export const getStudentProgressCompletion = async (req, res) => {
  try {
    const progresses = await Progress.find();

    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    progresses.forEach((progress) => {
      if (progress.progressPercentage >= 100) {
        completed++;
      } else if (progress.progressPercentage > 0) {
        inProgress++;
      } else {
        notStarted++;
      }
    });

    const total = completed + inProgress + notStarted;

    const data = [
      { name: 'Completed', value: total ? Math.round((completed / total) * 100) : 0, count: completed },
      { name: 'In Progress', value: total ? Math.round((inProgress / total) * 100) : 0, count: inProgress },
      { name: 'Not Started', value: total ? Math.round((notStarted / total) * 100) : 0, count: notStarted },
    ];

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

