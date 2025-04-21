import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  X,
  PlayCircle,
  ChevronUp,
  ChevronDown,
  Lock,
  Check,
  FileText,
  BarChart,
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

  useEffect(() => {
    if (studentId && courseId) {
      axios
        .get(`/api/enrollments/${studentId}/${courseId}`)
        .then((res) => {
          console.log("Enrollment response:", res.data);
          setHasAccess(res.data.access === true); // <- fix applied here
        })
        .catch((err) => {
          console.error("Enrollment check failed", err);
          setHasAccess(false);
        });
    }
  }, [studentId, courseId]);

  let totalLessons = 0;
  let totalDurationCalculated = 0;

  modules?.forEach((module) => {
    module.lessons?.forEach((lesson) => {
      const durationStr = lesson.duration || "0";
      const durationParts = durationStr.split(":");
      let hours = 0,
        minutes = 0;

      if (durationParts.length === 2) {
        hours = parseInt(durationParts[0], 10) || 0;
        minutes = parseInt(durationParts[1], 10) || 0;
      } else if (durationParts.length === 1) {
        minutes = parseInt(durationParts[0], 10) || 0;
      }

      totalDurationCalculated += hours * 60 + minutes;
      totalLessons += 1;
    });
  });

  const totalHours = Math.floor(totalDurationCalculated / 60);
  const totalMinutes = totalDurationCalculated % 60;

  const formattedTotalDuration =
    totalDurationCalculated && !isNaN(totalDurationCalculated)
      ? `${totalHours}:${totalMinutes}`
      : "0:0";

  const openPreviewDialog = (lesson) => {
    setCurrentPreview(lesson);
    setPreviewOpen(true);
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

        {modules?.map((module) => (
          <ModuleSection
            key={module._id}
            module={module}
            expandedModules={expandedModules}
            toggleModule={toggleModule}
            handlePreviewClick={openPreviewDialog}
            previewLoading={previewLoading}
            hasAccess={hasAccess}
          />
        ))}
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
                onComplete={() => setPreviewOpen(false)}
              />
            ) : currentPreview?.video?.url ? (
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
                  {currentPreview?.video
                    ? "Video is currently unavailable. Please try again later."
                    : "This lesson doesn't have a video component."}
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
}) => (
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
      />
    )}
  </div>
);

const ModuleLessons = ({
  module,
  handlePreviewClick,
  previewLoading,
  hasAccess,
}) => (
  <div className="bg-slate-50 dark:bg-slate-800/30 divide-y divide-slate-200 dark:divide-slate-800">
    {module.lessons?.map((lesson) => {
      const isVideoLesson = lesson.type === "video";
      const isQuizLesson = lesson.type === "quiz";
      const hasValidVideo = isVideoLesson && lesson.video?._valid;
      const isDisabled =
        (isVideoLesson && !hasValidVideo) || (!lesson.free && !hasAccess);

      return (
        <div
          key={lesson._id}
          className={`flex items-center p-3 pl-10 hover:bg-slate-100 dark:hover:bg-slate-800/50 ${
            isDisabled ? "opacity-75" : ""
          }`}
        >
          <LessonIcon
            lesson={lesson}
            isVideoLesson={isVideoLesson}
            isQuizLesson={isQuizLesson}
            hasAccess={hasAccess} // Add access check here
          />

          <div className="flex-1">
            <div className="flex items-center">
              <span className={`${lesson.completed ? "text-muted-foreground" : ""}`}>
                {lesson.title}
                {!lesson.free && !hasAccess && (
                  <span className="ml-2 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    Premium
                  </span>
                )}
              </span>
              {lesson.completed && (
                <Check size={16} className="ml-2 text-green-500" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {lesson.duration || "N/A"}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={`text-fidel-500 ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !isDisabled && handlePreviewClick(lesson)}
            disabled={isDisabled || previewLoading}
            aria-disabled={isDisabled}
          >
            {lesson.completed ? "Replay" : "Preview"}
          </Button>
        </div>
      );
    })}
  </div>
);

const LessonIcon = ({ lesson, isVideoLesson, isQuizLesson, hasAccess }) => {
  if (!hasAccess)
    return <Lock size={16} className="mr-3 text-muted-foreground" />; // Hide lock if access is granted

  if (isVideoLesson) {
    return lesson.video?.thumbnailUrl ? (
      <img
        src={lesson.video.thumbnailUrl}
        alt={lesson.title}
        className="w-16 h-10 object-cover rounded mr-3"
        onError={(e) => {
          e.currentTarget.src =
            "https://placehold.co/64x40/3b82f6/ffffff.png?text=Video";
        }}
      />
    ) : (
      <PlayCircle size={16} className="mr-3 text-fidel-500" />
    );
  }

  if (lesson.type === "reading")
    return <FileText size={16} className="mr-3 text-fidel-500" />;
  if (isQuizLesson) return <BarChart size={16} className="mr-3 text-fidel-500" />;

  return <PlayCircle size={16} className="mr-3 text-fidel-500" />;
};
