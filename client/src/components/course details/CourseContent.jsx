import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
  Lock,
  Check,
  BarChart,
  Loader2,
  PlayCircle,
} from "lucide-react";
import VideoPlayer from "@/components/video-player";
import QuizView from "../Quize/QuizView";
import axios from "axios";

export const CourseContent = ({
  modules,
  expandedModules,
  toggleModule,
  previewLoading,
  freePreviewMode,
  courseId,
  studentId,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!studentId || !courseId) {
        setLoadingProgress(false);
        return;
      }

      try {
        const enrollmentRes = await axios.get(
          `/api/enrollments/${studentId}/${courseId}`
        );
        setHasAccess(enrollmentRes.data.access === true);

        const progressRes = await axios.get(
          `/api/progress/${studentId}/${courseId}/completedLessons`,
          {
            validateStatus: (status) => status === 200 || status === 304 || status === 404,
          }
        );

        if (progressRes.status === 200) {
          const completed = Array.isArray(progressRes.data?.completedLessons)
            ? progressRes.data.completedLessons.map(id => id.toString())
            : [];
          setCompletedLessons(completed);
        } else if (progressRes.status === 404) {
          setCompletedLessons([]);
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError("Failed to load progress data");
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgressData();
  }, [studentId, courseId]);

  const { totalLessons, formattedTotalDuration } = React.useMemo(() => {
    let count = 0;
    let totalMinutes = 0;

    modules?.forEach((module) => {
      module.lessons?.forEach((lesson) => {
        count++;
        const [hours = 0, mins = 0] = (lesson.duration || "0:0").split(":").map(Number);
        totalMinutes += hours * 60 + mins;
      });
    });

    return {
      totalLessons: count,
      formattedTotalDuration: `${Math.floor(totalMinutes / 60)}:${String(totalMinutes % 60).padStart(2, '0')}`,
    };
  }, [modules]);

  const openPreviewDialog = (lesson) => {
    setCurrentPreview(lesson);
    setPreviewOpen(true);
  };

  const isLessonCompleted = (lessonId) => {
    if (!lessonId || loadingProgress || !completedLessons) return false;
    return completedLessons.includes(lessonId.toString());
  };

  const refreshCompletedLessons = async () => {
    try {
      const res = await axios.get(
        `/api/progress/${studentId}/${courseId}/completedLessons`,
        {
          validateStatus: (status) => status === 200 || status === 304 || status === 404,
        }
      );
      
      if (res.status === 200 && Array.isArray(res.data?.completedLessons)) {
        setCompletedLessons(res.data.completedLessons.map(id => id.toString()));
      } else if (res.status === 404) {
        setCompletedLessons([]);
      }
    } catch (err) {
      console.error("Failed to refresh completed lessons:", err);
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="mb-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold">
            {freePreviewMode ? "Free Preview Content" : "Course Content"}
          </h3>
          <div className="text-sm text-muted-foreground mt-1">
            {modules?.length || 0} modules • {totalLessons} lessons •{" "}
            {formattedTotalDuration} total length
          </div>
        </div>

        {error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : loadingProgress ? (
          <div className="p-4 flex justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          modules?.map((module) => (
            <ModuleSection
              key={module._id}
              module={module}
              expandedModules={expandedModules}
              toggleModule={toggleModule}
              handlePreviewClick={openPreviewDialog}
              previewLoading={previewLoading}
              hasAccess={hasAccess}
              isLessonCompleted={isLessonCompleted}
            />
          ))
        )}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex justify-between items-center">
              <DialogTitle>
                {currentPreview?.title || "Lesson Preview"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="p-6 pt-0">
            {currentPreview?.type === "quiz" ? (
              <QuizView
                lesson_id={currentPreview._id}
                courseId={courseId}
                studentId={studentId}
                onComplete={() => {
                  setPreviewOpen(false);
                  refreshCompletedLessons();
                }}
              />
            ) : currentPreview?.video?.url ? (
              <div className="rounded-lg overflow-hidden">
                <VideoPlayer
                  lessonId={currentPreview._id}
                  url={currentPreview.video.url}
                  width="100%"
                  height="450px"
                  courseId={courseId}
                  studentId={studentId}
                  onComplete={() => {
                    refreshCompletedLessons();
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <PlayCircle size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  {currentPreview?.video
                    ? "Video is currently unavailable. Please try again later."
                    : "This lesson doesn't have a video component."}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ModuleSection = ({
  module,
  expandedModules,
  toggleModule,
  handlePreviewClick,
  previewLoading,
  hasAccess,
  isLessonCompleted,
}) => {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
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
          {module.lessons?.length || 0} lessons • {module.totalDuration || "N/A"}
        </div>
      </button>

      {expandedModules.includes(module._id) && (
        <ModuleLessons
          module={module}
          handlePreviewClick={handlePreviewClick}
          previewLoading={previewLoading}
          hasAccess={hasAccess}
          isLessonCompleted={isLessonCompleted}
        />
      )}
    </div>
  );
};

const ModuleLessons = ({
  module,
  handlePreviewClick,
  previewLoading,
  hasAccess,
  isLessonCompleted,
}) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/30 divide-y divide-slate-200 dark:divide-slate-800">
      {module.lessons?.map((lesson) => {
        const isVideo = lesson.type === "video";
        const isQuiz = lesson.type === "quiz";
        const hasVideo = isVideo && lesson.video?.url;
        const hasThumbnail = isVideo && lesson.video?.thumbnailUrl;
        const isLocked = (!lesson.free && !hasAccess);
        const completed = isLessonCompleted(lesson._id);

        return (
          <div key={lesson._id} className="flex justify-between items-center py-4 px-6">
            <div className="flex items-center gap-3">
              {/* Status Indicator */}
              {completed ? (
                <Check size={20} className="text-green-500 shrink-0" />
              ) : isLocked ? (
                <Lock size={20} className="text-slate-500 shrink-0" />
              ) : isQuiz ? (
                <BarChart size={20} className="text-primary-500 shrink-0" />
              ) : null}
              
              {/* Thumbnail - Only show if not locked */}
              {hasThumbnail && !isLocked && (
                <div className="w-16 h-10 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img
                    src={lesson.video.thumbnailUrl}
                    alt={`Thumbnail for ${lesson.title}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              
              {/* Lesson Title */}
              <span className={`font-medium ${completed ? "text-muted-foreground" : ""}`}>
                {isLocked && (
                  <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs px-2 py-0.5 rounded mr-2">
                    Premium
                  </span>
                )}
                {lesson.title}
                {lesson.duration && !isLocked && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {lesson.duration}
                  </span>
                )}
              </span>
            </div>

            <Button
              size="sm"
              variant={completed ? "secondary" : "outline"}
              disabled={isLocked || previewLoading}
              className="ml-4"
              onClick={() => handlePreviewClick(lesson)}
            >
              {previewLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isQuiz ? (
                <>
                  <BarChart size={16} className="mr-1" />
                  {completed ? "Retake Quiz" : "Start Quiz"}
                </>
              ) : completed ? (
                <>
                  <PlayCircle size={16} className="mr-1" />
                  Replay
                </>
              ) : (
                <>
                  <PlayCircle size={16} className="mr-1" />
                  Preview
                </>
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
};