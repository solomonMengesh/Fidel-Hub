import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import CourseTable from "../components/instructor-dashboard/CourseTable";
import StudentManagement from "../components/instructor/StudentManagement";
import StatsGrid from "../components/instructor-dashboard/StatsGrid";
import CourseBuilder from "../components/instructor/create Course/CourseBuilder";
import InstructorStudentChat from "@/components/chat/InstructorStudentChat";
import PlatformSettings from "../components/admin/PlatformSettings";
import PaymentComponent from "../components/instructor-dashboard/PaymentComponent";
import { toast } from "sonner";
import { motion } from "framer-motion";
import axios from "axios";
import InstructorAnalyticsDashboard from "../components/instructor/analytics/InstructorAnalyticsDashboard";
import { MessagesTab } from "@/components/student-dashboard/MessagesTab";

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
    overall: false,
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
      setLoading((prev) => ({ ...prev, overall: true, courses: true }));

      // Fetch courses
      const coursesUrl = `http://localhost:5000/api/courses/instructor/${user._id}/courses`;
      const response = await axios.get(coursesUrl, { signal });

      console.log("[DEBUG] Courses response:", {
        status: response.status,
        count: response.data?.length || 0,
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid courses data format");
      }

      // Fetch stats for each course
      setLoading((prev) => ({ ...prev, courses: false, stats: true }));

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
            console.error(
              `[DEBUG] Failed to fetch stats for course ${course._id}:`,
              error
            );
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
      const totalStudents = courses.reduce(
        (sum, course) => sum + (course.students || 0),
        0
      );
      const activeCourses = courses.length;
      const totalProgress = courses.reduce(
        (sum, course) => sum + (course.progress || 0),
        0
      );
      const avgCompletion =
        courses.length > 0 ? Math.round(totalProgress / courses.length) : 0;

      const newStats = [
        {
          title: "Total Students",
          value: totalStudents.toString(),
          icon: "Users",
          change: "+0",
        },
        {
          title: "Active Courses",
          value: activeCourses.toString(),
          icon: "BookOpen",
          change: "+0",
        },
        {
          title: "Completion Rate",
          value: `${avgCompletion}%`,
          icon: "CheckCircle",
          change: "+0%",
        },
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
      <div className="flex-1 flex flex-col overflow-auto md:ml-64">
        <Header activeTab={activeTab} />
        <div className="p-5">
          {loading.overall ? (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                {loading.courses && !loading.stats
                  ? "Loading courses..."
                  : loading.stats
                  ? "Calculating course statistics..."
                  : "Loading dashboard..."}
              </p>
              <button
                onClick={() =>
                  fetchInstructorCourses(new AbortController().signal)
                }
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
                    <InstructorAnalyticsDashboard />
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
                    <CourseTable
                      courses={courses}
                      onCreate={() => setMainTab("create")}
                      showStatus={true}
                      showActions={true}
                    />
                  </TabsContent>
                  <TabsContent value="create">
                    <CourseBuilder onSave={handleCourseCreated} />
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
                  <MessagesTab />
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
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    {/* <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Payments</h2>
      <div className="bg-primary/10 px-4 py-2 rounded-lg">
        <span className="font-medium">Balance:</span> 
        <span className="ml-2 font-bold">
          {user?.balance?.toLocaleString() || 0} ETB
        </span>
      </div>
    </div> */}
    
    <PaymentComponent 
      user={user}
      onWithdrawSuccess={(newWithdrawal) => {
        setWithdrawals(prev => [newWithdrawal, ...prev]);
        toast.success(`Withdrawal of ${newWithdrawal.amount} ETB initiated`);
      }}
    />
  </motion.div>
)}
              {/* {activeTab === "payments" && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                  <h3 className="font-semibold mb-4">Payments</h3>
                  <p className="text-muted-foreground">
                    Payment information will be displayed here.
                  </p>
                </div>
              )} */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;