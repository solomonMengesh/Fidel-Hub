import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Book,
  Users,
  MessageSquare,
  Settings,
  Menu,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { OverviewTab } from "@/components/student-dashboard/OverviewTab";
import { CoursesTab } from "@/components/student-dashboard/CoursesTab";
import { MessagesTab } from "@/components/student-dashboard/MessagesTab";
import { ScheduleTab } from "@/components/student-dashboard/ScheduleTab";
import { InstructorsTab } from "@/components/student-dashboard/InstructorsTab";
import Logo from "../components/layout/Logo";
import { useAuth } from "../context/AuthContext"; 
import PlatformSettings from "../components/admin/PlatformSettings";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "courses", label: "My Courses", icon: Book },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "instructors", label: "Instructors", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Handle URL tab parameter on load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");

    if (tabParam && navItems.some((item) => item.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const handleNavItemClick = (id) => {
    setActiveTab(id);
    navigate(`/student-dashboard?tab=${id}`);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Dashboard Overview";
      case "courses":
        return "My Courses";
      case "schedule":
        return "Schedule";
      case "messages":
        return "Messages";
      case "instructors":
        return "Instructors";
      case "settings":
        return "Platform Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="flex h-[100vh] dark:bg-slate-950">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 h-[100vh] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:block overflow-hidden`}
      >
        <div className="flex items-center space-x-2 mb-8">
          <Logo />
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
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

        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
            <div className="h-8 w-8 rounded-full bg-fidel-100 dark:bg-fidel-900/30 flex items-center justify-center text-fidel-600 dark:text-fidel-400 font-medium">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "ST"}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-medium truncate">
                {user?.name || "Student Name"}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {user?.email || "student@example.com"}
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
      <div className="flex-1 flex flex-col overflow-auto h-[100vh]">
        <header className="flex justify-between items-start mb-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-4 sticky top-0 z-30">
          <h1 className="text-2xl font-bold pl-12 text-slate-900 dark:text-white">
            {getActiveTabTitle()}
          </h1>

          <div className="flex items-center space-x-3">
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <ThemeToggle />
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
            <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "courses" && <CoursesTab />}
            {activeTab === "schedule" && <ScheduleTab />}
            {activeTab === "messages" && <MessagesTab />}
            {activeTab === "instructors" && <InstructorsTab />}
            {activeTab === "settings" && <PlatformSettings />}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
