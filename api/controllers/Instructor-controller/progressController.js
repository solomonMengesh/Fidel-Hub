import Progress from '../../models/Progress.js';

export const updateProgress = async (req, res) => {
  const { studentId, courseId, lessonId } = req.body;

  try {
    let progress = await Progress.findOne({ studentId, courseId });

    if (!progress) {
      progress = await Progress.create({
        studentId,
        courseId,
        completedLessons: [lessonId],
        totalLessons: req.body.totalLessons,
        progressPercentage: (1 / req.body.totalLessons) * 100
      });
    } else {
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        progress.progressPercentage = (progress.completedLessons.length / progress.totalLessons) * 100;
        await progress.save();
      }
    }

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
