import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Video,
  BarChart,
  MoveUp,
  MoveDown,
  Trash2,
  RefreshCw,
  Lock,
  Unlock,
  CheckCircle,
  PlayCircle,
  Upload,
  Check,
} from 'lucide-react';
import MultipleChoiceQuiz from './MultipleChoiceQuiz ';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import VideoManager from './VideoManager';
import { toast } from 'sonner';

const LessonEditor = ({
  modules = [],
  selectedModule = null,
  selectedLesson = null,
  videoUploads = [],
  quizQuestions = [],
  updateLesson = () => toast.warning('Update lesson function not provided'),
  moveLesson = () => toast.warning('Move lesson function not provided'),
  deleteLesson = () => toast.warning('Delete lesson function not provided'),
  onQuizQuestionsChange = () => toast.warning('Quiz questions change handler not provided'),
  replaceVideoInLesson = () => toast.warning('Replace video function not provided'),
  onVideoUpload = () => toast.warning('Video upload handler not provided'),
  onVideoDelete = () => toast.warning('Video delete handler not provided'),
  onVideoReplace = () => toast.warning('Video replace handler not provided'),
}) => {
  const [showVideoSelectDialog, setShowVideoSelectDialog] = useState(false);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);

  // Find the current module and lesson
  const module = useMemo(() => modules.find((m) => m.id === selectedModule), [modules, selectedModule]);
  const lesson = useMemo(() => module?.lessons?.find((l) => l.id === selectedLesson), [module, selectedLesson]);

  // Get indices for movement operations
  const moduleIndex = useMemo(() => modules.findIndex((m) => m.id === selectedModule), [modules, selectedModule]);
  const lessonIndex = useMemo(() => module?.lessons?.findIndex((l) => l.id === selectedLesson) ?? -1, [module, selectedLesson]);

  // Get assigned video if exists
  const assignedVideo = useMemo(() => {
    return lesson?.videoId ? videoUploads.find((v) => v.id === lesson.videoId) : null;
  }, [lesson?.videoId, videoUploads]);

  useEffect(() => {
    const createNewLessonIfNeeded = async () => {
      const createdModuleId = localStorage.getItem('createdModuleId');
      if (createdModuleId && !lesson && selectedLesson === 'new') {
        await createNewLesson(createdModuleId);
      }
    };

    createNewLessonIfNeeded();
  }, [selectedLesson, lesson]);

  const createNewLesson = async (moduleId) => {
    setIsCreatingLesson(true);
    const createdModuleId = localStorage.getItem("createdModuleId");
    try {
      if (!createdModuleId) {
        throw new Error("Module ID not found in localStorage");
      }

      const formData = new FormData();
      formData.append('title', 'New Lesson');
      formData.append('lessonType', 'video');
      formData.append('description', 'This is a lesson description');
      formData.append('free', 'true');

      const response = await axios.post(
        `http://localhost:5000/api/modules/${createdModuleId}/lessons`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      toast.success('Lesson created successfully');
      return response.data;
    } catch (error) {
      toast.error(`Error creating lesson: ${error.message || 'Unknown error'}`);
      console.error('Error creating lesson:', error);
      return null;
    } finally {
      setIsCreatingLesson(false);
    }
  };

  const handleReplaceClick = () => {
    setShowVideoSelectDialog(true);
  };

  const handleVideoSelect = (videoId) => {
    try {
      const selectedVideo = videoUploads.find((v) => v.id === videoId);
      if (!selectedVideo) {
        throw new Error('Selected video not found');
      }

      replaceVideoInLesson(selectedModule, selectedLesson, videoId);
      
      if (!lesson?.title || (assignedVideo && lesson.title === assignedVideo.name)) {
        updateLesson(selectedModule, selectedLesson, 'title', selectedVideo.name);
      }

      toast.success('Video assigned to lesson');
    } catch (error) {
      toast.error(`Error selecting video: ${error.message || 'Unknown error'}`);
      console.error('Error selecting video:', error);
    } finally {
      setShowVideoSelectDialog(false);
    }
  };

  const handleVideoUpload = (video) => {
    try {
      onVideoUpload(video);
      if (!lesson?.title || (assignedVideo && lesson.title === assignedVideo.name)) {
        updateLesson(selectedModule, selectedLesson, 'title', video.name);
      }
      toast.success('Video uploaded successfully');
    } catch (error) {
      toast.error(`Error uploading video: ${error.message || 'Unknown error'}`);
      console.error('Error handling video upload:', error);
    }
  };

  const handleVideoReplace = (video) => {
    try {
      onVideoReplace(video);
      if (assignedVideo && lesson?.title === assignedVideo.name) {
        updateLesson(selectedModule, selectedLesson, 'title', video.name);
      }
      toast.success('Video replaced successfully');
    } catch (error) {
      toast.error(`Error replacing video: ${error.message || 'Unknown error'}`);
      console.error('Error handling video replace:', error);
    }
  };

  const handleMoveLesson = (direction) => {
    try {
      moveLesson(selectedModule, selectedLesson, direction);
      toast.success(`Lesson moved ${direction}`);
    } catch (error) {
      toast.error(`Error moving lesson: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDeleteLesson = () => {
    try {
      deleteLesson(selectedModule, selectedLesson);
      toast.success('Lesson deleted successfully');
    } catch (error) {
      toast.error(`Error deleting lesson: ${error.message || 'Unknown error'}`);
    }
  };

  if (!module || !lesson) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Lesson Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please select a lesson to edit</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>
            <div className="flex items-center gap-2">
              {lesson.type === 'video' ? (
                <Video size={18} className="text-primary" />
              ) : (
                <BarChart size={18} className="text-primary" />
              )}
              <span>{lesson.type === 'video' ? 'Video Lesson' : 'Quiz'}</span>
            </div>
          </CardTitle>
          <LessonActions
            lesson={lesson}
            lessonIndex={lessonIndex}
            module={module}
            onMove={handleMoveLesson}
            onToggleFree={() => updateLesson(selectedModule, selectedLesson, 'free', !lesson.free)}
            onReplaceVideo={handleReplaceClick}
            onDelete={handleDeleteLesson}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 overflow-y-auto">
        <LessonTitleInput
          title={lesson.title || ''}
          onChange={(value) => updateLesson(selectedModule, selectedLesson, 'title', value)}
        />

        {lesson.type === 'video' ? (
          <VideoLessonContent
            assignedVideo={assignedVideo}
            onVideoUpload={handleVideoUpload}
            onVideoDelete={onVideoDelete}
            onVideoReplace={handleVideoReplace}
            showVideoSelectDialog={showVideoSelectDialog}
            setShowVideoSelectDialog={setShowVideoSelectDialog}
            videoUploads={videoUploads}
            currentVideoId={lesson.videoId}
            onVideoSelect={handleVideoSelect}
          />
        ) : (
          <MultipleChoiceQuiz
            lesson={lesson}
            quizQuestions={quizQuestions}
            onQuizQuestionsChange={onQuizQuestionsChange}
          />
        )}
      </CardContent>

      <CardFooter>
        <Button size="sm" disabled={isCreatingLesson} onClick={() => createNewLesson(selectedModule)}>
          {isCreatingLesson ? (
            <RefreshCw size={14} className="mr-1 animate-spin" />
          ) : (
            <CheckCircle size={14} className="mr-1" />
          )}
          {isCreatingLesson ? 'Creating...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Sub-components for better organization

const LessonActions = ({
  lesson,
  lessonIndex,
  module,
  onMove,
  onToggleFree,
  onReplaceVideo,
  onDelete,
}) => (
  <div className="flex items-center space-x-2">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onMove('up')}
      disabled={lessonIndex === 0}
      aria-label="Move lesson up"
    >
      <MoveUp size={16} />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 w-8 p-0 ${lesson.free ? 'text-green-500' : 'text-gray-500'}`}
      onClick={onToggleFree}
      aria-label={lesson.free ? 'Mark as paid' : 'Mark as free'}
    >
      {lesson.free ? <Unlock size={16} /> : <Lock size={16} />}
    </Button>
    {lesson.type === 'video' && (
      <Button variant="ghost" size="sm" onClick={onReplaceVideo} aria-label="Replace video">
        <RefreshCw size={16} />
      </Button>
    )}
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onMove('down')}
      disabled={lessonIndex === module.lessons.length - 1}
      aria-label="Move lesson down"
    >
      <MoveDown size={16} />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
      onClick={onDelete}
      aria-label="Delete lesson"
    >
      <Trash2 size={16} />
    </Button>
  </div>
);

const LessonTitleInput = ({ title, onChange }) => (
  <div>
    <Label htmlFor="lesson-title">Lesson Title</Label>
    <Input
      id="lesson-title"
      value={title}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1"
      placeholder="Enter lesson title"
    />
  </div>
);

const VideoLessonContent = ({
  assignedVideo,
  onVideoUpload,
  onVideoDelete,
  onVideoReplace,
  showVideoSelectDialog,
  setShowVideoSelectDialog,
  videoUploads,
  currentVideoId,
  onVideoSelect,
}) => (
  <>
    <div>
      <Label>Video Content</Label>
      <div className="mt-2">
        <VideoManager
          onVideoUpload={onVideoUpload}
          onVideoDelete={onVideoDelete}
          onVideoReplace={onVideoReplace}
          initialVideo={assignedVideo}
        />
      </div>
    </div>

    <Dialog open={showVideoSelectDialog} onOpenChange={setShowVideoSelectDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Video</DialogTitle>
          <DialogDescription>Choose a video for this lesson</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 max-h-[50vh] overflow-y-auto">
          {videoUploads
            .filter((v) => v.status === 'complete')
            .map((video) => (
              <div
                key={video.id}
                className={`border rounded-md p-2 cursor-pointer hover:border-primary transition-colors ${
                  video.id === currentVideoId ? 'border-primary bg-primary/10' : ''
                }`}
                onClick={() => onVideoSelect(video.id)}
              >
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.name}
                    className="w-full h-full object-cover rounded"
                  />
                  {video.id === currentVideoId && (
                    <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-1">
                      <Check size={12} />
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-medium truncate">{video.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(video.uploadDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="mt-4">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
);

export default LessonEditor;