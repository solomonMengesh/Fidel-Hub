
import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, BookOpen, UploadCloud } from "lucide-react";
import CourseProvider, { useCourse } from "./CourseProvider";
import CourseForm from "./CourseForm";
import CurriculumManager from "./CurriculumManager";
import PublishTab from "./PublishTab";
import ReplaceLessonDialog from "./ReplaceLessonDialog";
import { toast } from "sonner";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URk || "http://localhost:5000/api",
  withCredentials: true,
});

const InnerCourseBuilder = ({
  activeTab,
  setActiveTab,
  modules,
  setModules,
  selectedModule,
  setSelectedModule,
  selectedLesson,
  setSelectedLesson,
  currentQuizQuestions,
  setCurrentQuizQuestions,
  showReplaceDialog,
  setShowReplaceDialog,
  lessonToReplace,
  setLessonToReplace,
  videoUploads,
  setVideoUploads,
  uploadProgress,
  setUploadProgress,
  isPublished,
  setIsPublished,
  onSave,
  fileInputRef,
}) => {
  const { courseId, setCourseId } = useCourse();

  const handleReplaceLessonWithVideo = () => {
    if (!lessonToReplace) return;
    if (fileInputRef.current) {
      fileInputRef.current.dataset.replace = JSON.stringify(lessonToReplace);
      fileInputRef.current.click();
    }
    setShowReplaceDialog(false);
    toast.success("Replace with video triggered");
  };

  const handleReplaceWithQuiz = () => {
    if (!lessonToReplace) return;
    const { moduleId, lessonId } = lessonToReplace;
    api.put(`/lessons/${lessonId}`, { type: "quiz" }).then(() => {
      setModules((prevModules) =>
        prevModules.map((module) =>
          module._id === moduleId
            ? {
                ...module,
                lessons: (module.lessons ?? []).map((lesson) =>
                  lesson._id === lessonId
                    ? { ...lesson, type: "quiz", videoId: undefined, duration: "15:00", quizQuestions: [] }
                    : lesson
                ),
              }
            : module
        )
      );
      setSelectedModule(moduleId);
      setSelectedLesson(lessonId);
      setCurrentQuizQuestions([]);
      setShowReplaceDialog(false);
      toast.success("Lesson converted to quiz");
    }).catch((error) => {
      toast.error(error.response?.data?.message || "Failed to update lesson");
    });
  };

  const handleReplaceLessonFileUpload = async (event) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const replaceData = event.target.dataset.replace;
    if (!replaceData) return;
    try {
      const { moduleId, lessonId } = JSON.parse(replaceData);
      const file = event.target.files[0];
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        return;
      }
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
                    type: "video",
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
      toast.error(error.response?.data?.message || "Failed to replace lesson");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <TabsList className="grid grid-cols-3 mb-1">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Book size={16} />
              <span>Basic Details</span>
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>Curriculum</span>
            </TabsTrigger>
            <TabsTrigger value="publish" className="flex items-center gap-2">
              <UploadCloud size={16} />
              <span>Publish</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="p-6">
          <CourseForm
            courseId={courseId}
            setCourseId={setCourseId}
            setActiveTab={setActiveTab}
            setModules={setModules}
          />
        </TabsContent>

        <TabsContent value="curriculum" className="p-6">
          <CurriculumManager
            modules={modules}
            setModules={setModules}
            selectedModule={selectedModule}
            setSelectedModule={setSelectedModule}
            selectedLesson={selectedLesson}
            setSelectedLesson={setSelectedLesson}
            videoUploads={videoUploads}
            setVideoUploads={setVideoUploads}
            uploadProgress={uploadProgress}
            setUploadProgress={setUploadProgress}
            currentQuizQuestions={currentQuizQuestions}
            setCurrentQuizQuestions={setCurrentQuizQuestions}
          />
        </TabsContent>

        <TabsContent value="publish" className="p-6">
          <PublishTab
            courseId={courseId}
            modules={modules}
            onSave={onSave}
            isPublished={isPublished}
            setIsPublished={setIsPublished}
          />
        </TabsContent>
      </Tabs>

      <ReplaceLessonDialog
        open={showReplaceDialog}
        onOpenChange={setShowReplaceDialog}
        handleReplaceLessonWithVideo={handleReplaceLessonWithVideo}
        handleReplaceWithQuiz={handleReplaceWithQuiz}
      />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="video/*"
        onChange={handleReplaceLessonFileUpload}
      />
    </div>
  );
};

const CourseBuilder = ({ onSave }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState([]);
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [lessonToReplace, setLessonToReplace] = useState(null);
  const [videoUploads, setVideoUploads] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isPublished, setIsPublished] = useState(false);

  const fileInputRef = useRef(null);

  return (
    <CourseProvider>
      <InnerCourseBuilder
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        modules={modules}
        setModules={setModules}
        selectedModule={selectedModule}
        setSelectedModule={setSelectedModule}
        selectedLesson={selectedLesson}
        setSelectedLesson={setSelectedLesson}
        currentQuizQuestions={currentQuizQuestions}
        setCurrentQuizQuestions={setCurrentQuizQuestions}
        showReplaceDialog={showReplaceDialog}
        setShowReplaceDialog={setShowReplaceDialog}
        lessonToReplace={lessonToReplace}
        setLessonToReplace={setLessonToReplace}
        videoUploads={videoUploads}
        setVideoUploads={setVideoUploads}
        uploadProgress={uploadProgress}
        setUploadProgress={setUploadProgress}
        isPublished={isPublished}
        setIsPublished={setIsPublished}
        onSave={onSave}
        fileInputRef={fileInputRef}
      />
    </CourseProvider>
  );
};

export default CourseBuilder;
