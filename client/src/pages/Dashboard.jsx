import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, Calendar, Book, Users, 
  Bell, MessageSquare, Settings, LogOut,
  Search, Star, Clock, BookOpen, X, Menu,
  ChevronRight, Award, Send
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Sidebar */}
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
              <span className="bg-fidel-500 text-white h-7 w-7 rounded flex items-center justify-center mr-2 shadow">F</span>
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
                { name: "Overview", icon: <LayoutDashboard size={20} />, href: "#overview", id: "overview" },
                { name: "My Courses", icon: <Book size={20} />, href: "#courses", id: "courses" },
                { name: "Schedule", icon: <Calendar size={20} />, href: "#schedule", id: "schedule" },
                { name: "Messages", icon: <MessageSquare size={20} />, href: "#messages", id: "messages" },
                { name: "Instructors", icon: <Users size={20} />, href: "#instructors", id: "instructors" },
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
                <p className="text-xs text-muted-foreground">
                  Student ID: 12345
                </p>
              </div>
              <div className="ml-auto flex items-center">
                <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
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
        
        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 md:p-6">
          {/* Overview tab content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Welcome banner */}
              <div className="glass-card p-6 relative overflow-hidden">
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-fidel-100 dark:bg-fidel-900/20 rounded-full opacity-70 dark:opacity-30 -z-10"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Welcome back, John!</h2>
                  <p className="text-muted-foreground mt-1">Here's what's happening with your courses today.</p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 shadow-sm">
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-semibold text-slate-900 dark:text-white">2</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 shadow-sm">
                      <p className="text-sm text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-semibold text-slate-900 dark:text-white">4</p>
                    </div>
                    {/*  */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 shadow-sm">
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                      <p className="text-2xl font-semibold text-slate-900 dark:text-white">2</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Continue learning */}
              <section>
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Continue Learning</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Introduction to Machine Learning",
                      progress: 65,
                      lastAccessed: "Yesterday",
                      color: "bg-blue-500"
                    },
                    {
                      title: "Advanced Data Structures",
                      progress: 42,
                      lastAccessed: "2 days ago",
                      color: "bg-purple-500"
                    }
                  ].map((course, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="glass-card p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 dark:text-white">{course.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">Last accessed: {course.lastAccessed}</p>
                          <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${course.color} rounded-full`} 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <div className="mt-2 flex justify-between text-xs">
                            <span className="text-muted-foreground">{course.progress}% complete</span>
                            <span className="font-medium text-fidel-500">Continue</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
              
            </div>
          )}
          
          {/* Other tab contents would go here */}
          {activeTab === "courses" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">My Courses</h2>
              {/* Courses content would go here */}
              <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">My Enrolled Courses</h3>
            <div className="flex space-x-2">
              <button className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700">
                Sort by
              </button>
              <button className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700">
                Filter
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Introduction to Machine Learning",
                instructor: "Dr. Abebe Kebede",
                progress: 65,
                lastAccessed: "Yesterday",
                image: "https://static.kanopy.com/cdn-cgi/image/fit=cover,height=540,width=960/https://static-assets.kanopy.com/video-images/138c8a73-6521-4251-a22d-5e71fa74ce76.jpeg",
                badge: "In Progress",
                badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
              },
              {
                title: "Advanced Data Structures",
                instructor: "Prof. Almaz Tadesse",
                progress: 42,
                lastAccessed: "2 days ago",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqjsbj930xlKHj5Tczrb8qQ29Z8fX4xxQMaW9QMtlwJ3HgxPrzLa4d8rlltYVVkFWrZtc&usqp=CAU",
                badge: "In Progress",
                badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
              }
            ].map((course, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="h-40 bg-slate-200 dark:bg-slate-700 relative">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${course.badgeColor}`}>
                    {course.badge}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-slate-900 dark:text-white line-clamp-1">{course.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">Instructor: {course.instructor}</p>
                  
                  {course.progress > 0 && (
                    <>
                      <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${course.progress === 100 ? 'bg-green-500' : 'bg-fidel-500'} rounded-full`} 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs">
                        <span className="text-muted-foreground">{course.progress}% complete</span>
                        <span className="font-medium text-fidel-500">Last: {course.lastAccessed}</span>
                      </div>
                    </>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between">
                    <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-fidel-50 dark:bg-fidel-900/30 text-fidel-600 dark:text-fidel-400 hover:bg-fidel-100 dark:hover:bg-fidel-900/50 transition-colors duration-200">
                      {course.progress === 0 ? 'Start Learning' : 'Continue Learning'}
                    </button>
                    <button className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200">
                      <BookOpen size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
            </div>
          )}
          
          {activeTab === "schedule" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">Schedule</h2>
              {/* Schedule content would go here */}
            </div>
          )}
          
          {activeTab === "messages" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">Messages</h2>
              {/* Messages content would go here */}
              {/* Messages tab content */}
{activeTab === "messages" && (
  <div className="h-full flex flex-col">
    <div className="flex mb-4 gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-fidel-500 dark:focus:ring-fidel-400 focus:border-transparent"
          />
        </div>
      </div>
      <button className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700">
        Filter
      </button>
    </div>
    
    <div className="flex h-[calc(100vh-230px)] bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      {/* Contacts sidebar */}
      <div className="w-72 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
        <div className="p-3 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Conversations</h3>
        </div>
        
        {[
          {
            name: "Dr. Mulugetta Bekele",
            avatar: "MB",
            message: "When do you plan to submit your assignment?",
            time: "10:45 AM",
            unread: true,
            online: true
          },
          {
            name: "Prof. Desta Tadesse",
            avatar: "DT",
            message: "The next lecture will cover advanced topics...",
            time: "Yesterday",
            unread: false,
            online: false
          },
          {
            name: "Samrawit Yonas",
            avatar: "SY",
            message: "Great work on your React project!",
            time: "Yesterday",
            unread: false,
            online: true
          },
          {
            name: "Amanuel Gebremedhin",
            avatar: "AG",
            message: "Don't forget to check the Python tutorial I shared",
            time: "Monday",
            unread: false,
            online: false
          },
          {
            name: "TA Support Group",
            avatar: "TS",
            message: "Amanuel: I'll be available during office hours...",
            time: "Monday",
            unread: false,
            online: false
          }
        ].map((contact, i) => (
          <div 
            key={i}
            className={cn(
              "p-3 flex items-start hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200",
              i === 0 ? "bg-slate-50 dark:bg-slate-700" : ""
            )}
          >
            <div className="relative">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                contact.unread ? "bg-fidel-100 dark:bg-fidel-900/30 text-fidel-600 dark:text-fidel-400" :
                "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              )}>
                {contact.avatar}
              </div>
              {contact.online && (
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
              )}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">{contact.name}</h4>
                <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{contact.time}</span>
              </div>
              <p className={cn(
                "text-xs mt-1 truncate",
                contact.unread ? "font-medium text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
              )}>
                {contact.message}
              </p>
            </div>
            {contact.unread && (
              <div className="ml-2 min-w-[18px] h-[18px] rounded-full bg-fidel-500 text-white text-xs flex items-center justify-center">
                1
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-fidel-100 dark:bg-fidel-900/30 flex items-center justify-center text-fidel-600 dark:text-fidel-400 text-sm font-medium">
              MB
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-slate-900 dark:text-white">Dr. Mulugetta Bekele</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Online</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg rounded-tl-none px-4 py-2 max-w-[70%]">
              <p className="text-sm text-slate-800 dark:text-slate-200">Hello John, I wanted to check on your progress with the machine learning assignment. Have you been able to implement the algorithms we discussed?</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">10:30 AM</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <div className="bg-fidel-100 dark:bg-fidel-900/30 text-fidel-800 dark:text-fidel-300 rounded-lg rounded-tr-none px-4 py-2 max-w-[70%]">
              <p className="text-sm">Hi Dr. Bekele, I've implemented the regression and classification algorithms, but I'm having some issues with the neural network part.</p>
              <p className="text-xs text-fidel-600/70 dark:text-fidel-400/70 mt-1 text-right">10:35 AM</p>
            </div>
          </div>
          
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg rounded-tl-none px-4 py-2 max-w-[70%]">
              <p className="text-sm text-slate-800 dark:text-slate-200">What specific issues are you encountering with the neural network implementation?</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">10:38 AM</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <div className="bg-fidel-100 dark:bg-fidel-900/30 text-fidel-800 dark:text-fidel-300 rounded-lg rounded-tr-none px-4 py-2 max-w-[70%]">
              <p className="text-sm">The backpropagation algorithm isn't converging properly. I think there might be an issue with my gradient calculation.</p>
              <p className="text-xs text-fidel-600/70 dark:text-fidel-400/70 mt-1 text-right">10:40 AM</p>
            </div>
          </div>
          
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg rounded-tl-none px-4 py-2 max-w-[70%]">
              <p className="text-sm text-slate-800 dark:text-slate-200">That's a common issue. When do you plan to submit your assignment? I can help you troubleshoot the gradient calculation.</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">10:45 AM</p>
            </div>
          </div>
        </div>
        
        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                placeholder="Type a message..."
                rows={1}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-fidel-500 dark:focus:ring-fidel-400 focus:border-transparent"
              ></textarea>
            </div>
            <button className="p-2.5 rounded-lg bg-fidel-500 text-white hover:bg-fidel-600 transition-colors duration-200 shadow-sm">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

            </div>
          )}
          
          {activeTab === "instructors" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">Instructors</h2>
              {/* Instructors content would go here */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;