import Review from '../../models/Review.js';
import Course from '../../models/Course.js';

export const submitReview = async (req, res) => {
  const { courseId } = req.params;
  console.log('Course ID:', courseId);
  const { rating, comment } = req.body;
  const studentId = req.user._id;

  try {
    const existing = await Review.findOne({ course: courseId, student: studentId });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted a review for this course.' });
    }

    const review = await Review.create({
      course: courseId,
      student: studentId,
      rating,
      comment,
    });

     const reviews = await Review.find({ course: courseId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Course.findByIdAndUpdate(courseId, { averageRating: avgRating.toFixed(1) });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting review.', error: err.message });
  }
};

export const getCourseReviews = async (req, res) => {
  const { courseId } = req.params;

  try {
     const reviews = await Review.find({ course: courseId }).populate('student', 'name');
    
     const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : 0;

     const reviewStats = {
      totalReviews,
      avgRating: avgRating.toFixed(1),  
    };

     res.status(200).json({ reviewStats, reviews });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get course reviews.', error: err.message });
  }
};

