import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/Logo";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart,
  BookOpen,
  Users,
  MessageSquare, 
  CreditCard,
  Award,
  Calendar,
  Settings,
} from "lucide-react";

const InstructorSidebar = ({
  activeTab,
  handleNavItemClick,
  handleCreateCourse,
  isSidebarOpen,
}) => {
  const { user } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "students", label: "Students", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 transform transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative md:block`}
    >
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === item.id
                    ? "bg-fidel-50 text-fidel-600 dark:bg-slate-800 dark:text-fidel-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <IconComponent size={18} className="mr-2" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-fidel-600 dark:text-fidel-400 hover:bg-fidel-50 dark:hover:bg-slate-800 mb-4"
            onClick={handleCreateCourse}
          >
            <Plus size={18} className="mr-2" />
            Create New Course
          </button>

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
  );
};

export default InstructorSidebar;
