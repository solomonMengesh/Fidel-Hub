import { useState } from "react";
import { toast } from "sonner";
import { Clock, Search, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StudentManagement = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");

  const students = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      course: "Introduction to React",
      progress: 65,
      lastActive: "2 days ago",
    },
    {
      id: 2,
      name: "Emma Wilson",
      email: "emma@example.com",
      course: "Advanced JavaScript",
      progress: 78,
      lastActive: "1 day ago",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      course: "Introduction to React",
      progress: 42,
      lastActive: "1 week ago",
    },
  ];

  const courses = [
    { id: 1, title: "Introduction to React" },
    { id: 2, title: "Advanced JavaScript" },
    { id: 3, title: "UX Design Fundamentals" },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse =
      filterCourse === "all" || student.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    toast.info(`Viewing details for ${student.name}`);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
      {selectedStudent ? (
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={handleBackToList}
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to student list
          </Button>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-700 mb-4 flex items-center justify-center text-3xl font-semibold text-slate-600 dark:text-slate-300">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-semibold">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedStudent.email}
                    </p>
                    <div className="mt-4 text-sm text-center">
                      <p>
                        Enrolled in:{" "}
                        <span className="font-medium">
                          {selectedStudent.course}
                        </span>
                      </p>
                      <p className="flex items-center justify-center mt-2">
                        <Clock
                          size={14}
                          className="mr-1 text-muted-foreground"
                        />
                        Last active {selectedStudent.lastActive}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-fidel-500 rounded-full"
                          style={{ width: `${selectedStudent.progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {selectedStudent.progress}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                className="pl-9 w-full md:w-64"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterCourse} onValueChange={setFilterCourse}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.title}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Course</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Last Active
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
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
                        onClick={() => handleViewStudent(student)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentManagement;
