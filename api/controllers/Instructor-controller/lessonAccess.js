import LessonAccess from '../../models/LessonAccess.js';

 export const grantLessonAccess = async (req, res) => {
  try {
    const { studentId, lessonId } = req.body;
    const access = await LessonAccess.findOne({ studentId, lessonId });

    if (access) {
      access.isAccessible = true;
      await access.save();
      res.json({ message: 'Access granted to lesson' });
    } else {
      const newAccess = await LessonAccess.create({ studentId, lessonId, isAccessible: true });
      res.status(201).json(newAccess);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

 export const checkLessonAccess = async (req, res) => {
  const { studentId, lessonId } = req.params;
  const access = await LessonAccess.findOne({ studentId, lessonId });
  
  if (access && access.isAccessible) {
    res.json({ access: true });
  } else {
    res.json({ access: false });
  }
};
