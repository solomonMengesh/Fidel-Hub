import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Star } from "lucide-react";

const CourseRatingsFeedback = ({ ratingData, feedbackData }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`${
            i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
          }`}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <Card className="w-full overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
        <div>
          <CardTitle>Course Ratings & Feedback</CardTitle>
          <CardDescription>
            Average student ratings and recent feedback
          </CardDescription>
        </div>
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-fidel-50 dark:bg-slate-800">
          <Star className="h-5 w-5 text-fidel-600 dark:text-fidel-400" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {ratingData.map((course, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
              >
                <span className="text-sm font-medium">{course.course}</span>
                <div className="flex items-center">
                  <span className="font-bold mr-2">{course.rating}</span>
                  {renderStars(course.rating)}
                </div>
              </div>
            ))}
          </div>

          <h4 className="font-medium text-sm mb-3 mt-6">Latest Feedback</h4>
          <div className="space-y-3">
            {feedbackData.slice(0, 3).map((feedback, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-sm">{feedback.student}</div>
                  <div className="text-xs text-muted-foreground">
                    {feedback.date}
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-xs text-muted-foreground mr-2">
                    {feedback.course}
                  </span>
                  {renderStars(feedback.rating)}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {feedback.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseRatingsFeedback;
