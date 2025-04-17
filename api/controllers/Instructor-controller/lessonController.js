import Lesson from '../../models/Lesson.js';
import Module from '../../models/Module.js';
import QuizQuestion from '../../models/QuizQuestion.js';
import asyncHandler from 'express-async-handler';
import { processVideo } from '../../services/videoProcessing.js';
import { deleteFromCloudinary } from '../../services/cloudStorage.js';

// @desc    Create a new lesson
// @route   POST /api/lessons
// @access  Private/Instructor
export const createLesson = asyncHandler(async (req, res) => {
  const { title, description, moduleId, type } = req.body;

  const module = await Module.findById(moduleId).populate('course');
  
  if (!module) {
    res.status(404);
    throw new Error('Module not found');
  }

  if (module.course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to add lessons to this module');
  }

  // Get the next position number
  const lessonCount = await Lesson.countDocuments({ module: moduleId });
  const position = lessonCount + 1;

  const lesson = new Lesson({
    title,
    description,
    module: moduleId,
    type: type || 'video',
    position
  });

  const createdLesson = await lesson.save();
  res.status(201).json(createdLesson);
});

// @desc    Upload video for lesson
// @route   PUT /api/lessons/:id/video
// @access  Private/Instructor
export const uploadLessonVideo = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate({
    path: 'module',
    populate: {
      path: 'course'
    }
  });

  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  if (lesson.module.course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this lesson');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No video file uploaded');
  }

  try {
    // Delete old video if exists
    if (lesson.video?.publicId) {
      await deleteFromCloudinary(lesson.video.publicId, 'video');
      if (lesson.video.thumbnailPublicId) {
        await deleteFromCloudinary(lesson.video.thumbnailPublicId);
      }
    }

    // Process video (generate thumbnail, get duration, upload to cloud)
    const videoData = await processVideo(req.file.path, {
      public_id: `course-${lesson.module.course._id}/module-${lesson.module._id}/lesson-${lesson._id}`,
      resource_type: 'video'
    });

    // Update lesson with video data
    lesson.video = {
      url: videoData.videoUrl,
      publicId: videoData.videoPublicId,
      thumbnailUrl: videoData.thumbnailUrl,
      thumbnailPublicId: videoData.thumbnailPublicId
    };
    lesson.duration = formatDuration(videoData.duration);
    lesson.type = 'video';

    const updatedLesson = await lesson.save();
    res.json(updatedLesson);
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500);
    throw new Error('Failed to process video');
  }
});

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private/Instructor
export const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate({
    path: 'module',
    populate: {
      path: 'course'
    }
  });

  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  if (lesson.module.course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this lesson');
  }

  const { title, description, content, free } = req.body;

  lesson.title = title || lesson.title;
  lesson.description = description || lesson.description;
  lesson.content = content || lesson.content;
  lesson.free = free !== undefined ? free : lesson.free;

  const updatedLesson = await lesson.save();
  res.json(updatedLesson);
});

// @desc    Reorder lessons
// @route   PUT /api/lessons/:moduleId/reorder
// @access  Private/Instructor
export const reorderLessons = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const { lessonIds } = req.body;

  const module = await Module.findById(moduleId).populate('course');
  
  if (!module) {
    res.status(404);
    throw new Error('Module not found');
  }

  if (module.course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to reorder lessons in this module');
  }

  // Update positions based on the order of lessonIds
  const bulkOps = lessonIds.map((lessonId, index) => ({
    updateOne: {
      filter: { _id: lessonId, module: moduleId },
      update: { $set: { position: index + 1 } }
    }
  }));

  await Lesson.bulkWrite(bulkOps);

  const updatedLessons = await Lesson.find({ module: moduleId })
    .sort({ position: 1 });

  res.json(updatedLessons);
});

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Instructor
export const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate({
    path: 'module',
    populate: {
      path: 'course'
    }
  });

  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  if (lesson.module.course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this lesson');
  }

  // Delete video if exists
  if (lesson.video?.publicId) {
    await deleteFromCloudinary(lesson.video.publicId, 'video');
    if (lesson.video.thumbnailPublicId) {
      await deleteFromCloudinary(lesson.video.thumbnailPublicId);
    }
  }

  // Delete quiz questions if exists
  if (lesson.quizQuestions?.length > 0) {
    await QuizQuestion.deleteMany({ _id: { $in: lesson.quizQuestions } });
  }

  await lesson.deleteOne();
  
  // Recalculate positions for remaining lessons
  const remainingLessons = await Lesson.find({ module: lesson.module._id })
    .sort({ position: 1 });

  for (let i = 0; i < remainingLessons.length; i++) {
    remainingLessons[i].position = i + 1;
    await remainingLessons[i].save();
  }

  res.json({ message: 'Lesson removed' });
});

// @desc    Convert lesson type
// @route   PUT /api/lessons/:id/convert
// @access  Private/Instructor
export const convertLessonType = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate({
    path: 'module',
    populate: {
      path: 'course'
    }
  });
  const { newType } = req.body;

  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  if (lesson.module.course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this lesson');
  }

  if (lesson.type === newType) {
    res.status(400);
    throw new Error('Lesson is already of this type');
  }

  if (newType === 'quiz') {
    // Convert from video to quiz
    if (lesson.video?.publicId) {
      await deleteFromCloudinary(lesson.video.publicId, 'video');
      if (lesson.video.thumbnailPublicId) {
        await deleteFromCloudinary(lesson.video.thumbnailPublicId);
      }
    }
    
    lesson.video = undefined;
    lesson.duration = '15:00'; // Default quiz duration
    lesson.type = 'quiz';
  } else {
    // Convert from quiz to video
    if (lesson.quizQuestions?.length > 0) {
      await QuizQuestion.deleteMany({ _id: { $in: lesson.quizQuestions } });
    }
    
    lesson.quizQuestions = [];
    lesson.duration = '0:00';
    lesson.type = 'video';
  }

  const updatedLesson = await lesson.save();
  res.json(updatedLesson);
});

// Helper function to format duration (seconds to MM:SS)
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}