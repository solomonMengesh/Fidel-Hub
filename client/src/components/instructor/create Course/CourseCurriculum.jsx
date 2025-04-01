import React, { useState, useRef } from "react";
import { Button, Input, Progress } from "@/components/ui";
import { MoveUp, MoveDown, Trash2, Video, BarChart, Upload, PlayCircle } from "lucide-react";
import LessonEditor from "./LessonEditor";

const CourseCurriculum = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [videoUploads, setVideoUploads] = useState([]);

  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  const addModule = () => {
    const newModule = { id: Date.now(), title: "", description: "", lessons: [] };
    setModules([...modules, newModule]);
  };

  const updateModule = (id, key, value) => {
    setModules(modules.map(m => (m.id === id ? { ...m, [key]: value } : m)));
  };

  const deleteModule = (id) => {
    setModules(modules.filter(m => m.id !== id));
  };

  const moveModule = (id, direction) => {
    const index = modules.findIndex(m => m.id === id);
    if ((direction === "up" && index > 0) || (direction === "down" && index < modules.length - 1)) {
      const updatedModules = [...modules];
      const temp = updatedModules[index];
      updatedModules[index] = updatedModules[index + (direction === "up" ? -1 : 1)];
      updatedModules[index + (direction === "up" ? -1 : 1)] = temp;
      setModules(updatedModules);
    }
  };

  const addLesson = (moduleId, type) => {
    const newLesson = { id: Date.now(), title: "", type, duration: "", content: "" };
    setModules(
      modules.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m)
    );
  };

  const selectLesson = (moduleId, lessonId) => {
    setSelectedModule(moduleId);
    setSelectedLesson(lessonId);
  };

  const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files);
    const uploadedVideos = files.map(file => ({
      id: Date.now(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      status: "complete",
      thumbnail: "video_thumbnail.png", // Placeholder thumbnail
      duration: "10:00"
    }));
    setVideoUploads([...videoUploads, ...uploadedVideos]);
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium mb-4">Course Curriculum</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Organize your course content into modules and lessons
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          {modules.map((module, moduleIndex) => (
            <div key={module.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
              <div className="flex justify-between">
                <Input value={module.title} onChange={(e) => updateModule(module.id, "title", e.target.value)} placeholder="Module Title" className="text-lg font-medium" />
                <Button variant="ghost" size="icon" onClick={() => deleteModule(module.id)}>
                  <Trash2 size={18} />
                </Button>
              </div>
              <Input value={module.description} onChange={(e) => updateModule(module.id, "description", e.target.value)} placeholder="Module description" className="text-sm" />
              <Button variant="outline" size="sm" onClick={() => addLesson(module.id, "video")}>
                <Video size={14} className="mr-1" /> Add Video
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addModule} className="w-full">
            Add Module
          </Button>
        </div>

        <div className="lg:col-span-8">
          {selectedModule !== null && selectedLesson !== null ? (
            <LessonEditor
              modules={modules}
              selectedModule={selectedModule}
              selectedLesson={selectedLesson}
              updateLesson={(modId, lessonId, key, value) => {
                setModules(modules.map(m => m.id === modId ? {
                  ...m,
                  lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [key]: value } : l)
                } : m));
              }}
            />
          ) : (
            <div className="p-8 text-center border border-dashed rounded-lg">
              <h3 className="font-medium mb-2">No Lesson Selected</h3>
              <p className="text-sm text-muted-foreground mb-6">Select a lesson from the module list or create a new one</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 border border-dashed rounded-lg">
        <h4 className="font-medium mb-3">Bulk Video Upload</h4>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-slate-50 hover:bg-slate-100">
          <Upload className="w-8 h-8 mb-3 text-slate-400" />
          <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
          <input ref={fileInputRef} type="file" className="hidden" accept="video/mp4,video/mov,video/webm" multiple onChange={handleVideoUpload} />
        </label>
      </div>
    </div>
  );
};

export default CourseCurriculum;
