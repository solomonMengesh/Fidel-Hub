import { useState, useEffect } from "react";
import { Search, Filter, ArrowUp, ArrowDown } from "lucide-react";
import CourseCard from "@/components/home/CourseCard";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

 const allCourses = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    instructor: "Dr. Selamawit Gebre",
    level: "Beginner",
    rating: 4.8,
    students: 12436,
    duration: "10 hours",
    lessons: 24,
    price: "2,799 ETB",  
    category: "Computer Science",
    featured: true,
  },
  {
    id: "2",
    title: "Advanced Data Structures and Algorithms",
    instructor: "Prof. Yohannes Tesfaye",
    level: "Advanced",
    rating: 4.9,
    students: 8752,
    duration: "15 hours",
    lessons: 32,
    price: "3,359 ETB",  
    category: "Programming",
  },
  {
    id: "3",
    title: "Marketing in the Digital Age",
    instructor: "Eyerusalem Kebede",
    level: "Intermediate",
    rating: 4.6,
    students: 10328,
    duration: "8 hours",
    lessons: 18,
    price: "2,239 ETB",  
    category: "Business",
  },
  {
    id: "4",
    title: "Introduction to Psychology",
    instructor: "Dr. Abebe Mekonnen",
    level: "Beginner",
    rating: 4.7,
    students: 15642,
    duration: "12 hours",
    lessons: 28,
    price: "2,519 ETB",  
    category: "Psychology",
    featured: true,
  },
  {
    id: "5",
    title: "Financial Accounting Principles",
    instructor: "Tigist Hailu",
    level: "Beginner",
    rating: 4.5,
    students: 7895,
    duration: "9 hours",
    lessons: 22,
    price: "2,799 ETB", 
    category: "Finance",
  },
  {
    id: "6",
    title: "Graphic Design Fundamentals",
    instructor: "Mekdes Assefa",
    level: "Beginner",
    rating: 4.8,
    students: 9452,
    duration: "11 hours",
    lessons: 26,
    price: "3,079 ETB",  
    category: "Design",
  },
  {
    id: "7",
    title: "Web Development with React",
    instructor: "Dawit Alemayehu",
    level: "Intermediate",
    rating: 4.9,
    students: 11782,
    duration: "14 hours",
    lessons: 30,
    price: "3,359 ETB", 
    category: "Programming",
    featured: true,
  },
  {
    id: "8",
    title: "Amharic for Beginners",
    instructor: "Marta Girma",
    level: "Beginner",
    rating: 4.7,
    students: 6423,
    duration: "8 hours",
    lessons: 20,
    price: "1,959 ETB", 
    category: "Languages",
  },
  {
    id: "9",
    title: "Introduction to Artificial Intelligence",
    instructor: "Dr. Samuel Lemma",
    level: "Intermediate",
    rating: 4.9,
    students: 8245,
    duration: "16 hours",
    lessons: 35,
    price: "3,639 ETB", 
    category: "Computer Science",
  },
  {
    id: "10",
    title: "Photography Masterclass",
    instructor: "Hana Solomon",
    level: "Beginner",
    rating: 4.8,
    students: 7352,
    duration: "12 hours",
    lessons: 24,
    price: "2,799 ETB",  
    category: "Design",
  },
  {
    id: "11",
    title: "Blockchain and Cryptocurrency",
    instructor: "Kaleb Teka",
    level: "Intermediate",
    rating: 4.7,
    students: 5823,
    duration: "10 hours",
    lessons: 22,
    price: "3,079 ETB",  
    category: "Computer Science",
  },
  {
    id: "12",
    title: "Public Speaking and Presentation Skills",
    instructor: "Sara Tadesse",
    level: "Beginner",
    rating: 4.6,
    students: 9136,
    duration: "8 hours",
    lessons: 18,
    price: "2,239 ETB",  
    category: "Personal Development",
  },
];

const categories = [
  "All",
  "Computer Science",
  "Programming",
  "Business",
  "Psychology",
  "Finance",
  "Design",
  "Languages",
  "Personal Development",
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("popular");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter and sort courses
  const filteredCourses = allCourses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;
      const matchesLevel =
        selectedLevel === "All Levels" || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "popular":
          comparison = a.students - b.students;
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "price":
          comparison =
            parseFloat(a.price?.replace("$", "") || "0") -
            parseFloat(b.price?.replace("$", "") || "0");
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Hero Section */}
          <div className="mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white"
            >
              Explore Our Courses
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground max-w-2xl"
            >
              Browse our extensive catalog of courses across various disciplines.
              Find the perfect course to advance your knowledge and skills.
            </motion.p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses or instructors..."
                className="glass-input pl-10 pr-4 py-2 w-full"
              />
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium"
                >
                  <Filter size={16} />
                  Filters
                </button>

                {selectedCategory !== "All" && (
                  <div className="px-3 py-1 bg-fidel-50 dark:bg-fidel-900/30 text-fidel-600 dark:text-fidel-400 rounded-full text-sm flex items-center gap-1">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="ml-1 hover:text-fidel-800 dark:hover:text-fidel-300"
                    >
                      &times;
                    </button>
                  </div>
                )}

                {selectedLevel !== "All Levels" && (
                  <div className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm flex items-center gap-1">
                    {selectedLevel}
                    <button
                      onClick={() => setSelectedLevel("All Levels")}
                      className="ml-1 hover:text-purple-800 dark:hover:text-purple-300"
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="glass-input px-3 py-1 text-sm rounded-lg"
                >
                  <option value="popular">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="title">Title</option>
                  <option value="price">Price</option>
                </select>
                <button
                  onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                  className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Toggle sort direction"
                >
                  {sortDirection === "asc" ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                </button>
              </div>
            </div>

            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-4 mt-2 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <h3 className="font-medium mb-3 text-slate-900 dark:text-white">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="mr-2 accent-fidel-500"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 text-slate-900 dark:text-white">Level</h3>
                  <div className="space-y-2">
                    {levels.map((level) => (
                      <label key={level} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="level"
                          checked={selectedLevel === level}
                          onChange={() => setSelectedLevel(level)}
                          className="mr-2 accent-fidel-500"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Search size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">No courses found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredCourses.length > 0 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  &laquo;
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-lg",
                      page === 1
                        ? "bg-fidel-500 text-white"
                        : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  &raquo;
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>


      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Courses;