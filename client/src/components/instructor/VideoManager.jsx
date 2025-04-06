import React, { useState, useRef } from "react";
import {
  Upload,
  Play,
  Trash,
  RefreshCw,
  FileVideo,
  Check,
  X,
  Loader,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const VideoManager = ({ onVideoUpload, onVideoDelete, onVideoReplace }) => {
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      return;
    }

    processFile(file);
  };

  const processFile = (file) => {
    // Generate a unique ID
    const id = `video-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // Create a video element to get duration
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.src = URL.createObjectURL(file);

    const newVideo = {
      id,
      name: formatFileName(file.name),
      file,
      progress: 0,
      status: "idle",
      duration: "00:00", // Will be updated when metadata is loaded
      version: 1,
      url: URL.createObjectURL(file),
    };

    // Get video duration when metadata is loaded
    videoElement.onloadedmetadata = () => {
      URL.revokeObjectURL(videoElement.src);
      const minutes = Math.floor(videoElement.duration / 60);
      const seconds = Math.floor(videoElement.duration % 60);

      setVideo((prev) => ({
        ...prev,
        duration: `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`,
      }));
    };

    setVideo(newVideo);
    simulateUpload(newVideo);
  };

  const formatFileName = (name) => {
    // Remove extension and replace hyphens/underscores with spaces
    return name
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[-_]/g, " ") // Replace hyphens/underscores with spaces
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const simulateUpload = (videoToUpload) => {
    setUploading(true);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Update video status to complete
        setVideo((prev) => ({
          ...prev,
          progress: 100,
          status: "complete",
        }));

        setUploading(false);
        if (onVideoUpload) {
          onVideoUpload(videoToUpload);
        }
        toast.success("Video uploaded successfully");
      } else {
        // Update video progress
        setVideo((prev) => ({
          ...prev,
          progress: Math.round(progress),
          status: "loading",
        }));
      }
    }, 500);
  };

  const handleVideoPreview = () => {
    setPreviewVideo(video);
  };

  const handleVideoDelete = () => {
    if (onVideoDelete) {
      onVideoDelete(video.id);
    }
    setVideo(null);
    toast.success("Video removed successfully");
  };

  const handleReplaceClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReplaceFile = (e) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      return;
    }

    if (!video) return;

    // Create new video object with same ID but incremented version
    const updatedVideo = {
      ...video,
      file,
      name: formatFileName(file.name),
      progress: 0,
      status: "idle",
      version: (video.version || 1) + 1,
      url: URL.createObjectURL(file),
    };

    // Update the video element to get new duration
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.src = updatedVideo.url;

    videoElement.onloadedmetadata = () => {
      URL.revokeObjectURL(videoElement.src);
      const minutes = Math.floor(videoElement.duration / 60);
      const seconds = Math.floor(videoElement.duration % 60);

      const finalVideo = {
        ...updatedVideo,
        duration: `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`,
      };

      // Update the video
      setVideo(finalVideo);

      // Simulate upload for the replaced video
      simulateUpload(finalVideo);

      if (onVideoReplace) {
        onVideoReplace(finalVideo);
      }

      toast.success("Video replacement started");
    };

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* For video upload/replace */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={video ? handleReplaceFile : handleFileSelect}
        className="hidden"
        accept="video/*"
      />

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Lesson Video</h3>
      </div>

      {video ? (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center flex-1">
              <div className="h-10 w-10 bg-fidel-50 dark:bg-slate-800 rounded flex items-center justify-center mr-3">
                <FileVideo size={18} className="text-fidel-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <p className="font-medium truncate">{video.name}</p>
                  {video.version && video.version > 1 && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      v{video.version}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock size={14} className="mr-1" />
                  <span>{video.duration}</span>
                </div>
              </div>
            </div>

            {video.status !== "complete" ? (
              <div className="w-full sm:w-64">
                <div className="flex items-center mb-1">
                  <span className="text-xs text-muted-foreground flex-1">
                    {video.status === "loading"
                      ? "Uploading..."
                      : video.status === "error"
                      ? "Upload failed"
                      : "Ready to upload"}
                  </span>
                  <span className="text-xs font-medium">{video.progress}%</span>
                </div>
                <Progress
                  value={video.progress}
                  status={video.status}
                  className="h-2"
                />
              </div>
            ) : (
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVideoPreview}
                    >
                      <Play size={14} className="mr-1" /> Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>{video.name}</DialogTitle>
                      <DialogDescription>Video Preview</DialogDescription>
                    </DialogHeader>
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                      {video.url && (
                        <video
                          src={video.url}
                          controls
                          className="w-full h-full"
                        />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReplaceClick}
                >
                  <RefreshCw size={14} className="mr-1" /> Replace
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVideoDelete}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={14} className="mr-1" /> Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
          <FileVideo size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Video Uploaded</h3>
          <p className="text-muted-foreground mb-4">
            Upload a video for this lesson
          </p>
          <Button
            onClick={() => fileInputRef.current.click()}
            variant="outline"
            disabled={uploading}
          >
            <Upload size={16} className="mr-2" />
            Select Video
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoManager;
