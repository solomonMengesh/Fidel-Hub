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

export const getInstructorCourseRatings = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const courses = await Course.find({ instructor: instructorId });
    if (!courses.length) return res.status(404).json({ message: 'No courses found' });

    const courseRatings = await Promise.all(
      courses.map(async course => {
        const reviews = await Review
          .find({ course: course._id })
          .populate('student', 'name')
          .sort({ createdAt: -1 });  
        const totalReviews = reviews.length;
        const avgRating = totalReviews
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
          : '0.0';

         const recentReview = reviews[0];
        const mostRecentRating = recentReview ? recentReview.rating : 'N/A';
        const mostRecentComment = recentReview ? recentReview.comment : 'No reviews yet';
        const mostRecentStudentName = recentReview ? recentReview.student.name : 'N/A';
        const mostRecentCommentDate = recentReview ? recentReview.createdAt : null;

        const studentRatings = reviews.map(r => ({
          studentName: r.student.name,
          rating: r.rating,
        }));

        return {
          courseId: course._id,
          courseTitle: course.title,
          avgRating,
          totalReviews,
          mostRecentRating,
          mostRecentComment,
          mostRecentStudentName,
          mostRecentCommentDate,
          studentRatings,
        };
      })
    );

    res.status(200).json(courseRatings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
    console.error(error);
  }
};
