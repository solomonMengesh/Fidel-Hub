import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { CourseHeader } from "../components/course details/CourseHeader";
import { CourseContent } from "../components/course details/CourseContent";
import { CourseProgress } from "../components/course details/CourseProgress";
import { FreeVideosDialog } from "../components/course details/FreeVideosDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { formatDuration, calculateTotalDuration, calculateProgress } from "../Helper/utils";
import VideoPlayer from "@/components/video-player";
import QuizView from "../components/Quize/QuizView";
// import Button from "../components/ui/button"; // Assuming Button is imported from your UI components
import { OverviewTab } from "../components/course details/OverviewTab";
import { RatingsTab } from "../components/course details/RatingsTab";
import { InstructorTab } from "../components/course details/InstructorTab";
import { useAuth } from "../context/AuthContext";
import RelatedCourses from "../components/course details/relatedCourses";

export const CourseDetails = () => {
  const { user } = useAuth();
  const studentId = user?._id;

  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [freeVideosDialogOpen, setFreeVideosDialogOpen] = useState(false);
  const [currentFreeVideoIndex, setCurrentFreeVideoIndex] = useState(0);

 
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

  const freeVideoLessons = useMemo(() => {
    if (!course?.modules) return [];
    
    return course.modules.flatMap(module => 
      module.lessons?.filter(lesson => 
        lesson.free && lesson.type === "video" && lesson.video?._valid
      ) || []
    );
  }, [course]);

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

  const handleTryFreePreview = () => {
    if (freeVideoLessons.length > 0) {
      setCurrentFreeVideoIndex(0);
      setFreeVideosDialogOpen(true);
    }
  };

  const handleNextFreeVideo = () => {
    setCurrentFreeVideoIndex(prev => 
      prev < freeVideoLessons.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevFreeVideo = () => {
    setCurrentFreeVideoIndex(prev => 
      prev > 0 ? prev - 1 : freeVideoLessons.length - 1
    );
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
          {/* <Button onClick={() => window.location.reload()}>Try Again</Button> */}
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

  const instructorName = typeof course.instructor === 'object' 
    ? course.instructor.name 
    : course.instructor || 'Unknown Instructor';

  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-950">
      <CourseHeader 
        course={course}
        instructorName={instructorName}
        total={total}
        totalDuration={totalDuration}
        onTryFreePreview={handleTryFreePreview}
        freeVideoLessons={freeVideoLessons}
      />

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
            <CourseContent 
              modules={course.modules}
              expandedModules={expandedModules}
              toggleModule={toggleModule}
              handlePreviewClick={handlePreviewClick}
              previewLoading={previewLoading}
              total={total}
              totalDuration={totalDuration}
              VideoPlayer={VideoPlayer}
              QuizView={QuizView}
              courseId={courseId}
              studentId={studentId}
            />


              <CourseProgress 
                percentage={percentage}
                totalCompleted={totalCompleted}
                total={total}
                course={course}
                courseId={courseId}
                studentId={studentId}
              />
            </div>
            <div className="mt-12">
    <RelatedCourses courseId={courseId} course={course}  />
  </div>
          </TabsContent>

          <TabsContent value="overview">
          <OverviewTab course={course} total={total} />
        </TabsContent>

        <TabsContent value="reviews">
          <RatingsTab
           courseId={courseId}
          />
        </TabsContent>

        <TabsContent value="instructor">
          <InstructorTab 
          courseId={courseId}
          studentId={studentId}
          />
        </TabsContent>
          {/* Other tabs would go here */}
        </Tabs>
      </div>

      <FreeVideosDialog
        open={freeVideosDialogOpen}
        onOpenChange={setFreeVideosDialogOpen}
        freeVideoLessons={freeVideoLessons}
        currentFreeVideoIndex={currentFreeVideoIndex}
        onNext={handleNextFreeVideo}
        onPrev={handlePrevFreeVideo}
      />

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default CourseDetails;
