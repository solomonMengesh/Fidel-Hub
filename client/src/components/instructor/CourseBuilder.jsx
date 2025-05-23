import { useState, useRef } from "react";
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
  Calendar,
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
import MultipleChoiceQuiz from "./MultipleChoiceQuiz ";
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
import VideoManager from "./VideoManager";

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
	"Other"
];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

const courseFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  level: z.string().nonempty({
    message: "Please select a level.",
  }),
  category: z.string().nonempty({
    message: "Please select a category.",
  }),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Price must be a valid number.",
  }),
});

const CourseBuilder = ({ onSave }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [modules, setModules] = useState([]);
  const [course, setCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState([]);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [lessonToReplace, setLessonToReplace] = useState(null);
  const [videoUploads, setVideoUploads] = useState([]);
  const fileInputRef = useRef(null);
  const moduleFileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      level: "",
      category: "",
      price: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Save the course to the database
      const response = await api.post("/courses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the course and modules in local state
      setCourse(response.data);
      setModules(response.data.modules || []);
      toast.success("Course created successfully");
      setActiveTab("curriculum");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create course"
      );
    }
  };

  const addModule = async () => {
    if (!course) {
      toast.error("Please create the course first by clicking 'Continue'.");
      return;
    }
    try {
      const response = await api.post("/modules", {
        title: `Module ${modules.length + 1}`,
        description: "",
        courseId: course._id,
      });
      setModules([...modules, response.data]);
      setSelectedModule(response.data._id);
      toast.success("Module added successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add module"
      );
    }
  };

  const addLesson = async (moduleId, type = "video") => {
    if (!course) {
      toast.error("Please create the course first by clicking 'Continue'.");
      return;
    }
    try {
      const response = await api.post("/lessons", {
        title: `${type === "video" ? "Video" : "Quiz"} Lesson`,
        type,
        moduleId: moduleId,
        duration: type === "video" ? "0:00" : "15:00",
        content: "",
        free: false,
      });
      setModules(
        modules.map((module) =>
          (module._id === moduleId || module.id === moduleId)
            ? { ...module, lessons: [...(module.lessons ?? []), response.data] }
            : module
        )
      );
      setSelectedModule(moduleId);
      setSelectedLesson(response.data._id || response.data.id);
      if (type === "quiz") {
        setCurrentQuizQuestions([]);
      }
      toast.success(`${type === "video" ? "Video" : "Quiz"} lesson added`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add lesson"
      );
    }
  };

  const updateLesson = async (moduleId, lessonId, field, value) => {
    try {
      await api.put(`/lessons/${lessonId}`, { [field]: value });
      setModules(
        modules.map((module) =>
          (module._id === moduleId || module.id === moduleId)
            ? {
                ...module,
                lessons: (module.lessons ?? []).map((lesson) =>
                  (lesson._id === lessonId || lesson.id === lessonId)
                    ? { ...lesson, [field]: value }
                    : lesson
                ),
              }
            : module
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update lesson"
      );
    }
  };

  const moveLesson = (moduleId, lessonId, direction) => {
    setModules((prevModules) =>
      prevModules.map((module) => {
        if ((module._id || module.id) !== moduleId) return module;
        const lessons = [...(module.lessons ?? [])];
        const idx = lessons.findIndex(
          (l) => (l._id || l.id) === lessonId
        );
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
        if ((module._id || module.id) !== moduleId) return module;
        return {
          ...module,
          lessons: (module.lessons ?? []).filter(
            (lesson) => (lesson._id || lesson.id) !== lessonId
          ),
        };
      })
    );
    if (selectedModule === moduleId && selectedLesson === lessonId) {
      setSelectedLesson(null);
    }
    toast.success("Lesson deleted");
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
    setSelectedModule(lessonToReplace.moduleId);
    setSelectedLesson(lessonToReplace.lessonId);
    setCurrentQuizQuestions([]);
    setShowReplaceDialog(false);
    toast.success("Lesson converted to quiz");
  };

  const handleReplaceLessonFileUpload = (event) => {
    // Return early if no file selected
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
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
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
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL("image/jpeg");
            // Update lesson with new video info
            updateLesson(moduleId, lessonId, "videoId", `video-${Date.now()}`);
            updateLesson(moduleId, lessonId, "duration", duration);
            // Optionally update lesson title if needed
            toast.success("Video replaced successfully");
          }
        };
      };
    } catch (error) {
      console.error("Error replacing lesson:", error);
      toast.error("Failed to replace lesson");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleModuleFileUpload = (event) => {
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
    
    videoFiles.forEach((file, index) => {
      // Simulate processing of each video file,
      // e.g., extracting duration & thumbnail, similar to handleReplaceLessonFileUpload.
      toast.success(`Processing video file: ${file.name}`);
      // ...existing processing logic can be added here...
    });

    event.target.value = "";
  };

  const handleQuizQuestionsChange = (questions) => {
    setCurrentQuizQuestions(questions);
    // Optionally, update the lesson's quizQuestions field in the backend or local state here if needed.
  };

  const replaceVideoInLesson = (moduleId, lessonId, videoId) => {
    updateLesson(moduleId, lessonId, "videoId", videoId);
    // Optionally, update duration or other fields if needed.
    toast.success("Video replaced in lesson");
  };

  const handleReplaceLessonClick = (moduleId, lessonId) => {
    setLessonToReplace({ moduleId, lessonId });
    setShowReplaceDialog(true);
  };

  const selectLesson = (moduleId, lessonId) => {
    setSelectedModule(moduleId);
    setSelectedLesson(lessonId);
  };

  const handleVideoUpload = async (file, moduleId, lessonId) => {
    try {
      const formData = new FormData();
      formData.append("video", file);

      // Upload video to /api/media
      const uploadRes = await api.post("/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const videoData = uploadRes.data;

      // Assign video to lesson
      const assignRes = await api.post(
        `/media/assign/${lessonId}`,
        {
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
        }
      );

      // Update lesson in local state
      setModules((prevModules) =>
        prevModules.map((module) => {
          if ((module._id || module.id) !== moduleId) return module;
          return {
            ...module,
            lessons: (module.lessons ?? []).map((lesson) =>
              (lesson._id || lesson.id) === lessonId
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
      toast.success("Video uploaded and assigned to lesson");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to upload and assign video"
      );
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
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <FileText size={16} />
              <span>Requirements</span>
            </TabsTrigger>
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
                  <h3 className="text-lg font-medium mb-4">
                    Course Information
                  </h3>

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
                            A clear, specific title that describes what you'll
                            teach
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
                            Provide a detailed description of what students will
                            learn
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
                                <SelectItem value="beginner">
                                  Beginner
                                </SelectItem>
                                <SelectItem value="intermediate">
                                  Intermediate
                                </SelectItem>
                                <SelectItem value="advanced">
                                  Advanced
                                </SelectItem>
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
                                    value={category
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}
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

                    <div>
                      <Label>Course Image</Label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md">
                        <div className="space-y-1 text-center">
                          <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                          <div className="flex text-sm">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md font-medium text-fidel-600 hover:text-fidel-500 focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
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
                    </div>

                    <div>
                      <Label>What students need to know</Label>
                      <Textarea
                        placeholder="List any prerequisites for taking this course..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Technical requirements</Label>
                      <Textarea
                        placeholder="List any technical requirements for the course..."
                        className="mt-1"
                      />
                    </div>

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
                        type="button"
                        size="lg"
                        onClick={async () => {
                          const valid = await form.trigger();
                          if (valid) {
                            form.handleSubmit(async (values) => {
                              await onSubmit(values);
                              setActiveTab("curriculum");
                            })();
                          }
                        }}
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
                  <h3 className="text-lg font-medium mb-4">
                    Course Curriculum
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Organize your course content into modules and lessons
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 space-y-4">
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
                                onChange={(e) =>
                                  updateModule(
                                    module._id || module.id,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="Module Title"
                                className="text-lg font-medium"
                              />
                              <Input
                                value={module.description}
                                onChange={(e) =>
                                  updateModule(
                                    module._id || module.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                placeholder="Module description (optional)"
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
                                onClick={() =>
                                  handleModuleBulkUpload(module._id || module.id)
                                }
                                title="Bulk upload videos as lessons"
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
                            {(module.lessons ?? []).map((lesson, lessonIndex) => (
                              <div
                                key={lesson._id || lesson.id}
                                className={`flex items-start p-3 rounded-md border 
                                    selectedLesson === lesson.id
                                      ? "bg-fidel-50 dark:bg-fidel-900/20 border-fidel-200 dark:border-fidel-800"
                                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                  } cursor-pointer`}
                                onClick={() =>
                                  selectLesson(module.id, lesson.id)
                                }
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {lesson.type === "video" ? (
                                      <Video
                                        size={16}
                                        className="text-fidel-500"
                                      />
                                    ) : (
                                      <BarChart
                                        size={16}
                                        className="text-fidel-500"
                                      />
                                    )}
                                    <span className="text-xs font-medium bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                      {lesson.type === "video"
                                        ? "Video"
                                        : "Quiz"}
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
                                      handleReplaceLessonClick(
                                        module.id,
                                        lesson.id
                                      );
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
                                onClick={() => addLesson(module.id, "video")}
                                className="flex-1"
                              >
                                <Video size={14} className="mr-1" />
                                Add Video
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addLesson(module.id, "quiz")}
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
                        variant="outline"
                        onClick={addModule}
                        className="w-full"
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
                          replaceVideoInLesson={replaceVideoInLesson}
                          onReplaceLessonClick={handleReplaceLessonClick}
                        />
                      ) : (
                        <div className="p-8 text-center border border-dashed rounded-lg">
                          <BookOpen
                            size={40}
                            className="mx-auto mb-4 text-muted-foreground"
                          />
                          <h3 className="font-medium mb-2">
                            No Lesson Selected
                          </h3>
                          <p className="text-sm text-muted-foreground mb-6">
                            Select a lesson from the module list or create a new
                            one
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    {/* <VideoManager
                      onVideosAdded={handleVideoFilesAdded}
                      onVideoSelected={assignVideoToLesson}
                      onVideoDelete={removeVideoUpload}
                      autoAssignToLesson={
                        selectedModule !== null && selectedLesson !== null
                      }
                    /> */}
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
                </div>
              </div>
            </TabsContent>

            <TabsContent value="publish" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Ready to Publish?
                  </h3>

                  <p className="text-sm text-muted-foreground mb-6">
                    Review your course information and curriculum before
                    publishing
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

                  <Button type="submit" size="lg">
                    Create Course
                  </Button>
                </div>
              </div>
            </TabsContent>
          </form>
        </Form>
      </Tabs>

      <Dialog
        open={previewVideo !== null}
        onOpenChange={(open) => !open && setPreviewVideo(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Video Preview</DialogTitle>
            <DialogDescription>{previewVideo?.name}</DialogDescription>
          </DialogHeader>

          <div className="mt-4 bg-slate-900 rounded-md aspect-video flex items-center justify-center">
            <div className="text-center p-6">
              <PlayCircle className="h-16 w-16 mx-auto mb-4 text-fidel-400" />
              <p className="text-white">Video preview placeholder</p>
              <p className="text-white/60 text-sm">{previewVideo?.name}</p>
              <p className="text-white/60 text-sm mt-2">
                Duration: {previewVideo?.duration}
              </p>
            </div>
          </div>

          <DialogClose asChild>
            <Button variant="outline" className="mt-2">
              Close Preview
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

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
  replaceVideoInLesson,
  onReplaceLessonClick,
}) => {
  // Ensure modules and selectedModule are valid
  if (!modules || !selectedModule) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No module or lesson selected.</p>
      </div>
    );
  }

  const module = modules.find((m) => m.id === selectedModule || m._id === selectedModule);
  if (!module) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Selected module not found.</p>
      </div>
    );
  }

  const lesson = module.lessons?.find((l) => l.id === selectedLesson || l._id === selectedLesson);
  if (!lesson) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Selected lesson not found.</p>
      </div>
    );
  }

  const moduleIndex = modules.findIndex((m) => m.id === selectedModule || m._id === selectedModule);
  const lessonIndex = (module.lessons ?? []).findIndex(
    (l) => l.id === selectedLesson || l._id === selectedLesson
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
              onClick={async () => {
                const newFreeStatus = !lesson.free;
                try {
                  updateLesson(
                    selectedModule,
                    selectedLesson,
                    "free",
                    newFreeStatus
                  );
                  toast.success(
                    `Lesson marked as ${newFreeStatus ? "free" : "paid"}`
                  );
                } catch (error) {
                  toast.error("Failed to update status");
                }
              }}
              title={lesson.free ? "Mark as paid" : "Mark as free"}
            >
              {lesson.free ? <Unlock size={16} /> : <Lock size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onReplaceLessonClick?.(selectedModule, selectedLesson)
              }
            >
              <RefreshCw size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveLesson(selectedModule, selectedLesson, "down")}
              disabled={lessonIndex === module.lessons.length - 1}
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
              updateLesson(
                selectedModule,
                selectedLesson,
                "title",
                e.target.value
              )
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
                    <h4 className="font-medium text-sm">
                      {assignedVideo.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Duration: {assignedVideo.duration} • Size:{" "}
                      {assignedVideo.size}
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
                                  className={`border rounded-md p-2 cursor-pointer hover:border-fidel-500 transition-colors
                                    ${
                                      video.id === lesson.videoId
                                        ? "border-fidel-500 bg-fidel-50 dark:bg-fidel-900/20"
                                        : ""
                                    }
                                  `}
                                  onClick={() =>
                                    replaceVideoInLesson(
                                      selectedModule,
                                      selectedLesson,
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
                          updateLesson(
                            selectedModule,
                            selectedLesson,
                            "videoId",
                            undefined
                          )
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
              <div className="mt-2 border border-dashed rounded-md p-6">
                <VideoManager
                  onVideosAdded={() => {}}
                  onVideoSelected={(video) => {
                    updateLesson(
                      selectedModule,
                      selectedLesson,
                      "videoId",
                      video.id
                    );
                    updateLesson(
                      selectedModule,
                      selectedLesson,
                      "duration",
                      video.duration
                    );
                  }}
                  autoAssignToLesson={true}
                  asButton={true}
                  buttonLabel="Upload Video"
                />
              </div>
            )}

            <div className="mt-4">
              <Label htmlFor="video-description">Description (Optional)</Label>
              <Textarea
                id="video-description"
                value={lesson.content}
                onChange={(e) =>
                  updateLesson(
                    selectedModule,
                    selectedLesson,
                    "content",
                    e.target.value
                  )
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
              initialQuestions={lesson.quizQuestions || []}
              onChange={onQuizQuestionsChange}
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

export default CourseBuilder;