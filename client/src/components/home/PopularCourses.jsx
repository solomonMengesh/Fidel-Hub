import { useState } from "react";
import { ArrowRight } from "lucide-react";
import CourseCard from "./CourseCard";
import AnimatedButton from "../ui/AnimatedButton ";
import { motion } from "framer-motion";

// Mock course data
const courses = [
    {
      id: "1",
      title: "Introduction to Machine Learning",
      instructor: "Dr. Mulugeta Tadesse",
      level: "Beginner",
      rating: 4.8,
      students: 12436,
      duration: "10 hours",
      lessons: 24,
      price: "ETB 2700",
      category: "Computer Science",
      featured: true
    },
    {
      id: "2",
      title: "Advanced Data Structures and Algorithms",
      instructor: "Prof. Abiy Tewodros",
      level: "Advanced",
      rating: 4.9,
      students: 8752,
      duration: "15 hours",
      lessons: 32,
      price: "ETB 3100",
      category: "Programming",
    },
    {
      id: "3",
      title: "Marketing in the Digital Age",
      instructor: "Lidet Amare",
      level: "Intermediate",
      rating: 4.6,
      students: 10328,
      duration: "8 hours",
      lessons: 18,
      price: "ETB 2200",
      category: "Business",
    },
    {
      id: "4",
      title: "Introduction to Psychology",
      instructor: "Dr. Hanna Bekele",
      level: "Beginner",
      rating: 4.7,
      students: 15642,
      duration: "12 hours",
      lessons: 28,
      price: "ETB 2400",
      category: "Psychology",
      featured: true
    },
    {
      id: "5",
      title: "Financial Accounting Principles",
      instructor: "Tadesse Gebrehiwot",
      level: "Beginner",
      rating: 4.5,
      students: 7895,
      duration: "9 hours",
      lessons: 22,
      price: "ETB 2700",
      category: "Finance",
    },
    {
      id: "6",
      title: "Graphic Design Fundamentals",
      instructor: "Marta Solomon",
      level: "Beginner",
      rating: 4.8,
      students: 9452,
      duration: "11 hours",
      lessons: 26,
      price: "ETB 2950",
      category: "Design",
    },
    {
      id: "7",
      title: "Web Development with React",
      instructor: "Binyam Tesfaye",
      level: "Intermediate",
      rating: 4.9,
      students: 11782,
      duration: "14 hours",
      lessons: 30,
      price: "ETB 3100",
      category: "Programming",
      featured: true
    },
    {
      id: "8",
      title: "English for Beginners",
      instructor: "Belete Tadesse",
      level: "Beginner",
      rating: 4.7,
      students: 6423,
      duration: "8 hours",
      lessons: 20,
      price: "ETB 1900",
      category: "Languages",
    }
  ];
  

const categories = [
  "All",
  "Computer Science",
  "Programming",
  "Business",
  "Psychology",
  "Finance",
  "Design",
  "Languages"
];

const PopularCourses = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCourses = activeCategory === "All" 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            Explore Popular Courses
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular courses across various disciplines, designed and taught by expert instructors from around the world.
          </p>
        </div>

        <div className="overflow-x-auto mb-10 pb-2">
          <div className="flex space-x-2 min-w-max justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-fidel-500 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <AnimatedButton to="/courses" variant="outline" size="lg">
            View All Courses
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;
