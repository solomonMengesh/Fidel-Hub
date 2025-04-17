import Module from '../../models/Module.js';
import Course from '../../models/Course.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new module
// @route   POST /api/modules
// @access  Private/Instructor
export const createModule = asyncHandler(async (req, res) => {
  const { title, description, courseId } = req.body;

  const course = await Course.findById(courseId);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to add modules to this course');
  }

  // Get the next position number
  const moduleCount = await Module.countDocuments({ course: courseId });
  const position = moduleCount + 1;

  const module = new Module({
    title,
    description,
    course: courseId,
    position
  });

  const createdModule = await module.save();
  res.status(201).json(createdModule);
});

// @desc    Update module
// @route   PUT /api/modules/:id
// @access  Private/Instructor
export const updateModule = asyncHandler(async (req, res) => {
  const module = await Module.findById(req.params.id).populate('course');

  if (!module) {
    res.status(404);
    throw new Error('Module not found');
  }

  if (module.course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this module');
  }

  const { title, description } = req.body;

  module.title = title || module.title;
  module.description = description || module.description;

  const updatedModule = await module.save();
  res.json(updatedModule);
});

// @desc    Reorder modules
// @route   PUT /api/modules/:courseId/reorder
// @access  Private/Instructor
export const reorderModules = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { moduleIds } = req.body;

  const course = await Course.findById(courseId);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to reorder modules in this course');
  }

  // Update positions based on the order of moduleIds
  const bulkOps = moduleIds.map((moduleId, index) => ({
    updateOne: {
      filter: { _id: moduleId, course: courseId },
      update: { $set: { position: index + 1 } }
    }
  }));

  await Module.bulkWrite(bulkOps);

  const updatedModules = await Module.find({ course: courseId })
    .sort({ position: 1 });

  res.json(updatedModules);
});

// @desc    Delete module
// @route   DELETE /api/modules/:id
// @access  Private/Instructor
export const deleteModule = asyncHandler(async (req, res) => {
  const module = await Module.findById(req.params.id).populate('course');

  if (!module) {
    res.status(404);
    throw new Error('Module not found');
  }

  if (module.course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this module');
  }

  await module.deleteOne();
  
  // Recalculate positions for remaining modules
  const remainingModules = await Module.find({ course: module.course._id })
    .sort({ position: 1 });

  for (let i = 0; i < remainingModules.length; i++) {
    remainingModules[i].position = i + 1;
    await remainingModules[i].save();
  }

  res.json({ message: 'Module removed' });
});