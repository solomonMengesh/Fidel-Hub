import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  BarChart, 
  Settings, 
  Plus,
  Calendar,
  Clock,
  Search,
  Bell,
  FileText,
  CheckCircle,
  Circle,
  ChevronRight,
  Star,
  Award,
  CreditCard
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Import instructor components
import CourseBuilder from "../components/instructor/CourseBuilder";
// import PaymentSettings from "@/components/instructor/PaymentSettings";
// import StudentMetrics from "@/components/instructor/StudentMetrics";
// import CertificateGenerator from "@/components/instructor/CertificateGenerator";

const InstructorDashboard = () => {
//   const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [mainTab, setMainTab] = useState("overview");
  
  // Mock data for courses
  const courses = [
    { id: 1, title: "Introduction to React", students: 125, progress: 75, lastUpdated: "2 days ago" },
    { id: 2, title: "Advanced JavaScript", students: 98, progress: 60, lastUpdated: "1 week ago" },
    { id: 3, title: "UX Design Principles", students: 67, progress: 90, lastUpdated: "3 days ago" },
  ];
  
  // Mock data for upcoming sessions
  const sessions = [
    { id: 1, title: "React Hooks Deep Dive", date: "Today", time: "3:00 PM", students: 18 },
    { id: 2, title: "JavaScript Promises", date: "Tomorrow", time: "2:30 PM", students: 24 },
    { id: 3, title: "Design Thinking Workshop", date: "May 15", time: "10:00 AM", students: 12 },
  ];
  
  // Mock data for student assignments
  const assignments = [
    { id: 1, name: "Sarah Williams", course: "Introduction to React", status: "Submitted", dueDate: "May 10" },
    { id: 2, name: "Michael Brown", course: "Advanced JavaScript", status: "Late", dueDate: "May 8" },
    { id: 3, name: "Emma Wilson", course: "UX Design Principles", status: "Graded", dueDate: "May 5" },
    { id: 4, name: "James Moore", course: "Introduction to React", status: "Submitted", dueDate: "May 12" },
  ];
  
  // Mock data for statistics
  const stats = [
    { title: "Total Students", value: "310", icon: Users, change: "+12" },
    { title: "Active Courses", value: "8", icon: BookOpen, change: "+1" },
    { title: "Completion Rate", value: "82%", icon: CheckCircle, change: "+5%" },
    { title: "Avg. Rating", value: "4.8", icon: Star, change: "+0.2" },
  ];

  const handleCreateCourse = () => {
    setActiveTab("courses");
    setMainTab("create");
    toast.success("Starting new course creation");
  };

  return (
    <div className="min-h-screen flex dark:bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 hidden md:block">
        <div className="flex items-center space-x-2 mb-8">
          <div className="h-8 w-8 rounded-full bg-fidel-500"></div>
          <div className="font-semibold text-lg">Fidel Hub</div>
        </div>
        
        <nav className="space-y-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart },
            { id: "courses", label: "My Courses", icon: BookOpen },
            { id: "students", label: "Students", icon: Users },
            { id: "messages", label: "Messages", icon: MessageSquare },
            { id: "payments", label: "Payments", icon: CreditCard },
            { id: "certificates", label: "Certificates", icon: Award },
            { id: "calendar", label: "Calendar", icon: Calendar },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => (
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
        
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <button 
            className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-fidel-600 dark:text-fidel-400 hover:bg-fidel-50 dark:hover:bg-slate-800"
            onClick={handleCreateCourse}
          >
            <Plus size={18} className="mr-2" />
            Create New Course
          </button>
        </div>
        
        {/* <div className="absolute bottom-5 left-5">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-700"></div>
            <div>
              <div className="text-sm font-medium">{user?.fullName || "Instructor"}</div>
              <div className="text-xs text-muted-foreground">{user?.role}</div>
            </div>
          </div>
        </div> */}
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col p-5 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {activeTab === "dashboard" && "Instructor Dashboard"}
            {activeTab === "courses" && "My Courses"}
            {activeTab === "students" && "Student Management"}
            {activeTab === "messages" && "Messages"}
            {activeTab === "certificates" && "Certificates"}
            {activeTab === "payments" && "Payments & Earnings"}
            {activeTab === "calendar" && "Schedule"}
            {activeTab === "settings" && "Account Settings"}
          </h1>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9 w-full md:w-64" placeholder="Search..." />
            </div>
            
            <div className="relative">
              <Bell size={20} className="text-slate-600 dark:text-slate-400 cursor-pointer" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white">3</span>
            </div>
            
            <ThemeToggle />
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <Tabs defaultValue="overview" value={mainTab} onValueChange={setMainTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md flex items-center space-x-4"
                    >
                      <div className="text-slate-400">
                        <stat.icon size={24} />
                      </div>
                      <div>
                        <div className="text-xl font-semibold">{stat.value}</div>
                        <div className="text-sm text-slate-500">{stat.title}</div>
                        <div className={`text-xs ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                          {stat.change}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <h2 className="text-lg font-semibold mb-4">Courses Overview</h2>
                {/* <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{course.students}</TableCell>
                        <TableCell>{course.progress}%</TableCell>
                        <TableCell>{course.lastUpdated}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table> */}
              </motion.div>
            </TabsContent>

            {/* <TabsContent value="analytics">
              <StudentMetrics />
            </TabsContent> */}
          </Tabs>
        )}
        
        {/* Course Builder */}
        {activeTab === "courses" && mainTab === "create" && (
          <CourseBuilder />
        )}

        {/* Payment Settings */}
        {activeTab === "payments" && <PaymentSettings />}
        
        {/* Certificates */}
        {activeTab === "certificates" && <CertificateGenerator />}
        
        {/* Calendar */}
        {activeTab === "calendar" && <div>Calendar Content</div>}
        
        {/* Settings */}
        {activeTab === "settings" && <div>Account Settings</div>}
      </div>
    </div>
  );
};

export default InstructorDashboard;
