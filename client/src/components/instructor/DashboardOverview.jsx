 import { motion } from "framer-motion";
import { Users, BookOpen, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight } from "lucide-react";

const stats = [
  { title: "Total Students", value: "310", icon: Users, change: "+12" },
  { title: "Active Courses", value: "8", icon: BookOpen, change: "+1" },
  {
    title: "Completion Rate",
    value: "82%",
    icon: CheckCircle,
    change: "+5%",
  },
  { title: "Avg. Rating", value: "4.8", icon: Star, change: "+0.2" },
];

const courses = [
  {
    id: 1,
    title: "ddIntroduction to React",
    students: 125,
    progress: 75,
    lastUpdated: "2 days ago",
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    students: 98,
    progress: 60,
    lastUpdated: "1 week ago",
  },
  {
    id: 3,
    title: "UX Design Principles",
    students: 67,
    progress: 90,
    lastUpdated: "3 days ago",
  },
];

const DashboardOverview = ({ setActiveTab }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-xs text-green-500 mt-1">
                  {stat.change} this month
                </p>
              </div>
              <div className="p-3 rounded-lg bg-fidel-50 dark:bg-slate-800">
                <stat.icon
                  size={20}
                  className="text-fidel-500 dark:text-fidel-400"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Your Courses</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("courses")}
            >
              View All Courses
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Students
                  </TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Last Updated
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      {course.title}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {course.students}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-fidel-500 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {course.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {course.lastUpdated}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="p-0">
                        <ChevronRight size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;
