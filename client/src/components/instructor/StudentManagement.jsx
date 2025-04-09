import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BarChart 
} from "lucide-react";
import { toast } from "sonner";

const StudentManagement = () => {
  // State for pagination, search, filtering, and student details
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Mock data for students
  const students = [
    { 
      id: 1, 
      name: "Alex Johnson", 
      email: "alex@example.com", 
      course: "Introduction to React", 
      enrollmentDate: "2023-01-15",
      progress: 65,
      lastActive: "2 days ago",
      grades: [
        { assignment: "React Components Quiz", score: 85, maxScore: 100 },
        { assignment: "Hooks Exercise", score: 92, maxScore: 100 },
        { assignment: "Final Project", score: "Not submitted", maxScore: 100 }
      ]
    },
    { 
      id: 2, 
      name: "Emma Wilson", 
      email: "emma@example.com", 
      course: "Advanced JavaScript", 
      enrollmentDate: "2023-02-20",
      progress: 78,
      lastActive: "1 day ago",
      grades: [
        { assignment: "Closures Quiz", score: 90, maxScore: 100 },
        { assignment: "Promises Exercise", score: 95, maxScore: 100 },
        { assignment: "Final Project", score: 88, maxScore: 100 }
      ]
    },
    { 
      id: 3, 
      name: "Michael Brown", 
      email: "michael@example.com", 
      course: "Introduction to React", 
      enrollmentDate: "2023-01-10",
      progress: 42,
      lastActive: "1 week ago",
      grades: [
        { assignment: "React Components Quiz", score: 65, maxScore: 100 },
        { assignment: "Hooks Exercise", score: 70, maxScore: 100 },
        { assignment: "Final Project", score: "Not submitted", maxScore: 100 }
      ]
    },
    { 
      id: 4, 
      name: "Sophia Garcia", 
      email: "sophia@example.com", 
      course: "UX Design Fundamentals", 
      enrollmentDate: "2023-03-05",
      progress: 95,
      lastActive: "Today",
      grades: [
        { assignment: "User Research Report", score: 98, maxScore: 100 },
        { assignment: "Wireframing Exercise", score: 100, maxScore: 100 },
        { assignment: "Final Project", score: 95, maxScore: 100 }
      ]
    },
    { 
      id: 5, 
      name: "James Moore", 
      email: "james@example.com", 
      course: "Advanced JavaScript", 
      enrollmentDate: "2023-02-15",
      progress: 88,
      lastActive: "Yesterday",
      grades: [
        { assignment: "Closures Quiz", score: 85, maxScore: 100 },
        { assignment: "Promises Exercise", score: 90, maxScore: 100 },
        { assignment: "Final Project", score: 92, maxScore: 100 }
      ]
    },
  ];

  // Mock data for courses
  const courses = [
    { id: 1, title: "Introduction to React" },
    { id: 2, title: "Advanced JavaScript" },
    { id: 3, title: "UX Design Fundamentals" },
    { id: 4, title: "Python for Data Science" },
  ];
  
  // Filter students based on search query and course filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = filterCourse === "all" || student.course === filterCourse;
    
    return matchesSearch && matchesCourse;
  });
  
  // Constants for pagination
  const studentsPerPage = 4;
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );
  
  // Handler for viewing student details
  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    toast.info(`Viewing details for ${student.name}`);
  };
  
  // Reset student details view
  const handleBackToList = () => {
    setSelectedStudent(null);
  };
  
  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Student Management</CardTitle>
        <CardDescription>Monitor and manage your students' progress</CardDescription>
      </CardHeader>
      <CardContent>
        {selectedStudent ? (
          // Student detail view
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
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-700 mb-4 flex items-center justify-center text-3xl font-semibold text-slate-600 dark:text-slate-300">
                        {selectedStudent.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                      <p className="text-muted-foreground">{selectedStudent.email}</p>
                      <div className="mt-4 text-sm text-center">
                        <p>Enrolled in: <span className="font-medium">{selectedStudent.course}</span></p>
                        <p>Joined: <span className="font-medium">{selectedStudent.enrollmentDate}</span></p>
                        <p className="flex items-center justify-center mt-2">
                          <Clock size={14} className="mr-1 text-muted-foreground" />
                          Last active {selectedStudent.lastActive}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Completion Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-fidel-500 rounded-full" 
                          style={{ width: `${selectedStudent.progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">{selectedStudent.progress}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:w-2/3">
                <Tabs defaultValue="grades">
                  <TabsList className="mb-4">
                    <TabsTrigger value="grades">Grades</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                   
                  <TabsContent value="grades">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Assignment Grades</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Assignment</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Out of</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedStudent.grades.map((grade, index) => (
                                <TableRow key={index}>
                                  <TableCell>{grade.assignment}</TableCell>
                                  <TableCell>
                                    {typeof grade.score === 'number' ? (
                                      <span className={grade.score >= 70 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                                        {grade.score}
                                      </span>
                                    ) : (
                                      <span className="text-amber-600 dark:text-amber-400">{grade.score}</span>
                                    )}
                                  </TableCell>
                                  <TableCell>{grade.maxScore}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="activity">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex">
                            <div className="mr-4 h-10 w-10 flex items-center justify-center rounded-full bg-fidel-50 dark:bg-slate-800">
                              <BarChart size={16} className="text-fidel-500 dark:text-fidel-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Completed Module 3: React Hooks</p>
                              <p className="text-xs text-muted-foreground">2 days ago</p>
                            </div>
                          </div>
                          <div className="flex">
                            <div className="mr-4 h-10 w-10 flex items-center justify-center rounded-full bg-fidel-50 dark:bg-slate-800">
                              <Clock size={16} className="text-fidel-500 dark:text-fidel-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Spent 45 minutes on Lesson: useEffect</p>
                              <p className="text-xs text-muted-foreground">3 days ago</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                <div className="flex mt-4 gap-2">
                  <Button className="flex-1">
                    Message Student
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View All Submissions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Student list view
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
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
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.title}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <Filter size={16} />
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-fidel-500 rounded-full" 
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs text-muted-foreground">{student.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.lastActive}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
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
            
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-4 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground border-t pt-4">
        Showing {paginatedStudents.length} of {filteredStudents.length} students
      </CardFooter>
    </Card>
  );
};

export default StudentManagement;