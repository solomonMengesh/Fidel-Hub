import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight, Plus } from "lucide-react";

const CourseTable = ({ courses = [], onViewAll, onCreate, showStatus = false, showActions = false }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Your Courses</h3>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All Courses
          </Button>
        )}
        {onCreate && (
          <Button onClick={onCreate} className="w-full md:w-auto">
            <Plus size={16} className="mr-2" />
            Create New Course
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead className="hidden sm:table-cell">Students</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="hidden md:table-cell">Last Updated</TableHead>
              {showStatus && (
                <TableHead className="hidden sm:table-cell">Status</TableHead>
              )}
              {(showActions || !onViewAll) && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(courses) && courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
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
  {new Date(course.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
     
  })}
</TableCell>
                  {showStatus && (
                    <TableCell className="hidden sm:table-cell">
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">
                        Published
                      </span>
                    </TableCell>
                  )}
                  {(showActions || !onViewAll) && (
                    <TableCell>
                      {showActions ? (
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="sm" className="p-0">
                          <ChevronRight size={16} />
                        </Button>
                      )}
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
    </div>
  );
};

export default CourseTable;
