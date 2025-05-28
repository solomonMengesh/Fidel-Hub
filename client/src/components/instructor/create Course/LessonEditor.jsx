import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MoveUp,
  MoveDown,
  Trash2,
  Video,
  BarChart,
  RefreshCw,
  Upload,
  PlayCircle,
  Check,
  UploadCloud,
  Unlock,
  Lock,
  CheckCircle,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

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
  handleVideoUpload,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleFileUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Create a mock progress for demonstration
      // In a real app, you would use the actual progress from your upload handler
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 300);

      // Call the provided handleVideoUpload function
      await handleVideoUpload(file, selectedModule, selectedLesson, (progress) => {
        setUploadProgress(progress);
      });

      clearInterval(interval);
      setUploadProgress(100);
      toast.success("Video uploaded successfully!");
    } catch (error) {
      setUploadError(error.message || "Failed to upload video");
      toast.error("Video upload failed");
    } finally {
      setIsUploading(false);
      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const cancelUpload = () => {
    // In a real app, you would abort the upload request here
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Uploading video...
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={cancelUpload}
                      >
                        <X size={14} className="mr-1" />
                        Cancel
                      </Button>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                    <span className="text-xs text-muted-foreground block">
                      {uploadProgress}% complete
                    </span>
                    {uploadError && (
                      <div className="text-red-500 text-sm">{uploadError}</div>
                    )}
                  </div>
                ) : (
                  <>
                    <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={14} className="mr-1" />
                      Upload Video
                    </Button>
                    <input
                      ref={fileInputRef}
                      id={`video-upload-${lesson._id}`}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </>
                )}
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

export default LessonEditor;