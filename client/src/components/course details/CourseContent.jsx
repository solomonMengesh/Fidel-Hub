import { ChevronDown, ChevronUp, PlayCircle, FileText, BarChart, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CourseContent = ({ 
  modules, 
  expandedModules, 
  toggleModule, 
  handlePreviewClick,
  previewLoading,
  freePreviewMode,
  total,
  totalDuration
}) => {
  return (
    <div className="lg:col-span-2">
      <div className="mb-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold">
            {freePreviewMode ? "Free Preview Content" : "Course Content"}
          </h3>
          <div className="text-sm text-muted-foreground mt-1">
            {modules?.length || 0} modules • {total} lessons • {totalDuration} total length
          </div>
        </div>

        {modules?.map((module) => (
          <ModuleSection 
            key={module._id}
            module={module}
            expandedModules={expandedModules}
            toggleModule={toggleModule}
            handlePreviewClick={handlePreviewClick}
            previewLoading={previewLoading}
          />
        ))}
      </div>
    </div>
  );
};

const ModuleSection = ({
  module,
  expandedModules,
  toggleModule,
  handlePreviewClick,
  previewLoading
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
          {module.lessons?.length || 0} lessons • {module.totalDuration || 'N/A'}
        </div>
      </button>

      {expandedModules.includes(module._id) && (
        <ModuleLessons 
          module={module}
          handlePreviewClick={handlePreviewClick}
          previewLoading={previewLoading}
        />
      )}
    </div>
  );
};

const ModuleLessons = ({ module, handlePreviewClick, previewLoading }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/30 divide-y divide-slate-200 dark:divide-slate-800">
      {module.lessons?.map((lesson) => {
        const isVideoLesson = lesson.type === "video";
        const isQuizLesson = lesson.type === "quiz";
        const hasValidVideo = isVideoLesson && lesson.video?._valid;
        const isDisabled = isVideoLesson && !hasValidVideo;

        return (
          <div
            key={lesson._id}
            className={`flex items-center p-3 pl-10 hover:bg-slate-100 dark:hover:bg-slate-800/50 ${
              !lesson.free ? 'opacity-75' : ''
            }`}
          >
            <LessonIcon 
              lesson={lesson} 
              isVideoLesson={isVideoLesson} 
              isQuizLesson={isQuizLesson} 
            />
            
            <div className="flex-1">
              <div className="flex items-center">
                <span className={`${lesson.completed ? "text-muted-foreground" : ""}`}>
                  {lesson.title}
                  {!lesson.free && (
                    <span className="ml-2 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      Premium
                    </span>
                  )}
                </span>
                {lesson.completed && <Check size={16} className="ml-2 text-green-500" />}
              </div>
              <div className="text-xs text-muted-foreground">{lesson.duration || 'N/A'}</div>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-fidel-500 ${
                isDisabled || !lesson.free ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => !isDisabled && lesson.free && handlePreviewClick(lesson)}
              disabled={isDisabled || !lesson.free || previewLoading}
              aria-disabled={isDisabled || !lesson.free}
            >
              {lesson.completed ? "Replay" : "Preview"}
              {(isDisabled || !lesson.free) && (
                <span className="sr-only">(disabled - {isDisabled ? 'video not available' : 'premium content'})</span>
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

const LessonIcon = ({ lesson, isVideoLesson, isQuizLesson }) => {
  if (!lesson.free) return <Lock size={16} className="mr-3 text-muted-foreground" />;
  
  if (isVideoLesson) {
    return lesson.video?.thumbnailUrl ? (
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
    );
  }
  
  if (lesson.type === "reading") return <FileText size={16} className="mr-3 text-fidel-500" />;
  if (isQuizLesson) return <BarChart size={16} className="mr-3 text-fidel-500" />;
  
  return <PlayCircle size={16} className="mr-3 text-fidel-500" />;
};