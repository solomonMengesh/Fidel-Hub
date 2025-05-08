import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import StudentDetails from "../instructor-dashboard/StudentDetails";
import { format } from 'date-fns';

const StudentManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { user } = useAuth();

  // Fetch student progress data from API
  useEffect(() => {
    const fetchStudentProgress = async () => {
      if (!user?._id) {
        toast.error("Please log in to view student data");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/courses/${user._id}/courses/progress`
        );
        const data = await response.json();

        console.log("API Response:", data);

        if (Array.isArray(data.courses)) {
          const students = [];

          data.courses.forEach((course) => {
            if (Array.isArray(course.enrolledStudents) && course.enrolledStudents.length > 0) {
              course.enrolledStudents.forEach((student) => {
                students.push({
                  id: student.studentId,
                  name: student.name,
                  email: student.email,
                  course: course.title,
                  progress: student.progressPercentage || 0,
                  enrolledAt: student.enrolledAt || "Unknown",
                  lastActive: student.lastActive || "Not available", // Fallback
                  completedLessons: student.completedLessons || [], // For activity log simulation
                  activityLog: student.activityLog || [], // Empty unless provided by API
                  progressHistory: student.progressHistory || [], // Empty unless provided by API
                });
              });
            }
          });

          if (students.length === 0) {
            toast.info("No students are enrolled in any courses yet.");
          }

          setStudents(students);
        } else {
          console.error("Unexpected response structure:", data);
          setStudents([]);
          toast.error("Unexpected data format from server.");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Error fetching student progress data.");
        setStudents([]);
      }
    };

    fetchStudentProgress();
  }, [user]);

  const courses = [
    { id: 1, title: "Advanced React Development" },
    { id: 2, title: "Mastering GPT: Build AI-Powered Applications with OpenAI" },
    { id: 3, title: "Other Course" }, // Adjust based on actual courses
  ];

  const filteredStudents = (students || []).filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = filterCourse === "all" || student.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const studentsPerPage = 4;
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    toast.info(`Viewing details for ${student.name}`);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
      <CardHeader className="border-b bg-gradient-to-r from-fidel-500 to-fidel-600 text-white">
        <CardTitle className="text-2xl">Student Management</CardTitle>
        <CardDescription className="text-slate-100">
          Monitor and manage your students' progress
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {selectedStudent ? (
          <StudentDetails
            selectedStudent={selectedStudent}
            onBack={handleBackToList}
            user={user}
          />
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  className="pl-9 w-full md:w-64 focus:ring-fidel-500"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Select value={filterCourse} onValueChange={setFilterCourse}>
                  <SelectTrigger className="w-[180px] focus:ring-fidel-500">
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

                <Button variant="outline" size="icon" className="hover:bg-fidel-50">
                  <Filter size={16} />
                </Button>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className="hover:bg-fidel-50 transition-colors"
                    >
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-fidel-500 to-fidel-600 rounded-full"
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {student.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
  {student.enrolledAt && !isNaN(Date.parse(student.enrolledAt))
    ? format(new Date(student.enrolledAt), 'dd MMM yyyy')
    : 'Not available'}
</TableCell>

                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-fidel-500 hover:text-white transition-colors"
                          onClick={() => handleViewStudent(student)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="hover:bg-fidel-50"
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="hover:bg-fidel-50"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentManagement;