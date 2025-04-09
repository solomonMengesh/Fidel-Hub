import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Layers,
  Award,
  PieChart,
  Settings,
  Sliders,
  Shield,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import CourseModeration from "@/components/admin/CourseModeration";
import PlatformAnalytics from "@/components/admin/PlatformAnalytics";
import PaymentManagement from "@/components/admin/PaymentManagement";
import PlatformSettings from "../components/admin/PlatformSettings";
import UserManagement from "../components/admin/UserManagement";
import UserDetail from "../pages/Userdetails";
import Logo from "../components/layout/Logo";
import { useAuth } from "../context/AuthContext"; 

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const navItems = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "users", label: "User Management", icon: Users },
    { id: "courses", label: "Course Management", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: PieChart },
    { id: "payments", label: "Payments", icon: Award },
    { id: "settings", label: " Settings", icon: Settings },
  ];

  const handleNavItemClick = (id) => {
    if (id !== "users") {
      setSelectedUserId(null);
    }
    setActiveTab(id);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
    setActiveTab("user-detail");
  };

  const handleBackToUsers = () => {
    setSelectedUserId(null);
    setActiveTab("users");
  };

  const { user } = useAuth();

  return (
    <div className="flex h-[100vh] dark:bg-slate-950">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 h-[100vh] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:block overflow-hidden`} >
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

        <div className="absolute bottom-5 left-5">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-xs font-medium">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div>
              <div className="text-sm font-medium">
                {user?.name || "Admin User"}
              </div>
              <div className="text-xs text-muted-foreground">
                {user?.email || "admin@fidelhub.com"}
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
        <Layers size={20} />
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-5 overflow-auto h-[100vh]">
        <header className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold pl-10">
            {activeTab === "user-detail" ? "User Details" : "Admin Dashboard"}
          </h1>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
          </div>
        </header>

        {activeTab === "user-detail" && (
          <div className="mb-4 pl-10">
            <Button variant="ghost" onClick={handleBackToUsers}>
              <ChevronLeft size={16} className="mr-2" />
              Back to User Management
            </Button>
          </div>
        )}

        {/* Page content based on active tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-fidel-50 dark:bg-slate-800">
                  <Shield
                    size={24}
                    className="text-fidel-500 dark:text-fidel-400"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    Welcome to the Admin Panel
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Manage users, moderate courses, view analytics, and control
                    payments here.
                  </p>
                </div>
              </div>
            </div>
            <PlatformAnalytics />
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <UserManagement onViewUser={handleViewUser} />
          </motion.div>
        )}

        {activeTab === "user-detail" && selectedUserId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <UserDetail
              userId={selectedUserId}
              onBack={handleBackToUsers}
              embedded={true}
            />
          </motion.div>
        )}

        {activeTab === "courses" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CourseModeration />
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <PlatformAnalytics />
          </motion.div>
        )}

        {activeTab === "payments" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <PaymentManagement />
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
      </div>
    </div>
  );
};

export default AdminDashboard;
