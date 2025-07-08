import React, { useEffect, useState } from "react";
import { Star, Users } from "lucide-react";
import axios from "axios";

const RelatedCourses = ({ courseId }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/recommendations/courses/${courseId}/related`
        );
        setCourses(response.data.related || []);
      } catch (error) {
        console.error("Failed to fetch related courses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchRelatedCourses();
  }, [courseId]);

  if (loading) {
    return (
      <div className="max-w-3xl p-4 bg-white rounded shadow-sm">
        <p className="text-gray-500">Loading related courses...</p>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="max-w-3xl p-4 bg-white rounded shadow-sm">
        <p className="text-gray-500">No related courses found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl p-4 bg-white rounded shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Related Courses</h2>
      {courses.map((course) => (
        <div
          key={course._id}
          className="flex items-start gap-4 border-b pb-4 last:border-none"
        >
          <img
            src={course.thumbnail.url || "/default-thumbnail.jpg"}
            alt={course.title}
            className="w-16 h-16 rounded object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-gray-800 leading-snug hover:underline cursor-pointer">
              {course.title}
            </h4>
            <p className="text-xs text-gray-500 mt-1">{course.description}</p>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1 text-yellow-500 font-medium">
                {course.rating || 0} <Star size={14} fill="currentColor" />
              </span>
              <span className="mx-2">·</span>
              <span className="flex items-center gap-1">
                <Users size={14} />
                {course.students?.toLocaleString() || 0}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {course.hours && (
                <span className="font-medium text-green-600">
                  {course.hours} total hours
                </span>
              )}
              {course.updated && <span className="ml-2">· Updated {course.updated}</span>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">
              {course.price ? `${course.price} ETB` : "Free"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RelatedCourses;
