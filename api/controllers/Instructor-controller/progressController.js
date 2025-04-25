 import Progress from '../../models/Progress.js';
import Course from '../../models/Course.js';
import mongoose from 'mongoose';

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
  const courseId = String(req.params.courseId).trim();  // Convert and trim courseId

  // Validate courseId format
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({
      error: 'Invalid courseId format',
      receivedId: courseId,
      expectedFormat: '24-character hex string (e.g., 67fccf3fc59ea97cd3159cea)',
    });
  }

  try {
    // Convert courseId to ObjectId for querying
    const validCourseId = mongoose.Types.ObjectId(courseId);

    // Find progress data for the specified courseId
    const progressData = await Progress.find({ courseId: validCourseId })
      .populate('studentId', 'name')  // Populate studentId with name field
      .exec();

    // If no progress data is found
    if (!progressData?.length) {
      return res.status(404).json({ error: 'No progress data found for this course' });
    }

    // Prepare the response data
    const formattedData = progressData.map((progress) => ({
      studentName: progress.studentId.name,
      completedLessons: progress.completedLessons.length,
      totalLessons: progress.totalLessons,
      progressPercentage: progress.progressPercentage,
    }));

    // Return the formatted data as a JSON response
    res.json(formattedData);
  } catch (err) {
    // Handle errors during the process
    console.error("[ERROR] Exception details:", err);
    res.status(500).json({ error: err.message });
  }
};






export const getCourseProgressSummary = async (req, res) => {
  const { courseId } = req.params;

  console.log('Received courseId:', courseId);   

   if (!mongoose.Types.ObjectId.isValid(courseId)) {
    console.error('Invalid courseId format:', courseId);   
    return res.status(400).json({ error: 'Invalid courseId format' });
  }

  try {
     console.log('Fetching course data for courseId:', courseId);   
    const course = await Course.findById(courseId).select('title');
    
    if (!course) {
      console.error(`Course not found for courseId: ${courseId}`);  
      return res.status(404).json({ error: 'Course not found' });
    }

     console.log('Fetching progress records for courseId:', courseId);   
    const progressRecords = await Progress.find({ courseId });

    if (progressRecords.length === 0) {
      console.log('No progress records found for courseId:', courseId); 
      return res.status(404).json({ message: 'No progress records found' });
    }

    const totalProgress = progressRecords.reduce(
      (sum, record) => sum + record.progressPercentage,
      0
    );
    const averageProgress = (totalProgress / progressRecords.length).toFixed(2);

    console.log('Calculated average progress:', averageProgress);  
    res.json({
      course: course.title,
      students: progressRecords.length,
      averageProgress: `${averageProgress}%`,
    });
  } catch (err) {
    console.error('Error fetching course progress summary:', err);   
    res.status(500).json({ error: err.message });
  }
};


