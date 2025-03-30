// components/student-dashboard/Header.jsx
import { Bell, MessageSquare, Settings, Menu } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export const Header = ({ isSidebarOpen, setIsSidebarOpen, activeTab }) => {
  return (
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
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
          {activeTab === "overview" && "Dashboard Overview"}
          {activeTab === "courses" && "My Courses"}
          {activeTab === "schedule" && "Schedule"}
          {activeTab === "messages" && "Messages"}
          {activeTab === "instructors" && "Instructors"}
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
  );
};
