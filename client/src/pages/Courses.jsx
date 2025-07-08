import { useState, useEffect } from "react";
import { Search, Filter, ArrowUp, ArrowDown } from "lucide-react";
import CourseCard from "@/components/home/CourseCard";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import axios from "axios";

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
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("popular");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch active courses only
      const response = await fetch("http://localhost:5000/api/courses/active");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const courseData = await response.json();

      // Fetch review stats and student count for each course
      const coursesWithData = await Promise.all(
        courseData.map(async (course) => {
          const courseId = course.id || course._id;
          let avgRating = "N/A";
          let totalReviews = 0;
          let studentCount = 0;

          // Fetch review stats
          try {
            const reviewResponse = await axios.get(
              `http://localhost:5000/api/review/${courseId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
              }
            );
            avgRating = reviewResponse.data.reviewStats?.avgRating || "N/A";
            totalReviews = reviewResponse.data.reviewStats?.totalReviews || 0;
          } catch (error) {
            console.error(`Failed to fetch review stats for course ${courseId}:`, error);
          }

          // Fetch student count
          try {
            const studentResponse = await axios.get(
              `http://localhost:5000/api/courses/${courseId}/student-count`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
              }
            );
            studentCount = studentResponse.data.studentCount || 0;
          } catch (error) {
            console.error(`Failed to fetch student count for course ${courseId}:`, error);
          }

          return {
            ...course,
            avgRating,
            totalReviews,
            students: studentCount,
          };
        })
      );

      setCourses(coursesWithData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort courses
  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof course.instructor === 'object'
          ? course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
          : course.instructor.toLowerCase().includes(searchQuery.toLowerCase()));
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
          comparison = (a.students || 0) - (b.students || 0);
          break;
        case "rating":
          const ratingA = a.avgRating === "N/A" ? 0 : parseFloat(a.avgRating);
          const ratingB = b.avgRating === "N/A" ? 0 : parseFloat(b.avgRating);
          comparison = ratingA - ratingB;
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "price":
          const priceA = typeof a.price === "number" ? a.price : parseFloat(a.price || 0);
          const priceB = typeof b.price === "number" ? b.price : parseFloat(b.price || 0);
          comparison = priceA - priceB;
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fidel-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-500">Error loading courses</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={fetchCourses}
            className="mt-4 px-4 py-2 bg-fidel-500 text-white rounded-lg hover:bg-fidel-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                      ×
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
                      ×
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
                <CourseCard
                  key={course.id || course._id}
                  id={course.id || course._id}
                  title={course.title}
                  instructor={course.instructor}
                  category={course.category}
                  level={course.level}
                  price={course.price}
                  thumbnail={course.thumbnail}
                  modules={course.modules}
                  avgRating={course.avgRating}
                  totalReviews={course.totalReviews}
                  students={course.students}
                  featured={course.featured}
                />
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
                  «
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
                  »
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