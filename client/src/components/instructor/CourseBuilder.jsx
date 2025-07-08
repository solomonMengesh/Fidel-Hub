import { useState, useRef, createContext, useContext } from "react";
import axios from "axios";
import {
  Book,
  UploadCloud,
  Plus,
  Trash2,
  MoveDown,
  MoveUp,
  BookOpen,
  ListPlus,
  FileText,
  Upload,
  PlayCircle,
  BarChart,
  Video,
  X,
  Check,
  Upload as UploadIcon,
  CheckCircle,
  RefreshCw,
  Lock,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch"; // adjust path if needed

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

// Course Context for managing global IDs
const CourseContext = createContext();

const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
};

// Categories for course selection
const categories = [
  "Computer Science",
  "Programming",
  "Web Development",
  "Business",
  "Marketing",
  "Data Science",
  "Psychology",
  "Finance",
  "Design",
  "Languages",
  "Health & Fitness",
  "Mathematics",
  "Photography",
  "Music",
  "Other",
];

// Axios instance for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_UL || "http://localhost:5000/api",
  withCredentials: true,
});

// Course form schema
const courseFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  level: z.string().nonempty({ message: "Please select a level." }),
  category: z.string().nonempty({ message: "Please select a category." }),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Price must be a valid number." }),
  requirements: z.string().min(10, { message: "Requirements must be at least 10 characters." }).optional(),
  thumbnail: z.any().optional().refine((file) => !file || file instanceof File, {
    message: "Please upload a valid image file.",
  }).refine((file) => !file || ["image/png", "image/jpeg", "image/gif"].includes(file.type), {
    message: "Only PNG, JPG, or GIF files are allowed.",
  }).refine((file) => !file || file.size <= 10 * 1024 * 1024, {
    message: "File size must be less than 10MB.",
  }),
});

// MultipleChoiceQuiz component
const MultipleChoiceQuiz = ({ initialQuestions = [], onChange, lessonId }) => {
  const [questions, setQuestions] = useState(
    initialQuestions.length > 0
      ? initialQuestions
      : [
          {
            question: "",
            options: [
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
            ],
            type: "single",
          },
        ]
  );

  const addQuestion = () => {
    const newQuestions = [
      ...questions,
      {
        question: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        type: "single",
      },
    ];
    setQuestions(newQuestions);
    onChange(newQuestions);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
    onChange(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = {
      ...updatedQuestions[questionIndex].options[optionIndex],
      [field]: value,
    };
    setQuestions(updatedQuestions);
    onChange(updatedQuestions);
  };

  return (
    <div className="space-y-6">
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="border p-4 rounded-md">
          <Label>Question {qIndex + 1}</Label>
          <Input
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
            placeholder="Enter question"
            className="mt-2"
          />
          <div className="mt-4 space-y-2">
            {q.options.map((opt, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={opt.isCorrect}
                  onChange={(e) =>
                    updateOption(qIndex, optIndex, "isCorrect", e.target.checked)
                  }
                />
                <Input
                  value={opt.text}
                  onChange={(e) =>
                    updateOption(qIndex, optIndex, "text", e.target.value)
                  }
                  placeholder={`Option ${optIndex + 1}`}
                />
              </div>
            ))}
          </div>
          <select
            value={q.type}
            onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
            className="mt-2 border rounded-md p-1"
          >
            <option value="single">Single Choice</option>
            <option value="multiple">Multiple Choice</option>
          </select>
        </div>
      ))}
      <Button onClick={addQuestion}>Add Question</Button>
    </div>
  );
};

// LessonEditor component
const LessonEditor = ({
  modules,
  selectedModule,
  selectedLesson,
  updateLesson,
  moveLesson,
  deleteLesson,
  videoUploads,
  quizQuestions,
  onQuizQuestionsChange,
  onReplaceLessonClick,
  handleVideoUpload, // Added prop
}) => {
  if (!modules || !selectedModule) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No module or lesson selected.</p>
      </div>
    );
  }

  const module = modules.find((m) => m._id === selectedModule);
  if (!module) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Selected module not found.</p>
      </div>
    );
  }

  const lesson = module.lessons?.find((l) => l._id === selectedLesson);
  if (!lesson) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Selected lesson not found.</p>
      </div>
    );
  }

  const moduleIndex = modules.findIndex((m) => m._id === selectedModule);
  const lessonIndex = (module.lessons ?? []).findIndex(
    (l) => l._id === selectedLesson
  );

  const assignedVideo = lesson.videoId
    ? videoUploads.find((v) => v.id === lesson.videoId)
    : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>
            <div className="flex items-center gap-2">
              {lesson.type === "video" ? (
                <Video size={18} className="text-fidel-500" />
              ) : (
                <BarChart size={18} className="text-fidel-500" />
              )}
              <span>{lesson.type === "video" ? "Video Lesson" : "Quiz"}</span>
            </div>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveLesson(selectedModule, selectedLesson, "up")}
              disabled={lessonIndex === 0}
            >
              <MoveUp size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${
                lesson.free ? "text-green-500" : "text-gray-500"
              }`}
              onClick={() => {
                const newFreeStatus = !lesson.free;
                updateLesson(selectedModule, selectedLesson, "free", newFreeStatus);
                toast.success(`Lesson marked as ${newFreeStatus ? "free" : "paid"}`);
              }}
              title={lesson.free ? "Mark as paid" : "Mark as free"}
            >
              {lesson.free ? <Unlock size={16} /> : <Lock size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReplaceLessonClick?.(selectedModule, selectedLesson)}
            >
              <RefreshCw size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveLesson(selectedModule, selectedLesson, "down")}
              disabled={lessonIndex === (module.lessons ?? []).length - 1}
            >
              <MoveDown size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => deleteLesson(selectedModule, selectedLesson)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="lesson-title">Lesson Title</Label>
          <Input
            id="lesson-title"
            value={lesson.title}
            onChange={(e) =>
              updateLesson(selectedModule, selectedLesson, "title", e.target.value)
            }
            className="mt-1"
          />
        </div>

        {lesson.type === "video" ? (
          <div>
            <Label>Video Content</Label>
            {assignedVideo ? (
              <div className="mt-2 border rounded-md p-4">
                <div className="flex items-start">
                  <div className="relative w-40 h-24 rounded overflow-hidden mr-4">
                    <img
                      src={assignedVideo.thumbnail}
                      alt={assignedVideo.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <PlayCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{assignedVideo.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Duration: {assignedVideo.duration} • Size: {assignedVideo.size}
                    </p>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline">
                        <PlayCircle size={14} className="mr-1" />
                        Preview
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Upload size={14} className="mr-1" />
                            Replace
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Replace Video</DialogTitle>
                            <DialogDescription>
                              Select a new video to replace the current one
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-3 mt-4 max-h-[50vh] overflow-y-auto">
                            {videoUploads
                              .filter((v) => v.status === "complete")
                              .map((video) => (
                                <div
                                  key={video.id}
                                  className={`border rounded-md p-2 cursor-pointer hover:border-fidel-500 transition-colors ${
                                    video.id === lesson.videoId
                                      ? "border-fidel-500 bg-fidel-50 dark:bg-fidel-900/20"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    updateLesson(
                                      selectedModule,
                                      selectedLesson,
                                      "videoId",
                                      video.id
                                    )
                                  }
                                >
                                  <div className="relative h-20">
                                    <img
                                      src={video.thumbnail}
                                      alt={video.name}
                                      className="w-full h-full object-cover rounded"
                                    />
                                    {video.id === lesson.videoId && (
                                      <div className="absolute top-1 right-1 bg-fidel-500 text-white rounded-full p-1">
                                        <Check size={12} />
                                      </div>
                                    )}
                                  </div>
                                  <div className="mt-1">
                                    <div className="text-xs font-medium truncate">
                                      {video.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {video.duration}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                          <DialogClose asChild>
                            <Button variant="outline" className="mt-2">
                              Close
                            </Button>
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() =>
                          updateLesson(selectedModule, selectedLesson, "videoId", undefined)
                        }
                      >
                        <Trash2 size={14} className="mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-2 border border-dashed rounded-md p-6 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById(`video-upload-${lesson._id}`).click()}
                >
                  <Upload size={14} className="mr-1" />
                  Upload Video
                </Button>
                <input
                  id={`video-upload-${lesson._id}`}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleVideoUpload(e.target.files[0], selectedModule, selectedLesson);
                    }
                  }}
                />
              </div>
            )}
            <div className="mt-4">
              <Label htmlFor="video-description">Description (Optional)</Label>
              <Textarea
                id="video-description"
                value={lesson.content || ""}
                onChange={(e) =>
                  updateLesson(selectedModule, selectedLesson, "content", e.target.value)
                }
                placeholder="Add details about this video lesson..."
                className="mt-1"
              />
            </div>
          </div>
        ) : (
          <div>
            <Label className="mb-3 block">Quiz Questions</Label>
            <MultipleChoiceQuiz
              initialQuestions={lesson.quizQuestions || quizQuestions}
              onChange={onQuizQuestionsChange}
              lessonId={selectedLesson}
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="text-sm text-muted-foreground">
          Part of <span className="font-medium">{module.title}</span>
        </div>
        <Button size="sm" variant="outline">
          <CheckCircle size={14} className="mr-1" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
};

// CourseBuilder component
const CourseBuilder = ({ onSave }) => {
  // CourseProvider
  const CourseProviderWrapper = ({ children }) => {
    const [courseId, setCourseId] = useState(null);
    const [moduleId, setModuleId] = useState(null);
    const [lessonId, setLessonId] = useState(null);

    return (
      <CourseContext.Provider
        value={{
          courseId,
          setCourseId,
          moduleId,
          setModuleId,
          lessonId,
          setLessonId,
        }}
      >
        {children}
      </CourseContext.Provider>
    );
  };

  // Inner CourseBuilder
  const InnerCourseBuilder = () => {
    const { courseId, setCourseId, setModuleId, setLessonId } = useCourse();
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
    const moduleFileInputRef = useRef(null);

    const form = useForm({
      resolver: zodResolver(courseFormSchema),
      defaultValues: {
        title: "",
        description: "",
        level: "",
        category: "",
        price: "",
        requirements: "",
        thumbnail: null,
      },
    });

    // Step 1: Create Course
    const onSubmit = async (values) => {
      if (courseId) {
        console.log("Course already exists with ID:", courseId);
        toast.info("Course already created. Proceeding to curriculum.");
        setActiveTab("curriculum");
        return;
      }
      if (activeTab !== "details") {
        console.log("Form submission blocked: Not in details tab");
        return;
      }
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === "thumbnail" && value) {
            formData.append(key, value);
          } else if (value) {
            formData.append(key, value);
          }
        });

        console.log("Submitting course form data:", formData);

        const response = await api.post("/courses", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const newCourseId = response.data._id;
        console.log("Course created successfully. Course ID:", newCourseId);

        setCourseId(newCourseId);
        setModules([]);
        form.reset(); // Reset form after successful submission
        toast.success("Course created successfully");
        setActiveTab("curriculum");
      } catch (error) {
        console.error("Error creating course:", error);
        toast.error(error.response?.data?.message || "Failed to create course");
      }
    };

    // Step 2: Create Module
    const addModule = async () => {
      console.log("Trying to add module. Current courseId:", courseId);

      if (!courseId) {
        toast.error("Please create a course first.");
        console.warn("No course ID found. Aborting module creation.");
        return;
      }

      try {
        const moduleData = {
          title: `Module ${modules.length + 1}`,
          description: "",
          courseId,
        };

        console.log("Sending module data to backend:", moduleData);

        const response = await api.post("/modules", moduleData, {
          headers: { "Content-Type": "application/json" },
        });

        const newModule = { ...response.data, lessons: [] };
        console.log("Module created successfully:", newModule);

        setModules([...modules, newModule]);
        setModuleId(newModule._id);
        setSelectedModule(newModule._id);
        toast.success("Module added successfully");
      } catch (error) {
        console.error("Error adding module:", error);
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

    // Step 3: Create Lessons
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

    // Step 4 & 5: Upload and Assign Video
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

    // Step 6: Add Quiz Questions
    const saveQuizQuestions = async (lessonId, questions) => {
      try {
        const formattedQuestions = questions.map((q) => ({
          question: q.question,
          options: q.options.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
          type: q.type || "single",
          lesson: lessonId,
        }));

        await api.post(`/media/assign/${lessonId}`, {
          quizQuestions: formattedQuestions,
        }, {
          headers: { "Content-Type": "application/json" },
        });

        setModules((prevModules) =>
          prevModules.map((module) =>
            module.lessons?.some((lesson) => lesson._id === lessonId)
              ? {
                  ...module,
                  lessons: module.lessons.map((lesson) =>
                    lesson._id === lessonId
                      ? { ...lesson, quizQuestions: formattedQuestions }
                      : lesson
                  ),
                }
              : module
          )
        );

        toast.success("Quiz questions saved successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to save quiz questions");
      }
    };

    const handleQuizQuestionsChange = (questions) => {
      setCurrentQuizQuestions(questions);
      if (selectedLesson) {
        saveQuizQuestions(selectedLesson, questions);
        updateLesson(selectedModule, selectedLesson, "quizQuestions", questions);
      }
    };

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
      updateLesson(lessonToReplace.moduleId, lessonToReplace.lessonId, "type", "quiz");
      updateLesson(lessonToReplace.moduleId, lessonToReplace.lessonId, "videoId", undefined);
      updateLesson(lessonToReplace.moduleId, lessonToReplace.lessonId, "duration", "15:00");
      updateLesson(lessonToReplace.moduleId, lessonToReplace.lessonId, "quizQuestions", []);
      setSelectedModule(lessonToReplace.moduleId);
      setSelectedLesson(lessonToReplace.lessonId);
      setCurrentQuizQuestions([]);
      setShowReplaceDialog(false);
      toast.success("Lesson converted to quiz");
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
        await handleVideoUpload(file, moduleId, lessonId);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to replace lesson");
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
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
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <TabsList className="grid grid-cols-4 mb-1">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Book size={16} />
                <span>Basic Details</span>
              </TabsTrigger>
              <TabsTrigger value="curriculum" className="flex items-center gap-2">
                <BookOpen size={16} />
                <span>Curriculum</span>
              </TabsTrigger>
              {/* <TabsTrigger value="pricing" className="flex items-center gap-2">
                <FileText size={16} />
                <span>Requirements</span>
              </TabsTrigger> */}
              <TabsTrigger value="publish" className="flex items-center gap-2">
                <UploadCloud size={16} />
                <span>Publish</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="details" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Course Information</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Advanced React Development"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A clear, specific title that describes what you'll teach
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your course in detail..."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Provide a detailed description of what students will learn
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Difficulty Level</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="beginner">Beginner</SelectItem>
                                  <SelectItem value="intermediate">Intermediate</SelectItem>
                                  <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Select the appropriate level for your course
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem
                                      key={category}
                                      value={category.toLowerCase().replace(/\s+/g, "-")}
                                    >
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Choose the category that best fits your course
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="requirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Requirements</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="List the requirements or prerequisites for your course..."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Specify what students need to know or have before taking this course
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="thumbnail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Thumbnail</FormLabel>
                            <FormControl>
                              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md">
                                <div className="space-y-1 text-center">
                                  <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                                  <div className="flex text-sm">
                                    <label
                                      htmlFor="thumbnail-upload"
                                      className="relative cursor-pointer rounded-md font-medium text-fidel-600 hover:text-fidel-500 focus-within:outline-none"
                                    >
                                      <span>Upload a file</span>
                                      <input
                                        id="thumbnail-upload"
                                        name="thumbnail-upload"
                                        type="file"
                                        accept="image/png,image/jpeg,image/gif"
                                        className="sr-only"
                                        onChange={(e) => field.onChange(e.target.files[0])}
                                      />
                                    </label>
                                    <p className="pl-1 text-slate-500 dark:text-slate-400">
                                      or drag and drop
                                    </p>
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    PNG, JPG, GIF up to 10MB
                                  </p>
                                </div>
                              </div>
                            </FormControl>
                            {field.value && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Selected: {field.value.name}
                              </p>
                            )}
                            <FormDescription>
                              Upload a thumbnail image for your course
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="e.g. 49.99"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Set a price for your course
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end mt-8">
                        <Button
                          type="submit"
                          size="lg"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Course Curriculum</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Organize your course content into modules and lessons
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-4 space-y-4">
                        {modules.map((module, moduleIndex) => (
                          <div
                            key={module._id}
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
                                  onChange={(e) =>
                                    updateModule(module._id, "title", e.target.value)
                                  }
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
                                  onClick={() => {
                                    setSelectedModule(module._id);
                                    moduleFileInputRef.current.click();
                                  }}
                                  title="Bulk upload videos as lessons"
                                >
                                  <Upload size={18} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => moveModule(module._id, "down")}
                                  disabled={moduleIndex === modules.length - 1}
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
                                        setLessonToReplace({
                                          moduleId: module._id,
                                          lessonId: lesson._id,
                                        });
                                        setShowReplaceDialog(true);
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
                            onQuizQuestionsChange={handleQuizQuestionsChange}
                            onReplaceLessonClick={(moduleId, lessonId) => {
                              setLessonToReplace({ moduleId, lessonId });
                              setShowReplaceDialog(true);
                            }}
                            handleVideoUpload={handleVideoUpload} // Pass prop
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
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Prerequisites & Requirements
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Review and confirm the prerequisites and requirements for your course
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="publish" className="p-6">
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium mb-4">Ready to Publish?</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Review your course information and curriculum before publishing
      </p>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 p-4 mb-6">
        <h4 className="font-medium mb-2">Publishing Checklist</h4>
        <ul className="space-y-1">
          <li className="flex items-center text-sm">
            <div className="h-4 w-4 rounded-full mr-2 bg-green-500"></div>
            Course title and description are complete
          </li>
          <li className="flex items-center text-sm">
            <div className="h-4 w-4 rounded-full mr-2 bg-green-500"></div>
            At least one module with content is created
          </li>
          <li className="flex items-center text-sm">
            <div className="h-4 w-4 rounded-full mr-2 bg-green-500"></div>
            Pricing information is set
          </li>
        </ul>
      </div>

      {/* Switch for Draft/Publish */}
      <div className="flex items-center space-x-4 mb-6">
        <Label htmlFor="publish-switch">Publish</Label>
        <Switch
          id="publish-switch"
          checked={isPublished}
          onCheckedChange={(checked) => setIsPublished(checked)}
        />
        <span className="text-sm text-muted-foreground">
          {isPublished ? "This course will be published" : "This course will remain a draft"}
        </span>
      </div>

      {/* Publish/Draft Action */}
      <Button
        type="button"
        size="lg"
        onClick={() => {
          if (!courseId || modules.length === 0) {
            toast.error("Please create a course and at least one module before publishing.");
            return;
          }

          onSave({ courseId, modules, status: isPublished ? "published" : "draft" });

          toast.success(
            isPublished
              ? "Course published successfully"
              : "Course saved as draft"
          );
        }}
      >
        {isPublished ? "Publish Course" : "Save as Draft"}
      </Button>
    </div>
  </div>
</TabsContent>

            </form>
          </Form>
        </Tabs>

        <Dialog open={showReplaceDialog} onOpenChange={setShowReplaceDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Replace Lesson</DialogTitle>
              <DialogDescription>
                Choose how you want to replace this lesson
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div
                className="border rounded-md p-4 hover:border-fidel-500 cursor-pointer transition-all"
                onClick={handleReplaceLessonWithVideo}
              >
                <Video size={24} className="mx-auto mb-2 text-fidel-500" />
                <h4 className="font-medium text-center">Replace with Video</h4>
                <p className="text-sm text-center text-muted-foreground mt-1">
                  Upload a new video for this lesson
                </p>
              </div>
              <div
                className="border rounded-md p-4 hover:border-fidel-500 cursor-pointer transition-all"
                onClick={handleReplaceWithQuiz}
              >
                <BarChart size={24} className="mx-auto mb-2 text-fidel-500" />
                <h4 className="font-medium text-center">Replace with Quiz</h4>
                <p className="text-sm text-center text-muted-foreground mt-1">
                  Create a new quiz for this lesson
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowReplaceDialog(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="video/*"
          onChange={handleReplaceLessonFileUpload}
        />

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

  return (
    <CourseProviderWrapper>
      <InnerCourseBuilder />
    </CourseProviderWrapper>
  );
};

export default CourseBuilder;