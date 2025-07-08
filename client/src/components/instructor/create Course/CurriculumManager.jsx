
import { useState, useRef } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { BookOpen, ListPlus } from "lucide-react";
import ModuleEditor from "./ModuleEditor";
import LessonEditor from "./LessonEditor";
import { useCourse } from "./CourseProvider";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_UR || "http://localhost:5000/api",
  withCredentials: true,
});

const CurriculumManager = ({
  modules,
  setModules,
  selectedModule,
  setSelectedModule,
  selectedLesson,
  setSelectedLesson,
  videoUploads,
  setVideoUploads,
  uploadProgress,
  setUploadProgress,
  currentQuizQuestions,
  setCurrentQuizQuestions,
}) => {
  const { courseId, setModuleId, setLessonId } = useCourse();
  const moduleFileInputRef = useRef(null);

  const addModule = async () => {
    if (!courseId) {
      toast.error("Please create a course first.");
      return;
    }
    try {
      const moduleData = {
        title: `Module ${modules.length + 1}`,
        description: "",
        courseId,
      };
      const response = await api.post("/modules", moduleData, {
        headers: { "Content-Type": "application/json" },
      });
      const newModule = { ...response.data, lessons: [] };
      setModules([...modules, newModule]);
      setModuleId(newModule._id);
      setSelectedModule(newModule._id);
      toast.success("Module added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add module");
    }
  };

  const updateModule = async (moduleId, field, value) => {
    try {
      await api.put(`/modules/${moduleId}`, { [field]: value });
      setModules(
        modules.map((module) =>
          module._id === moduleId ? { ...module, [field]: value } : module
        )
      );
      toast.success("Module updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update module");
    }
  };

  const moveModule = (moduleId, direction) => {
    setModules((prevModules) => {
      const index = prevModules.findIndex((m) => m._id === moduleId);
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === prevModules.length - 1)
      ) {
        return prevModules;
      }
      const newModules = [...prevModules];
      const swapWith = direction === "up" ? index - 1 : index + 1;
      [newModules[index], newModules[swapWith]] = [newModules[swapWith], newModules[index]];
      return newModules;
    });
  };

  const deleteModule = async (moduleId) => {
    try {
      await api.delete(`/modules/${moduleId}`);
      setModules(modules.filter((module) => module._id !== moduleId));
      if (selectedModule === moduleId) {
        setSelectedModule(null);
        setSelectedLesson(null);
      }
      toast.success("Module deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update module");
    }
  };

  const addLesson = async (moduleId, type = "video") => {
    if (!courseId) {
      toast.error("Please create a course first.");
      return;
    }
    try {
      const response = await api.post("/lessons", {
        title: `${type === "video" ? "Video" : "Quiz"} Lesson`,
        type,
        moduleId,
        duration: type === "video" ? "0:00" : "15:00",
        content: "",
        free: false,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      const newLesson = response.data;
      setModules(
        modules.map((module) =>
          module._id === moduleId
            ? { ...module, lessons: [...(module.lessons ?? []), newLesson] }
            : module
        )
      );
      setModuleId(moduleId);
      setLessonId(newLesson._id);
      setSelectedModule(moduleId);
      setSelectedLesson(newLesson._id);
      if (type === "quiz") {
        setCurrentQuizQuestions([]);
      }
      toast.success(`${type === "video" ? "Video" : "Quiz"} lesson added`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add lesson");
    }
  };

  const updateLesson = async (moduleId, lessonId, field, value) => {
    try {
      await api.put(`/lessons/${lessonId}`, { [field]: value });
      setModules(
        modules.map((module) =>
          module._id === moduleId
            ? {
                ...module,
                lessons: (module.lessons ?? []).map((lesson) =>
                  lesson._id === lessonId
                    ? { ...lesson, [field]: value }
                    : lesson
                ),
              }
            : module
        )
      );
      toast.success("Lesson updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update lesson");
    }
  };

  const moveLesson = (moduleId, lessonId, direction) => {
    setModules((prevModules) =>
      prevModules.map((module) => {
        if (module._id !== moduleId) return module;
        const lessons = [...(module.lessons ?? [])];
        const idx = lessons.findIndex((l) => l._id === lessonId);
        if (idx === -1) return module;
        if (
          (direction === "up" && idx === 0) ||
          (direction === "down" && idx === lessons.length - 1)
        ) {
          return module;
        }
        const swapWith = direction === "up" ? idx - 1 : idx + 1;
        [lessons[idx], lessons[swapWith]] = [lessons[swapWith], lessons[idx]];
        return { ...module, lessons };
      })
    );
  };

  const deleteLesson = (moduleId, lessonId) => {
    setModules((prevModules) =>
      prevModules.map((module) => {
        if (module._id !== moduleId) return module;
        return {
          ...module,
          lessons: (module.lessons ?? []).filter(
            (lesson) => lesson._id !== lessonId
          ),
        };
      })
    );
    if (selectedModule === moduleId && selectedLesson === lessonId) {
      setSelectedLesson(null);
    }
    toast.success("Lesson deleted");
  };

  const handleVideoUpload = async (file, moduleId, lessonId) => {
    try {
      const formData = new FormData();
      formData.append("video", file);

      setUploadProgress((prev) => ({ ...prev, [lessonId]: 0 }));

      const uploadRes = await api.post("/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress((prev) => ({ ...prev, [lessonId]: percentCompleted }));
        },
      });

      const videoData = uploadRes.data;

      const assignRes = await api.put(`/media/assign/${lessonId}`, {
        videoId: videoData.id,
        videoUrl: videoData.url,
        thumbnailUrl: videoData.thumbnail,
        duration: videoData.duration,
        videoPublicId: videoData.id,
        thumbnailPublicId: videoData.thumbnail
          .split("/")
          .slice(-2)
          .join("/")
          .replace(/\.[^/.]+$/, ""),
      }, {
        headers: { "Content-Type": "application/json" },
      });

      setModules((prevModules) =>
        prevModules.map((module) => {
          if (module._id !== moduleId) return module;
          return {
            ...module,
            lessons: (module.lessons ?? []).map((lesson) =>
              lesson._id === lessonId
                ? {
                    ...lesson,
                    videoId: videoData.id,
                    videoUrl: assignRes.data.lesson.video.url,
                    thumbnailUrl: assignRes.data.lesson.video.thumbnailUrl,
                    duration: assignRes.data.lesson.duration,
                    status: "complete",
                  }
                : lesson
            ),
          };
        })
      );

      setVideoUploads((prev) => [
        ...prev,
        {
          id: videoData.id,
          name: file.name,
          thumbnail: videoData.thumbnail,
          duration: videoData.duration,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          status: "complete",
        },
      ]);

      toast.success("Video uploaded and assigned successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload video");
      setUploadProgress((prev) => ({ ...prev, [lessonId]: 0 }));
    }
  };

  const handleModuleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const sortedFiles = Array.from(files).sort((a, b) => a.name.localeCompare(b.name));
    const videoFiles = sortedFiles.filter((file) =>
      file.type.startsWith("video/") || /\.(mp4|webm|mov|avi|mkv)$/i.test(file.name)
    );

    if (videoFiles.length !== sortedFiles.length) {
      toast.warning(`${sortedFiles.length - videoFiles.length} non-video files were skipped`);
    }
    if (videoFiles.length === 0) {
      toast.error("No valid video files selected");
      return;
    }

    for (const file of videoFiles) {
      await addLesson(selectedModule, "video");
      const newLesson = modules
        .find((m) => m._id === selectedModule)
        ?.lessons?.slice(-1)[0];
      if (newLesson) {
        await handleVideoUpload(file, selectedModule, newLesson._id);
      }
    }

    event.target.value = "";
  };

  const selectLesson = (moduleId, lessonId) => {
    setSelectedModule(moduleId);
    setSelectedLesson(lessonId);
    const lesson = modules
      .find((m) => m._id === moduleId)
      ?.lessons?.find((l) => l._id === lessonId);
    if (lesson?.type === "quiz") {
      setCurrentQuizQuestions(lesson.quizQuestions || []);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Course Curriculum</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Organize your course content into modules and lessons
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            {modules.map((module, moduleIndex) => (
              <ModuleEditor
                key={module._id}
                module={module}
                moduleIndex={moduleIndex}
                updateModule={updateModule}
                moveModule={moveModule}
                deleteModule={deleteModule}
                addLesson={addLesson}
                selectLesson={selectLesson}
                selectedLesson={selectedLesson}
                onBulkUpload={() => moduleFileInputRef.current.click()}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addModule}
              className="w-full"
              disabled={!courseId}
            >
              <ListPlus size={18} className="mr-2" />
              Add Module
            </Button>
          </div>

          <div className="lg:col-span-8">
            {selectedModule !== null && selectedLesson !== null ? (
              <LessonEditor
                modules={modules}
                selectedModule={selectedModule}
                selectedLesson={selectedLesson}
                updateLesson={updateLesson}
                moveLesson={moveLesson}
                deleteLesson={deleteLesson}
                videoUploads={videoUploads}
                quizQuestions={currentQuizQuestions}
                onQuizQuestionsChange={(questions) => {
                  setCurrentQuizQuestions(questions);
                  if (selectedLesson) {
                    api.post(`/media/assign/${selectedLesson}`, {
                      quizQuestions: questions.map((q) => ({
                        question: q.question,
                        options: q.options.map((opt) => ({
                          text: opt.text,
                          isCorrect: opt.isCorrect,
                        })),
                        type: q.type || "single",
                        lesson: selectedLesson,
                      })),
                    }, {
                      headers: { "Content-Type": "application/json" },
                    }).then(() => {
                      setModules((prevModules) =>
                        prevModules.map((module) =>
                          module.lessons?.some((lesson) => lesson._id === selectedLesson)
                            ? {
                                ...module,
                                lessons: module.lessons.map((lesson) =>
                                  lesson._id === selectedLesson
                                    ? { ...lesson, quizQuestions: questions }
                                    : lesson
                                ),
                              }
                            : module
                        )
                      );
                      toast.success("Quiz questions saved successfully");
                    }).catch((error) => {
                      toast.error(error.response?.data?.message || "Failed to save quiz questions");
                    });
                    updateLesson(selectedModule, selectedLesson, "quizQuestions", questions);
                  }
                }}
                onReplaceLessonClick={(moduleId, lessonId) => {
                  // Handled in CourseBuilder
                }}
                handleVideoUpload={handleVideoUpload}
              />
            ) : (
              <div className="p-8 text-center border border-dashed rounded-lg">
                <BookOpen
                  size={40}
                  className="mx-auto mb-4 text-muted-foreground"
                />
                <h3 className="font-medium mb-2">No Lesson Selected</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Select a lesson from the module list or create a new one
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <input
        type="file"
        ref={moduleFileInputRef}
        className="hidden"
        accept="video/*"
        multiple
        onChange={handleModuleFileUpload}
      />
    </div>
  );
};

export default CurriculumManager;
