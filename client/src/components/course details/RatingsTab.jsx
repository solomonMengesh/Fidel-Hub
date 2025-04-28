import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { ReviewModal } from "./ReviewModal";
import { format } from "date-fns";

export const RatingsTab = ({ courseId, courseTitle }) => {
  const { user, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ totalReviews: 0, avgRating: "0.0" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});

  // Calculate rating distribution
  const ratingDistribution = Array(5).fill(0);
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating - 1]++;
    }
  });

  // Toggle read more/less for comments
  const toggleComment = (reviewId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/review/${courseId}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Sort reviews by createdAt in descending order and take the top 5
        const sortedReviews = (data.reviews || [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setReviews(sortedReviews);
        setReviewStats(data.reviewStats || { totalReviews: 0, avgRating: "0.0" });
      } catch (error) {
        console.error("[RatingsTab] Failed to fetch reviews:", error);
        setError("Failed to load reviews. Please try again later.");
        toast.error("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [courseId]);

  // Handle review submission
  const handleSubmitReview = async ({ rating, comment }) => {
    if (!user?._id) {
      throw new Error("401: User not authenticated");
    }
    try {
      const response = await fetch(`http://localhost:5000/api/review/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          rating,
          comment,
          studentId: user._id,
        }),
      });
      if (!response.ok) {
        throw new Error(`${response.status}: Failed to submit review`);
      }
      const newReview = await response.json();
      setReviews((prev) => {
        const updatedReviews = [
          {
            ...newReview,
            student: { _id: user._id, name: user.name || "Anonymous" },
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        return updatedReviews;
      });
      setReviewStats((prev) => ({
        totalReviews: prev.totalReviews + 1,
        avgRating: (
          (parseFloat(prev.avgRating) * prev.totalReviews + rating) /
          (prev.totalReviews + 1)
        ).toFixed(1),
      }));
      toast.success("Review submitted successfully!");
    } catch (error) {
      throw error; // Handled by ReviewModal
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-pulse h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">Error</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 atop-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content: Reviews List */}
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-3">
                    Be the first to share your experience!
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {reviews.map((review, index) => {
                    const isLongComment = review.comment.length > 200;
                    const isExpanded = expandedComments[review._id];
                    const displayComment =
                      isLongComment && !isExpanded
                        ? `${review.comment.slice(0, 200)}...`
                        : review.comment;

                    return (
                      <motion.div
                        key={review._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                {review.student.name}
                              </h4>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-5 w-5 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300 dark:text-gray-600 fill-none"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              {format(new Date(review.createdAt), "MMMM d, yyyy")}
                            </p>
                            <div className="relative pl-4 border-l-2 border-blue-600 dark:border-blue-400">
                              <p className="text-gray-600 dark:text-gray-300 text-base">
                                <span className="text-blue-600 dark:text-blue-400 text-xl font-serif">"</span>
                                {displayComment}
                                <span className="text-blue-600 dark:text-blue-400 text-xl font-serif">"</span>
                              </p>
                              {isLongComment && (
                                <button
                                  onClick={() => toggleComment(review._id)}
                                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2"
                                >
                                  {isExpanded ? "Read less" : "Read more..."}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </motion.div>
          </div>

          {/* Sidebar: Stats, Rating Distribution, and Review Button */}
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm sticky top-6 space-y-6"
            >
              {/* Average Rating */}
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200 dark:text-gray-700"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="44"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-blue-600"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="44"
                      cx="50"
                      cy="50"
                      strokeDasharray={`${(parseFloat(reviewStats.avgRating) / 5) * 276.5} 276.5`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {reviewStats.avgRating}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Average Rating
                </h3>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < Math.round(parseFloat(reviewStats.avgRating))
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 dark:text-gray-600 fill-none"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Based on {reviewStats.totalReviews}{" "}
                  {reviewStats.totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>

              {/* Rating Distribution */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Rating Distribution
                </h4>
                <div className="space-y-3">
                  {ratingDistribution.slice().reverse().map((count, index) => {
                    const stars = 5 - index;
                    const maxCount = Math.max(...ratingDistribution, 1); // Avoid division by zero
                    const widthPercentage = (count / maxCount) * 100;
                    return (
                      <div key={stars} className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 w-10">
                          {stars} {stars === 1 ? "Star" : "Stars"}
                        </span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <motion.div
                            className="bg-blue-600 rounded-full h-3"
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPercentage}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Button */}
              {/* <Button
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!user}
              >
                Write a Review
              </Button> */}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
        courseTitle={courseTitle}
      />
    </div>
  );
};