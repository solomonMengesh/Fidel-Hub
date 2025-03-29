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
  Shield
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/ThemeToggle";
// import { Input } from "@/components/ui/input";
import CourseModeration from "@/components/admin/CourseModeration";
import PlatformAnalytics from "@/components/admin/PlatformAnalytics";
import PaymentManagement from "@/components/admin/PaymentManagement";
// import LanguageToggle from "../components/ui/LanguageToggle";
// import { useLanguage } from "@/contexts/LanguageContext";
import PlatformSettings from "../components/admin/PlatformSettings";
import UserManagement from "../components/admin/UserManagement";
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
   
  // Navigation items
  const navItems = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "users", label: "User Management", icon: Users },
    { id: "courses", label: "Course Moderation", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: PieChart },
    { id: "payments", label: "Payments", icon: Award },
    { id: "settings", label: "Platform Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex dark:bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 hidden md:block">
        <div className="flex items-center space-x-2 mb-8">
          <div className="h-8 w-8 rounded-full bg-fidel-500"></div>
          <div className="font-semibold text-lg">Fidel Hub</div>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
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
        
        <div className="absolute bottom-5 left-5">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <div>
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-xs text-muted-foreground">admin@fidelhub.com</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col p-5 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          
          <div className="flex items-center space-x-3">
            {/* <LanguageToggle /> */}
            <ThemeToggle />
            <Button variant="outline" size="sm">
              <Sliders size={16} className="mr-2" />
              Customize
            </Button>
          </div>
        </header>
        
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
                  <Shield size={24} className="text-fidel-500 dark:text-fidel-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Welcome to the Admin Panel</h2>
                  <p className="text-muted-foreground mt-1">
                    From here, you can manage users, moderate courses, view platform analytics, and control payment systems.
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
            <UserManagement />
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