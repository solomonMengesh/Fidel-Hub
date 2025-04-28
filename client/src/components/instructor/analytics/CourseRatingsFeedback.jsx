import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Star } from "lucide-react";

const CourseRatingsFeedback = () => {
  const [ratingData, setRatingData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const timeAgo = (isoDate) => {
    const seconds = Math.floor((Date.now() - new Date(isoDate)) / 1000);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];
    for (const { label, seconds: s } of intervals) {
      const count = Math.floor(seconds / s);
      if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
    }
    return "just now";
  };

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const base = import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:5000";
        const { data } = await axios.get(`${base}/api/review/courses/ratings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const validated = data.map((c) => ({
          ...c,
          avgRating: parseFloat(c.avgRating) || 0,
          mostRecentRating: c.mostRecentRating ?? 0
        }));
        setRatingData(validated);

        const fb = validated
          .filter((c) => c.mostRecentComment && c.mostRecentComment !== "No reviews yet")
          .map((c) => ({
            id: `${c.courseId}-${c.mostRecentStudentName}`,
            student: c.mostRecentStudentName,
            course: c.courseTitle,
            rating: c.mostRecentRating,
            comment: c.mostRecentComment,
            date: c.mostRecentCommentDate ? timeAgo(c.mostRecentCommentDate) : "just now",
          }));
        setFeedbackData(fb);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderStars = (rating) => {
    const safe = Math.round((parseFloat(rating) || 0) * 2) / 2;
    return (
      <div className="flex" role="img" aria-label={`Rating: ${safe} out of 5 stars`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const half = i + 0.5 === safe;
          const full = i < safe;
          const cls = full
            ? "text-amber-500 fill-amber-500"
            : half
            ? "text-amber-500 fill-amber-500 [clip-path:polygon(0_0,50%_0,50%_100%,0_100%)]"
            : "text-gray-300";
          return <Star key={i} size={16} className={cls} />;
        })}
      </div>
    );
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading…</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>;

  return (
    <Card className="w-full overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
        <div>
          <CardTitle>Course Ratings & Feedback</CardTitle>
          <CardDescription>Average student ratings and recent feedback</CardDescription>
        </div>
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-fidel-50 dark:bg-slate-800">
          <Star className="h-5 w-5 text-fidel-600 dark:text-fidel-400" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6">
          {ratingData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {ratingData.map((c) => (
                <div key={c.courseId} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{c.courseTitle}</div>
                    <div className="text-xs text-gray-500">{c.totalReviews} reviews</div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">{c.avgRating.toFixed(1)}</span>
                    {renderStars(c.avgRating)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">No course ratings available.</div>
          )}

          <h4 className="font-medium text-sm mb-3 mt-6">Latest Feedback</h4>
          {feedbackData.length > 0 ? (
            <div className="space-y-3">
              {feedbackData.map((f) => (
                <div key={f.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm">{f.student}</div>
                    <div className="text-sm text-gray-500 italic">{f.date}</div>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="text-xs text-muted-foreground mr-2">{f.course}</span>
                    {renderStars(f.rating)}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{f.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">No feedback available.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseRatingsFeedback;
