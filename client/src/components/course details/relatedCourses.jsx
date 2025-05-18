import React from "react";
import { Star, Users, Heart } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "ChatGPT & AI Tools Mastery: Grok, DeepSeek, Monetize (2025)",
    rating: 4.8,
    students: 2336,
    hours: 7,
    updated: "5/2025",
    price: "$9.99",
    originalPrice: "$44.99",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
  },
  {
    id: 2,
    title: "ChatGPT in Marketing: Introduction to ChatGPT & AI Marketing",
    rating: 4.7,
    students: 3639,
    hours: 4.5,
    updated: "9/2024",
    price: "$9.99",
    originalPrice: "$27.99",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s",
  },
  {
    id: 3,
    title: "Master Marketing Automation with Microsoft Copilot",
    rating: 4.2,
    students: 8661,
    hours: 1.5,
    updated: "4/2025",
    price: "$9.99",
    originalPrice: "$34.99",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s",
  },
  {
    id: 4,
    title: "Unlocking Grok: AI for Business and Marketing",
    rating: 4.4,
    students: 8771,
    hours: 2,
    updated: "4/2025",
    price: "$9.99",
    originalPrice: "$34.99",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s",
  },
  {
    id: 5,
    title: "ChatGPT Complete Guide: Learn Midjourney, Gemini, Chat GPT 4",
    rating: 4.6,
    students: 8560,
    hours: null,
    updated: null,
    price: "$9.99",
    originalPrice: "$34.99",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s",
  },
];

const RelatedCourses = () => {
  return (
    <div className="space-y-4 max-w-3xl  p-4 bg-white rounded shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Related Courses</h2>
      {courses.map((course) => (
        <div
          key={course.id}
          className="flex items-start gap-4 border-b pb-4 last:border-none"
        >
          <img
            src={course.image}
            alt={course.title}
            className="w-16 h-16 rounded object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-gray-800 leading-snug hover:underline cursor-pointer">
              {course.title}
            </h4>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1 text-yellow-500 font-medium">
                {course.rating} <Star size={14} fill="currentColor" />
              </span>
              <span className="mx-2">·</span>
              <span className="flex items-center gap-1">
                <Users size={14} />
                {course.students.toLocaleString()}
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
            <div className="text-sm font-semibold">{course.price}</div>
            {/* <div className="text-xs line-through text-gray-400">{course.originalPrice}</div> */}
            {/* <Heart className="text-purple-500 mt-2 hover:scale-110 transition" size={18} /> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RelatedCourses;
