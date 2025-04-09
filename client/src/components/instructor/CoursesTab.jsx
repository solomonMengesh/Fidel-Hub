import { Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CourseBuilder from "./CourseBuilder";
import { toast } from "sonner";

const CoursesTab = ({ mainTab, setMainTab }) => {
  const courses = [
    {
      id: 1,
      title: "Introduction to React",
      students: 125,
      progress: 75,
      lastUpdated: "2 days ago",
      status: "Published",
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      students: 98,
      progress: 60,
      lastUpdated: "1 week ago",
      status: "Published",
    },
    {
      id: 3,
      title: "UX Design Principles",
      students: 67,
      progress: 90,
      lastUpdated: "3 days ago",
      status: "Published",
    },
  ];

  return (
    <>
      {mainTab === "list" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <h3 className="font-semibold">All Your Courses</h3>
            <Button
              onClick={() => setMainTab("create")}
              className="w-full md:w-auto"
            >
              <Plus size={16} className="mr-2" />
              Create New Course
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
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead>Actions</TableHead>
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
                    <TableCell className="hidden sm:table-cell">
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">
                        Published
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {mainTab === "create" && (
        <CourseBuilder
          onSave={() => {
            toast.success("Course saved successfully");
            setMainTab("list");
          }}
        />
      )}
    </>
  );
};

export default CoursesTab;
