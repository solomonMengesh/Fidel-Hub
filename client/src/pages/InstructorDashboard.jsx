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
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import CourseTable from "../components/instructor-dashboard/CourseTable";
import StudentManagement from "../components/instructor/StudentManagement";
import StatsGrid from "../components/instructor-dashboard/StatsGrid";
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

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mainTab, setMainTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState({
    courses: false,
    stats: false,
    overall: false
  });
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    
    console.log("[DEBUG] useEffect triggered", { user });

    if (user?._id && !isFetchingRef.current) {
      console.log("[DEBUG] User ID detected, fetching courses...");
      isFetchingRef.current = true;
      fetchInstructorCourses(controller.signal);
    }

    return () => {
      controller.abort();
      isFetchingRef.current = false;
    };
  }, [user]);

  const fetchInstructorCourses = async (signal) => {
    console.log("[DEBUG] Starting fetchInstructorCourses");
    try {
      setLoading(prev => ({ ...prev, overall: true, courses: true }));

      // Fetch courses
      const coursesUrl = `http://localhost:5000/api/courses/instructor/${user._id}/courses`;
      const response = await axios.get(coursesUrl, { signal });
      
      console.log("[DEBUG] Courses response:", {
        status: response.status,
        count: response.data?.length || 0
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid courses data format");
      }

      // Fetch stats for each course
      setLoading(prev => ({ ...prev, courses: false, stats: true }));
      
      const coursesWithStats = await Promise.all(
        response.data.map(async (course) => {
          const statsUrl = `http://localhost:5000/api/courses/${user._id}/course/${course._id}/average-progress`;
          try {
            const statsResponse = await axios.get(statsUrl, { signal });
            return {
              ...course,
              progress: statsResponse.data.averageProgress || 0,
              students: statsResponse.data.studentCount || 0,
            };
          } catch (error) {
            console.error(`[DEBUG] Failed to fetch stats for course ${course._id}:`, error);
            return {
              ...course,
              progress: 0,
              students: 0,
            };
          }
        })
      );

      setCourses(coursesWithStats);
      updateSummaryStats(coursesWithStats);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("[DEBUG] Fetch error:", error);
        toast.error("Failed to load course data");
        setCourses([]);
        setStats([]);
      }
    } finally {
      if (!signal.aborted) {
        setLoading({ courses: false, stats: false, overall: false });
        isFetchingRef.current = false;
      }
    }
  };

  const updateSummaryStats = (courses) => {
    try {
      const totalStudents = courses.reduce((sum, course) => sum + (course.students || 0), 0);
      const activeCourses = courses.length;
      const totalProgress = courses.reduce((sum, course) => sum + (course.progress || 0), 0);
      const avgCompletion = courses.length > 0 ? Math.round(totalProgress / courses.length) : 0;

      const newStats = [
        { title: "Total Students", value: totalStudents.toString(), icon: "Users", change: "+0" },
        { title: "Active Courses", value: activeCourses.toString(), icon: "BookOpen", change: "+0" },
        { title: "Completion Rate", value: `${avgCompletion}%`, icon: "CheckCircle", change: "+0%" },
        { title: "Avg. Rating", value: "4.8", icon: "Star", change: "+0.2" },
      ];

      setStats(newStats);
    } catch (error) {
      console.error("[DEBUG] Failed to calculate stats:", error);
      setStats([]);
    }
  };

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

  const handleCourseCreated = () => {
    fetchInstructorCourses();
    setMainTab("list");
    toast.success("Course created successfully");
  };

  return (
    <div className="min-h-screen flex dark:bg-slate-950">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        handleNavItemClick={handleNavItemClick}
        handleCreateCourse={handleCreateCourse}
        user={user}
      />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header activeTab={activeTab} />
        <div className="p-5">
          {loading.overall ? (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                {loading.courses && !loading.stats ? (
                  "Loading courses..."
                ) : loading.stats ? (
                  "Calculating course statistics..."
                ) : (
                  "Loading dashboard..."
                )}
              </p>
              <button 
                onClick={() => fetchInstructorCourses(new AbortController().signal)}
                className="mt-4 text-sm text-blue-500 hover:text-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
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
                      <StatsGrid stats={stats} />
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          <CourseTable
                            courses={courses}
                            onViewAll={() => setActiveTab("courses")}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </TabsContent>
                  <TabsContent value="analytics">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                      <h3 className="font-semibold mb-4">Analytics</h3>
                      <div>
                        <p>Total Courses: {courses.length}</p>
                        <p>Total Students: {stats[0]?.value}</p>
                        <p>Average Completion: {stats[2]?.value}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          )}

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

          {activeTab === "students" && <StudentManagement />}

          {activeTab === "messages" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <InstructorStudentChat />
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <PlatformSettings />
            </motion.div>
          )}

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