import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export const CoursesTab = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  // Fetch enrolled courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?._id) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`/api/enrollments/${user._id}/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  // Fetch progress for all courses
  useEffect(() => {
    const fetchAllProgress = async () => {
      if (!user?._id || courses.length === 0) return;

      setIsLoading(true);
      const updatedProgressMap = {};

      try {
        await Promise.all(
          courses.map(async (course) => {
            try {
              const res = await fetch(`/api/progress/${user._id}/${course._id}`);
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              const data = await res.json();
              updatedProgressMap[course._id] = data;
            } catch (err) {
              console.error(`Progress fetch failed for course ${course._id}:`, err);
              updatedProgressMap[course._id] = {
                progressPercentage: 0,
                completedLessons: [],
                error: err instanceof Error ? err.message : "Failed to fetch progress",
              };
            }
          })
        );
      } catch (error) {
        console.error("Failed to fetch progress for courses:", error);
      } finally {
        setProgressMap(updatedProgressMap);
        setIsLoading(false);
      }
    };

    fetchAllProgress();
  }, [user, courses]);

  const filteredCourses = courses.filter((course) => {
    const progress = progressMap[course._id];
    if (!progress) return false;

    if (activeFilter === "completed") {
      return progress.progressPercentage === 100;
    } else if (activeFilter === "in-progress") {
      return progress.progressPercentage < 100;
    }
    return true;
  });

  // Calculate summary statistics
  const totalCourses = filteredCourses.length;
  const completedCourses = filteredCourses.filter(
    (c) => progressMap[c._id]?.progressPercentage === 100
  ).length;
  const inProgressCourses = filteredCourses.filter(
    (c) => progressMap[c._id]?.progressPercentage < 100
  ).length;

  const getLastAccessedDate = (lastAccessed) => {
    if (!lastAccessed) return "Never";
    try {
      return new Date(lastAccessed).toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };
  const handleRedirect = (course, isCompleted) => {
    if (isCompleted) {
      navigate(`/get-certified/${course._id}/${user._id}`);
    } else {
      navigate(`/courses/${course._id}`);
    }
  };
  
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            My Learning
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Continue your learning journey
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {["all", "in-progress", "completed"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                activeFilter === filter
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {filter === "all" && "All Courses"}
              {filter === "in-progress" && "In Progress"}
              {filter === "completed" && "Completed"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Summary Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sticky top-4 h-fit">
          <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">
            Your Learning Summary
          </h3>

          <div className="space-y-6">
            {totalCourses > 0 ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1 text-slate-600 dark:text-slate-300">
                    <span>Total Courses</span>
                    <span>{totalCourses}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-300 dark:bg-slate-600 rounded-full"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1 text-slate-600 dark:text-slate-300">
                    <span>Completed Courses</span>
                    <span>{completedCourses}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
                      style={{
                        width: `${
                          totalCourses > 0
                            ? (completedCourses / totalCourses) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1 text-slate-600 dark:text-slate-300">
                    <span>In Progress</span>
                    <span>{inProgressCourses}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 dark:bg-amber-400 rounded-full"
                      style={{
                        width: `${
                          totalCourses > 0
                            ? (inProgressCourses / totalCourses) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No courses to display
              </p>
            )}

            <Button className="w-full" variant="outline">
              View All Achievements
            </Button>
          </div>
        </div>

        {/* Courses List */}
        <div className="lg:col-span-2">
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Enrolled Courses
              </h3>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                <h4 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                  No courses found
                </h4>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {activeFilter === "all"
                    ? "You haven't enrolled in any courses yet."
                    : activeFilter === "in-progress"
                    ? "You don't have any courses in progress."
                    : "You haven't completed any courses yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course, i) => {
                  const progress = progressMap[course._id];
                  const isCompleted = progress?.progressPercentage === 100;
                  const percentage = progress?.progressPercentage || 0;
                  const total = progress?.totalLessons || 0;

                  const totalLessons =
                    course.modules?.reduce(
                      (acc, module) => acc + (module.lessons?.length || 0),
                      0
                    ) || 0;
                  const completedLessons =
                    progress?.completedLessons?.length || 0;

                  return (
                    <motion.div
                      key={course._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="h-40 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                        <img
                          src={
                            course.thumbnail?.url || "/placeholder-course.jpg"
                          }
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "/placeholder-course.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                      </div>

                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                            {course.title}
                          </h4>
                          
                          {course.level && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 ml-2">
                              {course.level}
                            </span>
                          )}
                          
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1 text-slate-600 dark:text-slate-300">
                            <span>{Math.round(percentage)}% complete</span>
                            <span>
                              {completedLessons}/{total} lessons
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-300",
                                isCompleted
                                  ? "bg-emerald-500 dark:bg-emerald-400"
                                  : "bg-blue-500 dark:bg-blue-400"
                              )}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>

                        <Button onClick={() => handleRedirect(course, isCompleted)}>
  {isCompleted ? "Get Certificate" : "Continue Learning"}
</Button>


                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                          <BookOpen className="h-4 w-4 mr-1.5" />
                          <span>
                            Last accessed:{" "}
                            {getLastAccessedDate(progress?.lastAccessed)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};