import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const ReviewModal = ({ isOpen, onClose, onSubmit, courseTitle }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({ rating, comment });
      setRating(0);
      setComment("");
      toast.success("Review submitted successfully!");
      onClose();
    } catch (err) {
      if (err.message.includes("401")) {
        setError("Please log in to submit a review");
      } else if (err.message.includes("400")) {
        setError("Invalid review data");
      } else {
        setError(err.message || "Failed to submit review");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
        setError(null);
        setRating(0);
        setComment("");
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md border border-gray-200/50 dark:border-slate-700/50"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
                Review <span className="text-fidel-500">{courseTitle}</span>
              </h3>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3 bg-red-100/80 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800/50"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Your Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        type="button"
                        key={star}
                        onClick={() => {
                          setRating(star);
                          setError(null);
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="relative group focus:outline-none"
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`h-7 w-7 transition-all duration-200 ${
                            star <= rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-400 dark:text-gray-400"
                          } group-hover:scale-110 group-hover:text-yellow-300 group-hover:fill-yellow-300`}
                        />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {star} star{star > 1 ? "s" : ""}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="review-comment"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Your Review
                  </label>
                  <textarea
                    id="review-comment"
                    className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg bg-white/50 dark:bg-slate-700/50 focus:ring-2 focus:ring-fidel-500 focus:border-fidel-500 transition-all duration-200 resize-none"
                    rows={5}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this course..."
                    aria-describedby="comment-help"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p
                      id="comment-help"
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      Detailed feedback helps improve the course
                    </p>
                    <p
                      className={`text-xs ${
                        comment.length > 450
                          ? "text-red-500"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {comment.length}/500
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      onClose();
                      setError(null);
                      setRating(0);
                      setComment("");
                    }}
                    disabled={isSubmitting}
                    className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={rating === 0 || isSubmitting}
                    className="bg-gradient-to-r from-fidel-500 to-fidel-600 hover:from-fidel-600 hover:to-fidel-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};