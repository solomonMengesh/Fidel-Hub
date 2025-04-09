 import { Bell, MessageSquare, Settings } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const InstructorHeader = ({ activeTab }) => {
  const tabTitles = {
    dashboard: "Dashboard",
    courses: "My Courses",
    students: "Students",
    messages: "Messages",
    certificates: "Certificates",
    payments: "Payments",
    calendar: "Calendar",
    settings: "Settings",
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      <div className="flex items-center">
        <h1 className="text-xl md:text-2xl font-bold pl-12 pt-3">
          {tabTitles[activeTab] || "Dashboard"}
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
  );
};

export default InstructorHeader;
