import { useState } from "react";
import { Sidebar } from "@/components/student-dashboard/Sidebar";
import { Header } from "@/components/student-dashboard/Header";
import { OverviewTab } from "@/components/student-dashboard/OverviewTab";
import { CoursesTab } from "@/components/student-dashboard/CoursesTab";
import { MessagesTab } from "@/components/student-dashboard/MessagesTab";
import { ScheduleTab } from "@/components/student-dashboard/ScheduleTab";
import { InstructorsTab } from "@/components/student-dashboard/InstructorsTab";

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex h-[100vh] dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto h-[100vh]">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeTab={activeTab}
        />

        <main className="flex-1 overflow-auto p-4 md:p-6">
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
