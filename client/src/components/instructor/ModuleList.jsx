import { useState, useRef } from 'react';
import { Plus, Trash2, MoveDown, MoveUp, Video, BarChart, Upload, ListPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import axios from 'axios';

// Utility function to format file sizes
const formatFileSize = (sizeInBytes) => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

// Utility function to generate a human-readable title from filename
const generateTitleFromFilename = (filename) => {
  const withoutExt = filename.replace(/\.[^/.]+$/, "");
  const withSpaces = withoutExt.replace(/[-_]/g, " ");
  return withSpaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const ModuleList = ({
  modules = [],
  selectedModule,
  selectedLesson,
  deleteModule,
  updateModule,
  moveModule,
  addLesson,
  selectLesson,
  setVideoUploads = () => {},
  onAddModule,
}) => {
  const moduleFileInputRef = useRef(null);
  const [isBulkUploading, setIsBulkUploading] = useState(false);

  const handleModuleBulkUpload = (moduleId) => {
    if (moduleFileInputRef.current) {
      moduleFileInputRef.current.dataset.moduleId = moduleId.toString();
      moduleFileInputRef.current.click();
    }
  };

  const addNewModule = async () => {
    try {
      const courseId = localStorage.getItem("createdCourseId");

      if (!courseId) {
        toast.error("Course ID not found. Please create a course first.");
        return;
      }

      const newModule = { title: "Introduction", description: "", lessons: [] };
      const response = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/modules`,
        newModule
      );

      if (response.data && response.data._id) {
        localStorage.setItem("createdModuleId", response.data._id);
        toast.success("Module added successfully!");
        onAddModule({ ...response.data, lessons: response.data.lessons || [] });
      } else {
        throw new Error("Invalid API response: missing _id");
      }
    } catch (error) {
      toast.error("Error adding module.");
      console.error("Error adding module:", error);
    }
  };

  const handleModuleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const moduleId = moduleFileInputRef.current?.dataset.moduleId;
    if (!moduleId) return;

    setIsBulkUploading(true);
    toast.info(`Processing ${files.length} videos...`);

    try {
      const sortedFiles = Array.from(files).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
      );

      const videoFiles = sortedFiles.filter(
        (file) =>
          file.type.startsWith("video/") ||
          ["mp4", "webm", "mov", "avi", "mkv"].some((ext) =>
            file.name.toLowerCase().endsWith(`.${ext}`)
          )
      );

      if (videoFiles.length !== sortedFiles.length) {
        toast.warning(
          `${sortedFiles.length - videoFiles.length} non-video files were skipped`
        );
      }

      if (videoFiles.length === 0) {
        toast.error("No valid video files selected");
        return;
      }

      for (let i = 0; i < videoFiles.length; i++) {
        const file = videoFiles[i];
        await processVideoFile(file, moduleId, i);
      }

      toast.success(`Successfully added ${videoFiles.length} videos as lessons`);
    } catch (error) {
      console.error("Error during bulk upload:", error);
      toast.error("An error occurred during bulk upload");
    } finally {
      setIsBulkUploading(false);
      if (moduleFileInputRef.current) {
        moduleFileInputRef.current.value = "";
      }
    }
  };

  const processVideoFile = (file, moduleId, index) => {
    return new Promise((resolve) => {
      const module = modules.find((m) => m._id === moduleId || m.id === moduleId);
      if (!module) return resolve();

      const newLessonId =
        module.lessons.length > 0
          ? Math.max(...module.lessons.map((l) => l.id)) + 1 + index
          : moduleId * 100 + 1 + index;

      const video = document.createElement("video");
      video.preload = "metadata";
      const videoUrl = URL.createObjectURL(file);
      video.src = videoUrl;

      const cleanup = () => {
        URL.revokeObjectURL(videoUrl);
        video.remove();
      };

      video.onloadedmetadata = () => {
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        const duration = `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;

        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 180;

        video.currentTime = Math.min(1, video.duration / 4);

        video.onseeked = () => {
          try {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumbnailUrl = canvas.toDataURL("image/jpeg");

              const videoPreviewId = `video-${Date.now()}-${index}`;
              const formattedName = generateTitleFromFilename(file.name);

              setVideoUploads((prev) => [
                ...prev,
                {
                  id: videoPreviewId,
                  name: formattedName,
                  size: formatFileSize(file.size),
                  duration: duration,
                  thumbnail: thumbnailUrl,
                  status: "complete",
                  file: file,
                  blobUrl: videoUrl,
                },
              ]);

              const newLesson = {
                id: newLessonId,
                title: formattedName,
                type: "video",
                duration: duration,
                content: "",
                videoId: videoPreviewId,
                free: false,
                order: module.lessons.length + index + 1,
              };

              addLesson(moduleId, newLesson);
              resolve();
            }
          } catch (error) {
            console.error("Error processing video:", error);
            resolve();
          } finally {
            cleanup();
          }
        };

        video.onerror = () => {
          console.error("Error loading video metadata");
          cleanup();
          resolve();
        };
      };
    });
  };

  return (
    <div className="space-y-4">
      {modules.map((module, moduleIndex) => (
        <div
          key={module._id || module.id}
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
                onChange={(e) => updateModule(module._id || module.id, "title", e.target.value)}
                placeholder="Module Title"
                className="text-lg font-medium"
              />
              <Input
                value={module.description}
                onChange={(e) =>
                  updateModule(module._id || module.id, "description", e.target.value)
                }
                placeholder="Module de:"
                className="text-sm"
              />
            </div>
            <div className="flex items-start space-x-2 ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveModule(module._id || module.id, "up")}
                disabled={moduleIndex === 0}
              >
                <MoveUp size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleModuleBulkUpload(module._id || module.id)}
                title="Bulk upload videos as lessons"
                disabled={isBulkUploading}
              >
                <Upload size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveModule(module._id || module.id, "down")}
                disabled={moduleIndex === modules.length - 1}
              >
                <MoveDown size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteModule(module._id || module.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>

          <div className="space-y-3 pl-0 mt-4">
            {module.lessons?.map((lesson, lessonIndex) => (
              <div
                key={lesson.id}
                className={`flex items-start p-3 rounded-md border 
                  ${
                    selectedModule === (module._id || module.id) &&
                    selectedLesson === lesson.id
                      ? "bg-fidel-50 dark:bg-fidel-900/20 border-fidel-200 dark:border-fidel-800"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  } cursor-pointer`}
                onClick={() => selectLesson(module._id || module.id, lesson.id)}
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
                  <div className="font-medium text-sm truncate">{lesson.title}</div>
                </div>
              </div>
            ))}

            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addLesson(module._id || module.id, "video")}
                className="flex-1"
                disabled={isBulkUploading}
              >
                <Video size={14} className="mr-1" />
                Add Lesson
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addLesson(module._id || module.id, "quiz")}
                className="flex-1"
                disabled={isBulkUploading}
              >
                <BarChart size={14} className="mr-1" />
                Add Quiz
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={addNewModule}
          className="bg-green-100 text-green-800"
        >
          <Plus size={16} className="mr-2" />
          Add Module
        </Button>
      </div>

      <input
        type="file"
        ref={moduleFileInputRef}
        className="hidden"
        accept="video/*,.mp4,.webm,.mov,.avi,.mkv"
        multiple
        onChange={handleModuleFileUpload}
        disabled={isBulkUploading}
      />
    </div>
  );
};

export default ModuleList;