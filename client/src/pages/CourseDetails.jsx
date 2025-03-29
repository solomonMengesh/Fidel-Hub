import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  BarChart,
  PlayCircle,
  FileText,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Download,
  Award,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/ui/ThemeToggle";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [expandedModules, setExpandedModules] = useState([1]);

  // Mock course data with Ethiopian names
  const course = {
    id: courseId || "1",
    title: "The Complete React Developer Course",
    instructor: "Selamawit Gebre",
    level: "Intermediate",
    category: "Web Development",
    rating: 4.8,
    totalRatings: 1245,
    students: 12500,
    lastUpdated: "April 2023",
    language: "English",
    duration: "24 hours",
    lessons: 48,
    description: `
      Master React and Redux in this comprehensive course. You'll learn React from the ground up and build several real-world projects along the way.
      
      This course is perfect for developers looking to level up their front-end skills and create modern, responsive web applications. We'll cover everything from React basics to advanced state management with Redux.
    `,
    whatYouWillLearn: [
      "Build powerful, fast, user-friendly and reactive web apps",
      "Apply for high-paid jobs or work as a freelancer",
      "Understand the React ecosystem and concepts like Hooks, Context API, and Redux",
      "Master the fundamentals and advanced topics of React",
      "Learn how to use React's most popular libraries and tools",
      "Develop complex applications with a clean code structure",
    ],
    prerequisites: [
      "Basic JavaScript knowledge is required",
      "ES6+ knowledge is beneficial but not required",
      "NO prior React or other framework experience is needed",
    ],
    image: "https://placehold.co/800x500/34d399/ffffff.png?text=React+Course&font=Montserrat",
    price: "5,039 ETB", 
    discount: "7,279 ETB",  
    modules: [
      {
        id: 1,
        title: "Getting Started with React",
        duration: "2h 45m",
        lessons: [
          { id: 101, title: "Introduction to the Course", duration: "5:30", type: "video", completed: true },
          { id: 102, title: "What is React?", duration: "10:15", type: "video", completed: true },
          { id: 103, title: "Setting Up the Development Environment", duration: "12:20", type: "video", completed: true },
          { id: 104, title: "Your First React Component", duration: "18:45", type: "video", completed: false },
          { id: 105, title: "Module Quiz", duration: "15:00", type: "quiz", completed: false },
        ],
      },
      {
        id: 2,
        title: "React Fundamentals",
        duration: "4h 30m",
        lessons: [
          { id: 201, title: "JSX Syntax", duration: "14:20", type: "video", completed: false },
          { id: 202, title: "Props and State", duration: "22:15", type: "video", completed: false },
          { id: 203, title: "Component Lifecycle", duration: "18:30", type: "video", completed: false },
          { id: 204, title: "Handling Events", duration: "20:45", type: "video", completed: false },
          { id: 205, title: "Conditional Rendering", duration: "16:10", type: "video", completed: false },
          { id: 206, title: "Lists and Keys", duration: "12:55", type: "video", completed: false },
          { id: 207, title: "Practical Exercise", duration: "30:00", type: "reading", completed: false },
          { id: 208, title: "Module Quiz", duration: "15:00", type: "quiz", completed: false },
        ],
      },
      {
        id: 3,
        title: "Hooks in React",
        duration: "5h 15m",
        lessons: [
          { id: 301, title: "Introduction to Hooks", duration: "12:30", type: "video", completed: false },
          { id: 302, title: "useState Hook", duration: "18:45", type: "video", completed: false },
          { id: 303, title: "useEffect Hook", duration: "24:20", type: "video", completed: false },
          { id: 304, title: "useContext Hook", duration: "15:10", type: "video", completed: false },
          { id: 305, title: "useReducer Hook", duration: "22:35", type: "video", completed: false },
          { id: 306, title: "Custom Hooks", duration: "28:15", type: "video", completed: false },
          { id: 307, title: "Practical Project", duration: "1:15:00", type: "reading", completed: false },
          { id: 308, title: "Module Quiz", duration: "20:00", type: "quiz", completed: false },
        ],
      },
    ],
  };
  const toggleModule = (moduleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const totalCompletedLessons = course.modules.reduce((acc, module) => {
    return acc + module.lessons.filter((lesson) => lesson.completed).length;
  }, 0);

  const totalLessons = course.modules.reduce((acc, module) => {
    return acc + module.lessons.length;
  }, 0);

  const progressPercentage = Math.round((totalCompletedLessons / totalLessons) * 100);

  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-950">

      {/* Course Header */}
      <div className="bg-fidel-600 text-white py-12">
        <div className="container px-4 md:px-6">

          <div className="flex flex-col md:flex-row gap-8 mt-8">
            <div className="flex-1">
              <div className="mb-4">
                <Link to="/courses" className="text-fidel-100 hover:text-white text-sm inline-flex items-center">
                  <ChevronRight size={16} className="rotate-180 mr-1" />
                  Back to Courses
                </Link>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>

              <p className="text-fidel-100 mb-6">{course.description.split("\n\n")[0]}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <Star size={18} className="text-yellow-300 fill-yellow-300 mr-1" />
                  <span className="font-medium">{course.rating}</span>
                  <span className="text-fidel-200 ml-1">({course.totalRatings} ratings)</span>
                </div>

                <div className="flex items-center">
                  <Users size={18} className="mr-1" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>

                <div className="flex items-center">
                  <Clock size={18} className="mr-1" />
                  <span>{course.duration}</span>
                </div>

                <div className="flex items-center">
                  <BookOpen size={18} className="mr-1" />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-white/20 mr-3"></div>
                <div>
                  <div className="font-medium">Created by {course.instructor}</div>
                  <div className="text-sm text-fidel-200">Last updated: {course.lastUpdated}</div>
                </div>
              </div>
            </div>

            <div className="md:w-96">
              <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-xl">
                <img src={course.image} alt={course.title} className="w-full h-52 object-cover" />

                <div className="p-6">
                  <div className="flex items-baseline mb-4">
                    <span className="text-2xl font-bold text-green-600 ">{course.price}</span>
                    <span className="ml-2 text-muted-foreground line-through">{course.discount}</span>
                    <span className="ml-2 text-sm bg-fidel-100 text-fidel-800 px-2 py-0.5 rounded">30% off</span>
                  </div>

                  <Button className="w-full mb-3 bg-fidel-600 hover:bg-fidel-700">Enroll Now</Button>

                  <Button variant="outline" className="w-full mb-6">
                    Try Free Preview
                  </Button>

                  <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-muted-foreground" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center">
                      <Download size={16} className="mr-2 text-muted-foreground" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center">
                      <Award size={16} className="mr-2 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare size={16} className="mr-2 text-muted-foreground" />
                      <span>Direct instructor support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container px-4 md:px-6 py-12">
        <Tabs defaultValue="content">
          <TabsList className="mb-8">
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold">Course Content</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      {course.modules.length} modules • {totalLessons} lessons • {course.duration} total length
                    </div>
                  </div>

                  {course.modules.map((module) => (
                    <div key={module.id} className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                      <button
                        className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        onClick={() => toggleModule(module.id)}
                      >
                        <div className="flex items-center">
                          {expandedModules.includes(module.id) ? (
                            <ChevronUp size={18} className="mr-2 text-muted-foreground" />
                          ) : (
                            <ChevronDown size={18} className="mr-2 text-muted-foreground" />
                          )}
                          <span className="font-medium">{module.title}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {module.lessons.length} lessons • {module.duration}
                        </div>
                      </button>

                      {expandedModules.includes(module.id) && (
                        <div className="bg-slate-50 dark:bg-slate-800/30 divide-y divide-slate-200 dark:divide-slate-800">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center p-3 pl-10 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                            >
                              {lesson.type === "video" ? (
                                <PlayCircle size={16} className="mr-3 text-fidel-500" />
                              ) : lesson.type === "reading" ? (
                                <FileText size={16} className="mr-3 text-fidel-500" />
                              ) : (
                                <BarChart size={16} className="mr-3 text-fidel-500" />
                              )}

                              <div className="flex-1">
                                <div className="flex items-center">
                                  <span className={`${lesson.completed ? "text-muted-foreground" : ""}`}>
                                    {lesson.title}
                                  </span>
                                  {lesson.completed && <Check size={16} className="ml-2 text-green-500" />}
                                </div>
                                <div className="text-xs text-muted-foreground">{lesson.duration}</div>
                              </div>

                              <Button variant="ghost" size="sm" className="text-fidel-500">
                                {lesson.completed ? "Replay" : "Preview"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sticky top-4">
                  <h3 className="font-semibold mb-4">Your Progress</h3>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{progressPercentage}% complete</span>
                      <span>
                        {totalCompletedLessons}/{totalLessons} lessons
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-fidel-500 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button className="w-full mb-3">Continue Learning</Button>

                  <div className="mt-6 space-y-4">
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                      <h4 className="font-medium mb-1">Next Lesson</h4>
                      <div className="flex items-center text-fidel-600">
                        <PlayCircle size={16} className="mr-2" />
                        <span className="text-sm">Your First React Component</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">18:45 minutes</div>
                    </div>

                    <div className="rounded-lg p-3 bg-fidel-50 dark:bg-fidel-900/10 border border-fidel-100 dark:border-fidel-900/20">
                      <h4 className="font-medium text-fidel-800 dark:text-fidel-200 mb-1">Get Certified</h4>
                      <p className="text-xs text-fidel-600 dark:text-fidel-300 mb-2">
                        Complete this course to earn your certification
                      </p>
                      <div className="flex items-center">
                        <Award size={16} className="text-fidel-500 mr-1" />
                        <div className="text-xs font-medium text-fidel-600">React Developer Certificate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-4">About This Course</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{course.description}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.whatYouWillLearn.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={18} className="mr-2 text-green-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-4">Prerequisites</h3>
                  <ul className="space-y-2">
                    {course.prerequisites.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <ChevronRight size={18} className="mr-2 text-fidel-500 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sticky top-4">
                  <h3 className="font-semibold mb-4">Course Details</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <span className="font-medium">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{course.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language</span>
                      <span className="font-medium">{course.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-medium">{course.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Duration</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Lessons</span>
                      <span className="font-medium">{course.lessons}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 mt-5 pt-5">
                    <Button className="w-full">Enroll Now</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold">Reviews coming soon</h3>
              <p className="text-muted-foreground mt-2">This section is currently being developed</p>
            </div>
          </TabsContent>

          <TabsContent value="instructor">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold">Instructor information coming soon</h3>
              <p className="text-muted-foreground mt-2">This section is currently being developed</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-auto">
        {/* <Footer /> */}
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default CourseDetails;