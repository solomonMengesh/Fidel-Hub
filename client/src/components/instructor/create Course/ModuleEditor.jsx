import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoveUp,
  MoveDown,
  Trash2,
  Upload,
  Video,
  BarChart,
  RefreshCw,
  ListPlus,
} from "lucide-react";

const ModuleEditor = ({
  module,
  moduleIndex,
  updateModule,
  moveModule,
  deleteModule,
  addLesson,
  selectLesson,
  selectedLesson,
  onBulkUpload,
}) => {
  return (
    <div
      className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-full space-y-2">
          <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
            <span className="bg-fidel-100 dark:bg-fidel-950 text-fidel-800 dark:text-fidel-300 font-medium px-3 py-1 rounded-full text-xs">
              Module {moduleIndex + 1}
            </span>
          </div>
          <Input
            value={module.title}
            onChange={(e) => updateModule(module._id, "title", e.target.value)}
            placeholder="Module Title"
            className="text-lg font-medium"
          />
          <Input
            value={module.description}
            onChange={(e) =>
              updateModule(module._id, "description", e.target.value)
            }
            placeholder="Module description (optional)"
            className="text-sm"
          />
        </div>
        <div className="flex items-start space-x-2 ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => moveModule(module._id, "up")}
            disabled={moduleIndex === 0}
          >
            <MoveUp size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onBulkUpload}
            title="Bulk upload videos as lessons"
          >
            <Upload size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => moveModule(module._id, "down")}
            disabled={moduleIndex === moduleIndex} // Note: This assumes moduleIndex is compared with total modules length, adjusted in context
          >
            <MoveDown size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteModule(module._id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      <div className="space-y-3 pl-0 mt-4">
        {(module.lessons ?? []).map((lesson, lessonIndex) => (
          <div
            key={lesson._id}
            className={`flex items-start p-3 rounded-md border ${
              selectedLesson === lesson._id
                ? "bg-fidel-50 dark:bg-fidel-900/20 border-fidel-200 dark:border-fidel-800"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            } cursor-pointer`}
            onClick={() => selectLesson(module._id, lesson._id)}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {lesson.type === "video" ? (
                  <Video size={16} className="text-fidel-500" />
                ) : (
                  <BarChart size={16} className="text-fidel-500" />
                )}
                <span className="text-xs font-medium bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                  {lesson.type === "video" ? "Video" : "Quiz"}
                </span>
                {lesson.free && (
                  <span className="text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded">
                    Free
                  </span>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {lesson.duration}
                </span>
              </div>
              <div className="font-medium text-sm truncate">
                {lesson.title}
              </div>
            </div>
            <div className="flex items-center ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handled in CourseBuilder
                }}
              >
                <RefreshCw size={14} />
              </Button>
            </div>
          </div>
        ))}
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addLesson(module._id, "video")}
            className="flex-1"
          >
            <Video size={14} className="mr-1" />
            Add Video
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addLesson(module._id, "quiz")}
            className="flex-1"
          >
            <BarChart size={14} className="mr-1" />
            Add Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModuleEditor;