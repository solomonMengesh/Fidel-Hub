import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StudentTable = ({ students, onViewStudent }) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Course</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="hidden sm:table-cell">Last Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {student.email}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {student.course}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-fidel-500 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {student.progress}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {student.lastActive}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewStudent(student)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentTable;