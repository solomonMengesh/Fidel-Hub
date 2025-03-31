import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Book,
  Users,
  MessageSquare,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
}) => {
  const navItems = [
    { id: "overview", name: "Overview", icon: LayoutDashboard },
    { id: "courses", name: "My Courses", icon: Book },
    { id: "schedule", name: "Schedule", icon: Calendar },
    { id: "messages", name: "Messages", icon: MessageSquare },
    { id: "instructors", name: "Instructors", icon: Users },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 h-screen md:w-64 w-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          to="/"
          className="text-xl font-bold text-slate-900 dark:text-white flex items-center"
        >
          <span className="bg-fidel-500 text-white h-7 w-7 rounded flex items-center justify-center mr-2 shadow">
            F
          </span>
          Fidel<span className="text-fidel-500">Hub</span>
        </Link>
        {/* Close Button for Mobile */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="text-slate-500 dark:text-slate-400 md:hidden hover:text-slate-700 dark:hover:text-slate-300"
        >
          <X size={18} />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === item.id
                  ? "bg-fidel-50 dark:bg-fidel-900/30 text-fidel-600 dark:text-fidel-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <item.icon size={20} className="mr-3" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-fidel-100 dark:bg-fidel-900/30 flex items-center justify-center text-fidel-600 dark:text-fidel-400 font-medium">
            JD
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              John Doe
            </p>
            <p className="text-xs text-muted-foreground">Student ID: 12345</p>
          </div>
        </div>
      </div>
    </div>
  );
};
