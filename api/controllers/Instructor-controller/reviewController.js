import Review from '../../models/Review.js';

// Add a review
export const addReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get reviews for a course
export const getCourseReviews = async (req, res) => {
  const courseId = req.params.courseId;
  const reviews = await Review.find({ courseId });
  res.json(reviews);
};
