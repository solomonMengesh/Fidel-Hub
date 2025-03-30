// components/student-dashboard/CoursesTab.jsx
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const CoursesTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
        My Courses
      </h2>
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            My Enrolled Courses
          </h3>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700">
              Sort by
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700">
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Introduction to Machine Learning",
              instructor: "Dr. Abebe Kebede",
              progress: 65,
              lastAccessed: "Yesterday",
              image:
                "https://static.kanopy.com/cdn-cgi/image/fit=cover,height=540,width=960/https://static-assets.kanopy.com/video-images/138c8a73-6521-4251-a22d-5e71fa74ce76.jpeg",
              badge: "In Progress",
              badgeColor:
                "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
            },
            {
              title: "Advanced Data Structures",
              instructor: "Prof. Almaz Tadesse",
              progress: 42,
              lastAccessed: "2 days ago",
              image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqjsbj930xlKHj5Tczrb8qQ29Z8fX4xxQMaW9QMtlwJ3HgxPrzLa4d8rlltYVVkFWrZtc&usqp=CAU",
              badge: "In Progress",
              badgeColor:
                "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
            },
          ].map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="h-40 bg-slate-200 dark:bg-slate-700 relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${course.badgeColor}`}
                >
                  {course.badge}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-slate-900 dark:text-white line-clamp-1">
                  {course.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Instructor: {course.instructor}
                </p>

                {course.progress > 0 && (
                  <>
                    <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          course.progress === 100
                            ? "bg-green-500"
                            : "bg-fidel-500"
                        } rounded-full`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {course.progress}% complete
                      </span>
                      <span className="font-medium text-fidel-500">
                        Last: {course.lastAccessed}
                      </span>
                    </div>
                  </>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-fidel-50 dark:bg-fidel-900/30 text-fidel-600 dark:text-fidel-400 hover:bg-fidel-100 dark:hover:bg-fidel-900/50 transition-colors duration-200">
                    {course.progress === 0
                      ? "Start Learning"
                      : "Continue Learning"}
                  </button>
                  <button className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200">
                    <BookOpen size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
