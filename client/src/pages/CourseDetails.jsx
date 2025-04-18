import { useState, useEffect, useMemo } from "react";
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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/ui/ThemeToggle";
import VideoPlayer from "@/components/video-player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Helper functions for duration handling
const formatDuration = (duration) => {
  if (!duration && duration !== 0) return 'N/A';
  if (duration === 0) return '00:00';
  
  if (typeof duration === 'number') {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  }
  
  return duration;
};

const calculateTotalDuration = (modules) => {
  if (!modules) return 'N/A';
  
  const totalSeconds = modules.reduce((total, module) => {
    const moduleDuration = module.duration || 0;
    if (typeof moduleDuration === 'string') {
      const [h, m, s] = moduleDuration.split(':').map(Number);
      return total + (h * 3600) + (m * 60) + (s || 0);
    }
    return total + moduleDuration;
  }, 0);
  
  return formatDuration(totalSeconds);
};

const calculateProgress = (modules) => {
  if (!modules) return { totalCompleted: 0, total: 0, percentage: 0 };
  
  const totalCompleted = modules.reduce((acc, module) => {
    return acc + (module.lessons?.filter((lesson) => lesson.completed)?.length || 0);
  }, 0);

  const total = modules.reduce((acc, module) => {
    return acc + (module.lessons?.length || 0);
  }, 0);

  return {
    totalCompleted,
    total,
    percentage: total > 0 ? Math.round((totalCompleted / total) * 100) : 0
  };
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
  
        const processedData = {
          ...data,
          modules: data.modules?.map(module => ({
            ...module,
            duration: formatDuration(module.duration),
            lessons: module.lessons?.map(lesson => {
              const videoData = lesson.video || {};
              const hasValidUrl = !!videoData.url;
              return {
                ...lesson,
                duration: formatDuration(lesson.duration),
                video: {
                  url: videoData.url || null,
                  thumbnailUrl: videoData.thumbnailUrl || null,
                  publicId: videoData.publicId || null,
                  _valid: hasValidUrl
                }
              };
            }) || []
          })) || []
        };
 
        setCourse(processedData);
  
        if (processedData.modules?.length > 0) {
          const firstModuleId = processedData.modules[0]._id;
          setExpandedModules([firstModuleId]);
        }
      } catch (err) {
        console.error('[ERROR] Failed to fetch course:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourse();
  }, [courseId]);

  // Calculate durations and progress
  const totalDuration = useMemo(() => calculateTotalDuration(course?.modules), [course]);
  const { totalCompleted, total, percentage } = useMemo(
    () => calculateProgress(course?.modules),
    
    [course]
    
  );

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handlePreviewClick = async (lesson) => {
    if (lesson.type === 'video' && !lesson.video?._valid) {
      return;
    }

    setPreviewLoading(true);
    try {
      setCurrentPreview(lesson);
      setPreviewOpen(true);
    } finally {
      setPreviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fidel-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-950">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-500">Error loading course</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Link to="/courses" className="block mt-4 text-fidel-500 hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-950">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Course not found</h2>
          <Link to="/courses" className="text-fidel-500 hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // Format instructor name
  const instructorName = typeof course.instructor === 'object' 
    ? course.instructor.name 
    : course.instructor || 'Unknown Instructor';

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

              <p className="text-fidel-100 mb-6">{course.description?.split("\n\n")[0] || course.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <Star size={18} className="text-yellow-300 fill-yellow-300 mr-1" />
                  <span className="font-medium">{course.rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-fidel-200 ml-1">({course.totalRatings?.toLocaleString() || 0} ratings)</span>
                </div>

                <div className="flex items-center">
                  <Users size={18} className="mr-1" />
                  <span>{(course.students || 0).toLocaleString()} students</span>
                </div>

                <div className="flex items-center">
                  <Clock size={18} className="mr-1" />
                  <span>{course.totalDuration}</span>
                </div>

                <div className="flex items-center">
                  <BookOpen size={18} className="mr-1" />
                  <span>{total} lessons</span>
                </div>
              </div>

              <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-white/20 mr-3 flex items-center justify-center">
                <span className="text-xl font-medium">
                  {instructorName.split(' ').map(n => n[0].toUpperCase()).join('')}
                </span>
              </div>

                <div>
                  
                  <div className="font-medium">Created by {instructorName}</div>
                  <div className="text-sm text-fidel-200">
                    Last updated: {new Date(course.updatedAt || course.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-96">
              <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-xl">
                <img 
                  src={course.thumbnail?.url || "https://placehold.co/800x500/34d399/ffffff.png?text=Course+Image"} 
                  alt={course.title} 
                  className="w-full h-52 object-cover" 
                />

                <div className="p-6">
                  <div className="flex items-baseline mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      ETB {course.price?.toLocaleString() || 'Free'}
                    </span>
                  </div>

                  <Button className="w-full mb-3 bg-fidel-600 hover:bg-fidel-700">Enroll Now</Button>

                  <Button variant="outline" className="w-full mb-6 text-black">
                    Try Free Preview
                  </Button>

                  <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-muted-foreground" />
                      <span>Full lifetime access</span>
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
                      {course.modules?.length || 0} modules • {total} lessons • {course.totalDuration} total length
                    </div>
                  </div>

                  {course.modules?.map((module) => (
                    <div key={module._id} className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                      <button
                        className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        onClick={() => toggleModule(module._id)}
                      >
                        <div className="flex items-center">
                          {expandedModules.includes(module._id) ? (
                            <ChevronUp size={18} className="mr-2 text-muted-foreground" />
                          ) : (
                            <ChevronDown size={18} className="mr-2 text-muted-foreground" />
                          )}
                          <span className="font-medium">{module.title}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {module.lessons?.length || 0} lessons • {module.totalDuration || 'N/A'}
                        </div>
                      </button>

                      {expandedModules.includes(module._id) && (
                        <div className="bg-slate-50 dark:bg-slate-800/30 divide-y divide-slate-200 dark:divide-slate-800">
                          {module.lessons?.map((lesson) => {
                            const isVideoLesson = lesson.type === "video";
                            const hasValidVideo = isVideoLesson && lesson.video?._valid;
                            const isDisabled = isVideoLesson && !hasValidVideo;

                            return (
                              <div
                                key={lesson._id}
                                className="flex items-center p-3 pl-10 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                              >
                                {isVideoLesson ? (
                                  lesson.video?.thumbnailUrl ? (
                                    <img 
                                      src={lesson.video.thumbnailUrl} 
                                      alt={lesson.title}
                                      className="w-16 h-10 object-cover rounded mr-3"
                                      onError={(e) => {
                                        e.currentTarget.src = "https://placehold.co/64x40/3b82f6/ffffff.png?text=Video";
                                      }}
                                    />
                                  ) : (
                                    <PlayCircle size={16} className="mr-3 text-fidel-500" />
                                  )
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
                                  <div className="text-xs text-muted-foreground">{lesson.duration || 'N/A'}</div>
                                </div>

                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className={`text-fidel-500 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  onClick={() => !isDisabled && handlePreviewClick(lesson)}
                                  disabled={isDisabled || previewLoading}
                                  aria-disabled={isDisabled}
                                >
                                  {lesson.completed ? "Replay" : "Preview"}
                                  {isDisabled && (
                                    <span className="sr-only">(disabled - video not available)</span>
                                  )}
                                </Button>
                              </div>
                            );
                          })}
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
                      <span>{percentage}% complete</span>
                      <span>
                        {totalCompleted}/{total} lessons
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-fidel-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button className="w-full mb-3">Continue Learning</Button>

                  <div className="mt-6 space-y-4">
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                      <h4 className="font-medium mb-1">Next Lesson</h4>
                      {course.modules?.[0]?.lessons?.[0] ? (
                        <>
                          <div className="flex items-center text-fidel-600">
                            <PlayCircle size={16} className="mr-2" />
                            <span className="text-sm">{course.modules[0].lessons[0].title}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {course.modules[0].lessons[0].duration || 'N/A'}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">No lessons available</p>
                      )}
                    </div>

                    <div className="rounded-lg p-3 bg-fidel-50 dark:bg-fidel-900/10 border border-fidel-100 dark:border-fidel-900/20">
                      <h4 className="font-medium text-fidel-800 dark:text-fidel-200 mb-1">Get Certified</h4>
                      <p className="text-xs text-fidel-600 dark:text-fidel-300 mb-2">
                        Complete this course to earn your certification
                      </p>
                      <div className="flex items-center">
                        <Award size={16} className="text-fidel-500 mr-1" />
                        <div className="text-xs font-medium text-fidel-600">{course.title} Certificate</div>
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

                {course.whatYouWillLearn && (
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
                )}

                {course.requirements && (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                    <ul className="space-y-2">
                      {course.requirements.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight size={18} className="mr-2 text-fidel-500 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sticky top-4">
                  <h3 className="font-semibold mb-4">Course Details</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <span className="font-medium">{course.level || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{course.category || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language</span>
                      <span className="font-medium">{course.language || 'English'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-medium">
                        {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Duration</span>
                      <span className="font-medium">{course.totalDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Lessons</span>
                      <span className="font-medium">{total}</span>
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
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">About the Instructor</h3>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="text-xl font-medium">
                    {instructorName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{instructorName}</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    {course.instructor?.bio || 'Expert instructor with years of experience'}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex justify-between items-center">
              <DialogTitle>{currentPreview?.title || 'Lesson Preview'}</DialogTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setPreviewOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="p-6 pt-0">
            {currentPreview?.video?.url ? (
              <div className="rounded-lg overflow-hidden">
                <VideoPlayer 
                  url={currentPreview.video.url}
                  width="100%"
                  height="450px"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <PlayCircle size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  {currentPreview?.video ? 
                    "Video is currently unavailable. Please try again later." : 
                    "This lesson doesn't have a video component."}
                </p>
                {currentPreview?.description && (
                  <div className="mt-4 text-center">
                    <h4 className="font-medium mb-2">About this lesson</h4>
                    <p className="text-sm text-muted-foreground">
                      {currentPreview.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default CourseDetails;