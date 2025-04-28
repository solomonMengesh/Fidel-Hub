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

const CourseTable = ({ courses = [], onCreate, onViewAll, showStatus, showActions }) => {
  if (!Array.isArray(courses)) {
    console.error("CourseTable expected an array for courses but got:", courses);
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead className="hidden sm:table-cell">Students</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="hidden md:table-cell">Last Updated</TableHead>
            {showStatus && <TableHead className="hidden sm:table-cell">Status</TableHead>}
            {showActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <TableRow key={course._id || course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {course.students || 0}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-fidel-500 rounded-full"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {course.progress || 0}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {course.updatedAt || "N/A"}
                </TableCell>
                {showStatus && (
                  <TableCell className="hidden sm:table-cell">
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">
                      {course.status || "Draft"}
                    </span>
                  </TableCell>
                )}
                {showActions && (
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No courses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;

