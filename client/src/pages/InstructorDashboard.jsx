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
  ChevronLeft,
  Menu,
} from "lucide-react";
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
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import CourseBuilder from "../components/instructor/CourseBuilder";
import InstructorStudentChat from "@/components/chat/InstructorStudentChat";
import PlatformSettings from "../components/admin/PlatformSettings";
import { useAuth } from "../context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "../components/layout/Logo";

// StudentManagement component (same as before)
const StudentManagement = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const { user } = useAuth();

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
      {/* ... (keep existing StudentManagement JSX exactly the same) ... */}
    </div>
  );
};

// Main InstructorDashboard component
const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mainTab, setMainTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const courses = [
    {
      id: 1,
      title: "Introduction to React",
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

  const handleCreateCourse = () => {
    setActiveTab("courses");
    setMainTab("create");
    toast.success("Starting new course creation");
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleNavItemClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-slate-950">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:block`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center space-x-2 mb-8">
            <Logo />
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto">
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
                onClick={() => handleNavItemClick(item.id)}
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

          <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-fidel-600 dark:text-fidel-400 hover:bg-fidel-50 dark:hover:bg-slate-800 mb-4"
              onClick={handleCreateCourse}
            >
              <Plus size={18} className="mr-2" />
              Create New Course
            </button>

            {/* User Profile Section */}
            <div className="flex items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div className="h-10 w-10 rounded-full bg-fidel-100 dark:bg-fidel-900/30 flex items-center justify-center text-fidel-600 dark:text-fidel-400 font-medium text-sm">
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "IN"}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {user?.name || "Instructor Name"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || "instructor@example.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar toggle button */}
      <button
        className="fixed top-5 left-5 z-50 md:hidden p-2 rounded-full bg-fidel-500 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={20} />
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold pl-12 pt-3">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "courses" && "My Courses"}
              {activeTab === "students" && "Students"}
              {activeTab === "messages" && "Messages"}
              {activeTab === "certificates" && "Certificates"}
              {activeTab === "payments" && "Payments"}
              {activeTab === "calendar" && "Calendar"}
              {activeTab === "settings" && "Settings"}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
            <div className="relative hidden sm:block">
              <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200">
                <MessageSquare size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-fidel-500"></span>
              </button>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>
            <ThemeToggle />
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>
            <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200 hidden sm:block">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="p-5">
          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <Tabs
              defaultValue="overview"
              value={mainTab}
              onValueChange={setMainTab}
            >
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
                            <p className="text-sm font-medium text-muted-foreground">
                              {stat.title}
                            </p>
                            <h3 className="text-2xl font-bold mt-1">
                              {stat.value}
                            </h3>
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
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0"
                                  >
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
            <Tabs
              defaultValue="list"
              value={mainTab}
              onValueChange={setMainTab}
            >
              <TabsList className="mb-6">
                <TabsTrigger value="list">My Courses</TabsTrigger>
                <TabsTrigger value="create">Create Course</TabsTrigger>
              </TabsList>

              <TabsContent value="list">
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
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
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

          {/* Messages Content */}
          {activeTab === "messages" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <InstructorStudentChat />
            </motion.div>
          )}

          {/* Settings Content */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <PlatformSettings />
            </motion.div>
          )}

          {/* Other tabs content */}
          {activeTab === "payments" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
              <h3 className="font-semibold mb-4">Payments</h3>
              <p className="text-muted-foreground">
                Payment information will be displayed here.
              </p>
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
              <h3 className="font-semibold mb-4">Certificates</h3>
              <p className="text-muted-foreground">
                Certificate management will be displayed here.
              </p>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
              <h3 className="font-semibold mb-4">Calendar</h3>
              <p className="text-muted-foreground">
                Calendar view will be displayed here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
