import React, { useState, useRef } from "react";

const VideoUpload = ({ toast, onVideoUpload }) => {
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      // Step 1: Upload the video
      const formData = new FormData();
      formData.append("video", file);

      const uploadResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/media`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload video");
      }

      const uploadData = await uploadResponse.json();
      const { videoId, videoUrl, thumbnailUrl, duration } = uploadData;

      // Step 2: Assign the video to the lesson
      const assignResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/media/assign/${process.env.REACT_APP_LESSON_ID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoId,
            videoUrl,
            thumbnailUrl,
            duration,
          }),
        }
      );

      if (!assignResponse.ok) {
        throw new Error("Failed to assign video to lesson");
      }

      setVideo({
        file,
        progress: 100,
        status: "complete",
        videoUrl,
        thumbnailUrl,
        videoId,
      });

      setUploading(false);
      if (onVideoUpload) {
        onVideoUpload({ videoId, videoUrl, thumbnailUrl, duration });
      }
      toast.success("Video uploaded and assigned successfully");
    } catch (error) {
      console.error(error);
      setVideo((prev) => ({
        ...prev,
        status: "error",
      }));
      setUploading(false);
      toast.error("Failed to upload or assign video");
    }
  };

  const handleButtonClick = () => {
    if (!uploading) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={uploading}
        style={{ display: "none" }}
      />
      <button onClick={handleButtonClick} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
      {video && video.status === "complete" && <p>Upload complete!</p>}
      {video && video.status === "error" && <p>Upload failed.</p>}
    </div>
  );
};

export default VideoUpload;
