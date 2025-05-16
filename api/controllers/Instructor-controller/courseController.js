import Course from '../../models/Course.js';
import Module from '../../models/Module.js';
import asyncHandler from 'express-async-handler';
import { deleteFromCloudinary } from '../../services/cloudStorage.js';
import Enrollment from '../../models/Enrollment.js';
import mongoose from 'mongoose';  // <-- Add this import
import Progress from '../../models/Progress.js'; 
 
 
const bannedWords = ['porn', 'xxx', 'sex', 'nude', 'adult'];
function containsBannedContent(text) {
  return bannedWords.some(word => text.toLowerCase().includes(word));
}
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, level, price, requirements } = req.body;
  if (containsBannedContent(title) || containsBannedContent(description)) {
    return res.status(400).json({ message: "Inappropriate content is not allowed." });
  }
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

 
export const getInstructorCourses = async (req, res) => {
  try {
    const { instructorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({ message: "Invalid instructor ID" });
    }

    const courses = await Course.find({
      instructor: new mongoose.Types.ObjectId(instructorId),
    });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found for this instructor" });
    }

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


 
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

export const setCourseStatus = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);


  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this course");
  }

  // Expecting a boolean
  const { published } = req.body;

  if (typeof published !== "boolean") {
    res.status(400);
    throw new Error("Published status must be a boolean value");
  }

  course.published = published;
  const updatedCourse = await course.save();

  res.status(200).json({
    message: `Course ${published ? "published" : "saved as draft"} successfully`,
    course: updatedCourse,
  });
});

 
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


export const getInstructorCoursesWithProgress = async (req, res) => {
  const { instructorId } = req.params;  // Get instructorId from the URL

  // Validate instructorId
  if (!mongoose.Types.ObjectId.isValid(instructorId)) {
    return res.status(400).json({ error: 'Invalid instructorId format' });
  }

  try {
    // Fetch all courses that belong to the given instructor
    const courses = await Course.find({ instructor: instructorId });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No courses found for this instructor' });
    }

    // Fetch progress and enrollment data for each course and its enrolled students
    const coursesWithProgress = await Promise.all(courses.map(async (course) => {
      // Fetch progress data for the course's enrolled students
      const progressRecords = await Progress.find({ courseId: course._id })
        .populate('studentId', 'name email')  // Populate student details
        .populate('completedLessons');  // Populate completed lessons

      // Fetch enrollment data for each student
      const enrollmentRecords = await Enrollment.find({ courseId: course._id })
        .populate('studentId', 'name email');  // Populate student details

      const studentsProgress = progressRecords.map(record => {
        const enrollment = enrollmentRecords.find(enroll => enroll.studentId._id.toString() === record.studentId._id.toString());

        return {
          studentId: record.studentId._id,
          name: record.studentId.name,
          email: record.studentId.email,
          enrolledAt: enrollment ? enrollment.enrolledAt : null,  // Include enrollment date
          completedLessons: record.completedLessons,  // Include completed lessons
          progressPercentage: record.progressPercentage,
        };
      });

      return {
        courseId: course._id,
        title: course.title,
        category: course.category,
        enrolledStudents: studentsProgress,
      };
    }));

    // Respond with the instructor's courses along with student progress
    res.json({ instructorId, courses: coursesWithProgress });
  } catch (err) {
    console.error('Error fetching instructor courses with progress:', err);
    res.status(500).json({ error: err.message });
  }
};











 
 

export const getCourseAverageProgress = async (req, res) => {
  try {
    const { instructorId, courseId } = req.params;

    // Verify the course exists and belongs to the instructor
    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
    }).select("title");

    if (!course) {
      return res.status(404).json({ error: "Course not found or not owned by instructor" });
    }

    // Find all enrollments for the course
    const enrollments = await Enrollment.find({ courseId }).select("studentId");

    if (!enrollments.length) {
      return res.json({
        courseId,
        courseTitle: course.title,
        averageProgress: 0,
        studentCount: 0,
      });
    }

    // Get student IDs from enrollments
    const studentIds = enrollments.map((enrollment) => enrollment.studentId);

    // Fetch progress for all students in the course
    const progressRecords = await Progress.find({
      courseId,
      studentId: { $in: studentIds },
    }).select("progressPercentage");

    if (!progressRecords.length) {
      return res.json({
        courseId,
        courseTitle: course.title,
        averageProgress: 0,
        studentCount: enrollments.length,
      });
    }

    // Calculate average progress
    const totalProgress = progressRecords.reduce(
      (sum, record) => sum + (record.progressPercentage || 0),
      0
    );
    const averageProgress = Number(
      (totalProgress / progressRecords.length).toFixed(2)
    );

    res.json({
      courseId,
      courseTitle: course.title,
      averageProgress,
      studentCount: enrollments.length,
    });
  } catch (error) {
    console.error("Error fetching course average progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};