// components/student-dashboard/OverviewTab.jsx
import { motion } from "framer-motion";

export const OverviewTab = () => {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-fidel-100 dark:bg-fidel-900/20 rounded-full opacity-70 dark:opacity-30 -z-10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Welcome back, John!
          </h2>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your courses today.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 shadow-sm">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                2
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 shadow-sm">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                4
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 shadow-sm">
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                2
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Introduction to Machine Learning",
              progress: 65,
              lastAccessed: "Yesterday",
              color: "bg-blue-500",
            },
            {
              title: "Advanced Data Structures",
              progress: 42,
              lastAccessed: "2 days ago",
              color: "bg-purple-500",
            },
          ].map((course, i) => (
            <motion.div
              key={i}
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
                    Last accessed: {course.lastAccessed}
                  </p>
                  <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${course.color} rounded-full`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {course.progress}% complete
                    </span>
                    <span className="font-medium text-fidel-500">Continue</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
