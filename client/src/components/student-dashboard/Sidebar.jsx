// components/student-dashboard/Sidebar.jsx
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
  return (
    <div
      className={cn(
        "w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out z-20",
        !isSidebarOpen && "w-0 -ml-64"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <Link
            to="/"
            className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center"
          >
            <span className="bg-fidel-500 text-white h-7 w-7 rounded flex items-center justify-center mr-2 shadow">
              F
            </span>
            Fidel<span className="text-fidel-500">Hub</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {[
              {
                name: "Overview",
                icon: <LayoutDashboard size={20} />,
                href: "#overview",
                id: "overview",
              },
              {
                name: "My Courses",
                icon: <Book size={20} />,
                href: "#courses",
                id: "courses",
              },
              {
                name: "Schedule",
                icon: <Calendar size={20} />,
                href: "#schedule",
                id: "schedule",
              },
              {
                name: "Messages",
                icon: <MessageSquare size={20} />,
                href: "#messages",
                id: "messages",
              },
              {
                name: "Instructors",
                icon: <Users size={20} />,
                href: "#instructors",
                id: "instructors",
              },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.id);
                }}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                  activeTab === item.id
                    ? "bg-fidel-50 dark:bg-fidel-900/30 text-fidel-600 dark:text-fidel-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-fidel-100 dark:bg-fidel-900/30 flex items-center justify-center text-fidel-600 dark:text-fidel-400 font-medium">
                JD
              </div>
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
    </div>
  );
};
