import Course from '../../models/Course.js';
import Module from '../../models/Module.js';
import asyncHandler from 'express-async-handler';
import { deleteFromCloudinary } from '../../services/cloudStorage.js';
import Enrollment from '../../models/Enrollment.js';


// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Instructor
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, level, price, requirements } = req.body;
  
  const course = new Course({
    title,
    description,
    instructor: req.user._id,
    category,
    level,
    price,
    requirements: requirements || []
  });

  if (req.file) {
    course.thumbnail = {
      url: req.file.path,
      publicId: req.file.filename
    };
  }

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
});

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ published: true })
    .populate('instructor', 'name email')
    .populate({
      path: 'modules',
      populate: {
        path: 'lessons',
        select: 'title type duration free'
      }
    });
  
  res.json(courses);
});

// @desc    Get instructor's courses
// @route   GET /api/courses/instructor
// @access  Private/Instructor
export const getInstructorCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id })
    .populate({
      path: 'modules',
      populate: {
        path: 'lessons',
        select: 'title type duration free'
      }
    });
  
  res.json(courses);
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name email')
    .populate({
      path: 'modules',
      options: { sort: { position: 1 } },
      populate: {
        path: 'lessons',
        options: { sort: { position: 1 } },
        select: 'title type duration free position video quizQuestions',
      },
    });

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

 
  let totalCourseDurationInSeconds = 0;

  // Convert to object to safely attach new properties
  const courseObj = course.toObject();

  courseObj.modules = courseObj.modules.map((module, index) => {
     let moduleDurationInSeconds = 0;

    module.lessons.forEach((lesson) => {
      const durationInSeconds = parseDuration(lesson.duration);
      moduleDurationInSeconds += durationInSeconds;
      totalCourseDurationInSeconds += durationInSeconds;
    });

    return {
      ...module,
      totalDuration: formatTime(moduleDurationInSeconds),
    };
  });

  // Attach total course duration
  courseObj.totalDuration = formatTime(totalCourseDurationInSeconds);

  res.json(courseObj);
});

// Helper: parse "mm:ss" into seconds
function parseDuration(duration) {
  if (!duration) return 0;
  const [minutes, seconds] = duration.split(':').map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
}

// Helper: format seconds into "mm:ss"
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}


// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this course');
  }

  const { title, description, category, level, price, requirements, published } = req.body;

  course.title = title || course.title;
  course.description = description || course.description;
  course.category = category || course.category;
  course.level = level || course.level;
  course.price = price || course.price;
  course.requirements = requirements || course.requirements;
  course.published = published !== undefined ? published : course.published;

  if (req.file) {
    // Delete old thumbnail if exists
    if (course.thumbnail?.publicId) {
      await deleteFromCloudinary(course.thumbnail.publicId);
    }
    course.thumbnail = {
      url: req.file.path,
      publicId: req.file.filename
    };
  }

  const updatedCourse = await course.save();
  res.json(updatedCourse);
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this course');
  }

  // Delete thumbnail if exists
  if (course.thumbnail?.publicId) {
    await deleteFromCloudinary(course.thumbnail.publicId);
  }

  await course.deleteOne();
  res.json({ message: 'Course removed' });
});




export const getStudentCountForCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const count = await Enrollment.countDocuments({ courseId });
    res.status(200).json({ studentCount: count });
  } catch (error) {
    console.error('Error counting students:', error);
    res.status(500).json({ message: 'Failed to count students' });
  }
};