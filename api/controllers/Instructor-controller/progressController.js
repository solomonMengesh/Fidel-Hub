import mongoose from 'mongoose';
import Progress from '../../models/Progress.js';
import Course from '../../models/Course.js';

export const updateProgress = async (req, res) => {
  const { studentId, courseId, lessonId } = req.body;

  if (!lessonId) {
    return res.status(400).json({ error: 'Lesson ID is required' });
  }

  try {
    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    const course = await Course.findById(courseObjectId).populate({
      path: 'modules',
      populate: {
        path: 'lessons',
        model: 'Lesson'
      }
    });

    if (!course) return res.status(404).json({ error: 'Course not found' });

    const totalLessons = course.modules.reduce((count, mod) => {
      return count + (mod.lessons ? mod.lessons.length : 0);
    }, 0);

    if (totalLessons === 0) {
      return res.status(400).json({ error: 'No lessons found in this course' });
    }

    let progress = await Progress.findOne({ studentId: studentObjectId, courseId: courseObjectId });

    if (!progress) {
      progress = await Progress.create({
        studentId: studentObjectId,
        courseId: courseObjectId,
        completedLessons: [lessonId],
        totalLessons,
        progressPercentage: parseFloat(((1 / totalLessons) * 100).toFixed(2)),
      });
    } else {
      const alreadyCompleted = progress.completedLessons.includes(lessonId);
      if (!alreadyCompleted) {
        progress.completedLessons.push(lessonId);
        progress.progressPercentage = parseFloat(((progress.completedLessons.length / totalLessons) * 100).toFixed(2));
        await progress.save();
      }
    }

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




export const getCompletedLessons = async (req, res) => {
  const { studentId, courseId } = req.params; // assuming studentId and courseId are passed as params

  try {
    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    // Fetch the student's progress for the course
    const progress = await Progress.findOne({ studentId: studentObjectId, courseId: courseObjectId });

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found for this student and course' });
    }

    // Return completed lessons
    res.json({ completedLessons: progress.completedLessons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




export const getProgressData = async (req, res) => {
  const { studentId, courseId } = req.params;

  try {
    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    const progress = await Progress.findOne({
      studentId: studentObjectId,
      courseId: courseObjectId
    });

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found for this student and course' });
    }

    res.json({
      completedLessons: progress.completedLessons,
      totalLessons: progress.totalLessons,
      progressPercentage: progress.progressPercentage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAllStudentsProgress = async (req, res) => {
  const { courseId } = req.params;

  try {
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    // Fetch all progress records for the course
    const progressData = await Progress.find({ courseId: courseObjectId }).populate('studentId', 'name');

    if (!progressData || progressData.length === 0) {
      return res.status(404).json({ error: 'No progress data found for this course' });
    }

    res.json(progressData.map((progress) => ({
      studentName: progress.studentId.name,
      completedLessons: progress.completedLessons.length,
      totalLessons: progress.totalLessons,
      progressPercentage: progress.progressPercentage
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
