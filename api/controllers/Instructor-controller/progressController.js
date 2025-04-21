import mongoose from 'mongoose';
import Progress from '../../models/Progress.js';
import Course from '../../models/Course.js';

export const updateProgress = async (req, res) => {
  const { studentId, courseId, lessonId } = req.body;

  try {
    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const lessonObjectId = new mongoose.Types.ObjectId(lessonId);

    // ✅ Fetch course and populate modules and lessons
    const course = await Course.findById(courseObjectId).populate({
      path: 'modules',
      populate: {
        path: 'lessons',
        model: 'Lesson'
      }
    });

    if (!course) return res.status(404).json({ error: 'Course not found' });

    // ✅ Calculate total number of lessons
    const totalLessons = course.modules.reduce((count, mod) => {
      return count + (mod.lessons ? mod.lessons.length : 0);
    }, 0);

    if (totalLessons === 0) {
      return res.status(400).json({ error: 'No lessons found in this course' });
    }

    // ✅ Find or update student progress
    let progress = await Progress.findOne({ studentId: studentObjectId, courseId: courseObjectId });

    if (!progress) {
      progress = await Progress.create({
        studentId: studentObjectId,
        courseId: courseObjectId,
        completedLessons: [lessonObjectId],
        totalLessons,
        progressPercentage: (1 / totalLessons) * 100,
      });
    } else {
      const alreadyCompleted = progress.completedLessons.some(id => id.equals(lessonObjectId));
      if (!alreadyCompleted) {
        progress.completedLessons.push(lessonObjectId);
        progress.progressPercentage = (progress.completedLessons.length / totalLessons) * 100;
        await progress.save();
      }
    }

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
