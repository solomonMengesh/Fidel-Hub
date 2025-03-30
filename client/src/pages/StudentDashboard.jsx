// pages/StudentDashboard.jsx
import { useState } from "react";
import { Sidebar } from "@/components/student-dashboard/Sidebar";
import { Header } from "@/components/student-dashboard/Header";
import { OverviewTab } from "@/components/student-dashboard/OverviewTab";
import { CoursesTab } from "@/components/student-dashboard/CoursesTab";
import { MessagesTab } from "@/components/student-dashboard/MessagesTab";
import { ScheduleTab } from "@/components/student-dashboard/ScheduleTab";
import { InstructorsTab } from "@/components/student-dashboard/InstructorsTab";
import { cn } from "@/lib/utils";

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeTab={activeTab}
        />

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 md:p-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "courses" && <CoursesTab />}
          {activeTab === "schedule" && <ScheduleTab />}
          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "instructors" && <InstructorsTab />}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
