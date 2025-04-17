import { useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import InstructorSidebar from "@/components/instructor/InstructorSidebar";
import InstructorHeader from "@/components/instructor/InstructorHeader";
import DashboardOverview from "@/components/instructor/DashboardOverview";
import CoursesTab from "@/components/instructor/CoursesTab";
import StudentManagement from "@/components/instructor/StudentManagement";
import InstructorStudentChat from "@/components/chat/InstructorStudentChat";
import PlatformSettings from "@/components/admin/PlatformSettings";
import { MessagesTab } from "../components/student-dashboard/MessagesTab";

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mainTab, setMainTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

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
      <InstructorSidebar
        activeTab={activeTab}
        handleNavItemClick={handleNavItemClick}
        handleCreateCourse={handleCreateCourse}
        isSidebarOpen={isSidebarOpen}
      />

      <button
        className="fixed top-5 left-5 z-50 md:hidden p-2 rounded-full bg-fidel-500 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 flex flex-col overflow-auto">
        <InstructorHeader activeTab={activeTab} />

        <div className="p-5">
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
                <DashboardOverview setActiveTab={setActiveTab} />
              </TabsContent>

              {/* Add Analytics TabContent here if needed */}
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
                <CoursesTab mainTab={mainTab} setMainTab={setMainTab} />
              </TabsContent>

              <TabsContent value="create">
                <CoursesTab mainTab={mainTab} setMainTab={setMainTab} />
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
              <MessagesTab currentUserType="instructor" />
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
