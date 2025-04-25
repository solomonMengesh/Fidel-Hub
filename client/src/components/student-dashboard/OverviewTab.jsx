import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export const OverviewTab = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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

  // Calculate course statistics
  const completedCourses = courses.filter(
    (c) => progressMap[c._id]?.progressPercentage === 100
  ).length;
  const inProgressCourses = courses.filter(
    (c) =>
      progressMap[c._id]?.progressPercentage > 0 &&
      progressMap[c._id]?.progressPercentage < 100
  ).length;
  const upcomingCourses = courses.filter(
    (c) => progressMap[c._id]?.progressPercentage === 0
  ).length;

  // Filter in-progress courses for "Continue Learning" (limit to 2)
  const continueLearningCourses = courses
    .filter(
      (c) =>
        progressMap[c._id]?.progressPercentage > 0 &&
        progressMap[c._id]?.progressPercentage < 100
    )
    .slice(0, 2);

  const getLastAccessedDate = (lastAccessed) => {
    if (!lastAccessed) return "Never";
    try {
      return new Date(lastAccessed).toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-fidel-100 dark:bg-fidel-900/20 rounded-full opacity-70 dark:opacity-30 -z-10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Welcome back, {user?.name || "Student"}!
          </h2>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your courses today.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 shadow-sm">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {completedCourses}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 shadow-sm">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {inProgressCourses}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 shadow-sm">
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {upcomingCourses}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue learning */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
          Continue Learning
        </h3>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : continueLearningCourses.length === 0 ? (
          <div className="glass-card p-4 text-center">
            <p className="text-sm text-muted-foreground">
              No in-progress courses to display.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {continueLearningCourses.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="glass-card p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {course.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Last accessed:{" "}
                      {getLastAccessedDate(progressMap[course._id]?.lastAccessed)}
                    </p>
                    <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          progressMap[course._id]?.progressPercentage > 50
                            ? "bg-blue-500"
                            : "bg-purple-500"
                        )}
                        style={{
                          width: `${progressMap[course._id]?.progressPercentage || 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {progressMap[course._id]?.progressPercentage || 0}% complete
                      </span>
                      <span className="font-medium text-fidel-500">Continue</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};