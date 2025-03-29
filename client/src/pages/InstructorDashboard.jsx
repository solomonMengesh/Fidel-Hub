import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  BarChart, 
  Settings, 
  Plus,
  Calendar,
  Clock,
  Search,
  Bell,
  CheckCircle,
  Star,
  Award,
  CreditCard,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import CourseBuilder from "@/components/instructor/CourseBuilder";
import InstructorStudentChat from "@/components/chat/InstructorStudentChat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// StudentManagement component
const StudentManagement = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  
  const students = [
    { id: 1, name: "Alex Johnson", email: "alex@example.com", course: "Introduction to React", progress: 65, lastActive: "2 days ago" },
    { id: 2, name: "Emma Wilson", email: "emma@example.com", course: "Advanced JavaScript", progress: 78, lastActive: "1 day ago" },
    { id: 3, name: "Michael Brown", email: "michael@example.com", course: "Introduction to React", progress: 42, lastActive: "1 week ago" },
  ];

  const courses = [
    { id: 1, title: "Introduction to React" },
    { id: 2, title: "Advanced JavaScript" },
    { id: 3, title: "UX Design Fundamentals" },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = filterCourse === "all" || student.course === filterCourse;
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
          <Button variant="ghost" size="sm" className="mb-4" onClick={handleBackToList}>
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
                    <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                    <p className="text-muted-foreground">{selectedStudent.email}</p>
                    <div className="mt-4 text-sm text-center">
                      <p>Enrolled in: <span className="font-medium">{selectedStudent.course}</span></p>
                      <p className="flex items-center justify-center mt-2">
                        <Clock size={14} className="mr-1 text-muted-foreground" />
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
                      <span className="ml-2 text-sm font-medium">{selectedStudent.progress}%</span>
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
                {filteredStudents.map((student) => (
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
        </>
      )}
    </div>
  );
};

// Main InstructorDashboard component
const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mainTab, setMainTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const courses = [
    { id: 1, title: "Introduction to React", students: 125, progress: 75, lastUpdated: "2 days ago" },
    { id: 2, title: "Advanced JavaScript", students: 98, progress: 60, lastUpdated: "1 week ago" },
    { id: 3, title: "UX Design Principles", students: 67, progress: 90, lastUpdated: "3 days ago" },
  ];
  
  const stats = [
    { title: "Total Students", value: "310", icon: Users, change: "+12" },
    { title: "Active Courses", value: "8", icon: BookOpen, change: "+1" },
    { title: "Completion Rate", value: "82%", icon: CheckCircle, change: "+5%" },
    { title: "Avg. Rating", value: "4.8", icon: Star, change: "+0.2" },
  ];

  const handleCreateCourse = () => {
    setActiveTab("courses");
    setMainTab("create");
    toast.success("Starting new course creation");
  };

  return (
    <div className="min-h-screen flex dark:bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 hidden md:block">
        <div className="flex items-center space-x-2 mb-8">
          {/* <div className="h-8 w-8 rounded-full bg-fidel-500"></div> */}
          <span className="bg-fidel-500 text-white h-7 w-7 rounded flex items-center justify-center mr-2 shadow">F</span>
          <div className="font-semibold text-lg">Fidel Hub</div>
        </div>
        
        <nav className="space-y-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart },
            { id: "courses", label: "My Courses", icon: BookOpen },
            { id: "students", label: "Students", icon: Users },
            { id: "messages", label: "Messages", icon: MessageSquare },
            { id: "payments", label: "Payments", icon: CreditCard },
            { id: "certificates", label: "Certificates", icon: Award },
            { id: "calendar", label: "Calendar", icon: Calendar },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === item.id
                  ? "bg-fidel-50 text-fidel-600 dark:bg-slate-800 dark:text-fidel-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <item.icon size={18} className="mr-2" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <button 
            className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-fidel-600 dark:text-fidel-400 hover:bg-fidel-50 dark:hover:bg-slate-800"
            onClick={handleCreateCourse}
          >
            <Plus size={18} className="mr-2" />
            Create New Course
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col p-5 overflow-auto">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6">
                  <div className="flex items-center">
                    {!isSidebarOpen && (
                      <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="mr-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        <Menu size={20} />
                      </button>
                    )}
                     <h1 className="text-2xl font-bold">
            {activeTab === "dashboard" && "Instructor Dashboard"}
            {activeTab === "courses" && "My Courses"}
            {activeTab === "students" && "Student Management"}
{activeTab === "messages" && (
  <InstructorStudentChat onBack={() => setActiveTab(null)} />
)}
            {activeTab === "certificates" && "Certificates"}
            {activeTab === "payments" && "Payments & Earnings"}
            {activeTab === "calendar" && "Schedule"}
            {activeTab === "settings" && "Account Settings"}
          </h1>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                      </button>
                    </div>
                    <div className="relative">
                      <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200">
                        <MessageSquare size={20} />
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-fidel-500"></span>
                      </button>
                    </div>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                    <ThemeToggle />
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                    <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200">
                      <Settings size={20} />
                    </button>
                  </div>
                </header>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <Tabs defaultValue="overview" value={mainTab} onValueChange={setMainTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
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
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                          <p className="text-xs text-green-500 mt-1">{stat.change} this month</p>
                        </div>
                        <div className="p-3 rounded-lg bg-fidel-50 dark:bg-slate-800">
                          <stat.icon size={20} className="text-fidel-500 dark:text-fidel-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Your Courses</h3>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("courses")}>View All Courses</Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Course</TableHead>
                            <TableHead>Students</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courses.map((course) => (
                            <TableRow key={course.id}>
                              <TableCell className="font-medium">{course.title}</TableCell>
                              <TableCell>{course.students}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-fidel-500 rounded-full" 
                                      style={{ width: `${course.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-sm text-muted-foreground">{course.progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell>{course.lastUpdated}</TableCell>
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
            </TabsContent>
          </Tabs>
        )}

        {/* Courses Content */}
        {activeTab === "courses" && (
          <Tabs defaultValue="list" value={mainTab} onValueChange={setMainTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="list">My Courses</TabsTrigger>
              <TabsTrigger value="create">Create Course</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">All Your Courses</h3>
                  <Button onClick={() => setMainTab("create")}>
                    <Plus size={16} className="mr-2" />
                    Create New Course
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                          <TableCell>{course.students}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-fidel-500 rounded-full" 
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm text-muted-foreground">{course.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{course.lastUpdated}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">
                              Published
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm">View</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="create">
              <CourseBuilder 
                onSave={() => {
                  toast.success("Course saved successfully");
                  setMainTab("list");
                }}
              />
            </TabsContent>
          </Tabs>
        )}

        {/* Students Content */}
        {activeTab === "students" && <StudentManagement />}
      </div>
    </div>
  );
};

export default InstructorDashboard;