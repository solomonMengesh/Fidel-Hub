import { v2 as cloudinary } from 'cloudinary';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import Lesson from '../../models/Lesson.js';
import { protect, instructor } from '../../middleware/authMiddleware.js';
import asyncHandler from 'express-async-handler';
import { processVideo, generateVideoThumbnail, getVideoDuration } from '../../services/videoProcessing.js';

const unlinkAsync = promisify(fs.unlink);

// @desc    Upload video file and process it
// @route   POST /api/media/upload
// @access  Private/Instructor
export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  try {
    // Process the video (generate thumbnail, get duration, upload to cloud)
    const videoData = await processVideo(req.file.path, {
      folder: 'course-videos/temp'
    });

    res.status(201).json({
      id: videoData.videoPublicId,
      name: req.file.originalname,
      size: req.file.size,
      duration: videoData.duration,
      thumbnail: videoData.thumbnailUrl,
      url: videoData.videoUrl,
      status: 'complete'
    });
  } catch (error) {
    console.error('Video processing error:', error);
    res.status(500);
    throw new Error('Failed to process video');
  }
});

// @desc    Get all uploaded media (videos)
// @route   GET /api/media
// @access  Private/Instructor
export const getUploadedMedia = asyncHandler(async (req, res) => {
  // In a real implementation, you might query your database for media
  // associated with the current instructor
  res.json([]);
});

// @desc    Assign video to lesson
// @route   PUT /api/media/assign/:lessonId
// @access  Private/Instructor
export const assignVideoToLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const { videoPublicId, thumbnailPublicId, videoUrl, thumbnailUrl, duration } = req.body;

  // Enhanced validation
  if (!videoPublicId || !videoUrl) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
      required: {
        videoPublicId: 'string (Cloudinary public ID)',
        videoUrl: 'string (Cloudinary URL)'
      },
      received: {
        videoPublicId: videoPublicId ? 'present' : 'missing',
        videoUrl: videoUrl ? 'present' : 'missing'
      }
    });
  }

  try {
    // 1. Fetch lesson with authorization
    const lesson = await Lesson.findById(lessonId)
      .populate({
        path: 'module',
        populate: { path: 'course', select: 'instructor' }
      })
      .select('video module');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
        lessonId
      });
    }

    // 2. Verify instructor ownership
    if (lesson.module.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lesson'
      });
    }

    // 3. Prepare destination paths
    const newVideoId = `course-${lesson.module.course._id}/module-${lesson.module._id}/lesson-${lesson._id}`;
    const newThumbId = `${newVideoId}-thumbnail`;

    // 4. Verify source resources using multiple approaches
    let videoExists = false;
    let thumbExists = false;

    try {
      // First try: Direct API resource check
      await cloudinary.api.resource(videoPublicId, { resource_type: 'video' });
      videoExists = true;
      
      if (thumbnailPublicId) {
        await cloudinary.api.resource(thumbnailPublicId);
        thumbExists = true;
      }
    } catch (apiError) {
      console.warn('Primary check failed, trying alternative:', apiError);
      
      // Fallback: Check if URL is accessible
      try {
        const videoHead = await fetch(videoUrl, { method: 'HEAD' });
        videoExists = videoHead.ok;
        
        if (thumbnailUrl) {
          const thumbHead = await fetch(thumbnailUrl, { method: 'HEAD' });
          thumbExists = thumbHead.ok;
        }
      } catch (fetchError) {
        console.error('Resource verification failed:', fetchError);
      }
    }

    if (!videoExists) {
      return res.status(404).json({
        success: false,
        message: 'Source video not found',
        videoPublicId,
        videoUrl,
        suggestions: [
          'Verify the resource exists in your Cloudinary media library',
          'Check if the video was uploaded to the correct Cloudinary account',
          'Ensure the public_id includes the full path (e.g., "folder/file")'
        ]
      });
    }

    // 5. Resource management with enhanced safety
    const cleanupResults = await Promise.allSettled([
      // Delete destination resources if they exist
      cloudinary.uploader.destroy(newVideoId, {
        resource_type: 'video',
        invalidate: true
      }),
      cloudinary.uploader.destroy(newThumbId, {
        invalidate: true
      }),
      
      // Delete old lesson resources if they exist
      ...(lesson.video?.publicId ? [
        cloudinary.uploader.destroy(lesson.video.publicId, {
          resource_type: 'video',
          invalidate: true
        })
      ] : []),
      ...(lesson.video?.thumbnailPublicId ? [
        cloudinary.uploader.destroy(lesson.video.thumbnailPublicId, {
          invalidate: true
        })
      ] : [])
    ]);

    // 6. Move resources with multiple fallbacks
    let movedVideo, movedThumbnail;

    try {
      // Primary method: Cloudinary rename
      movedVideo = await cloudinary.uploader.rename(
        videoPublicId,
        newVideoId,
        {
          resource_type: 'video',
          invalidate: true,
          overwrite: true
        }
      );

      // Thumbnail handling with multiple fallbacks
      if (thumbExists) {
        try {
          movedThumbnail = await cloudinary.uploader.rename(
            thumbnailPublicId,
            newThumbId,
            {
              invalidate: true,
              overwrite: true
            }
          );
        } catch (thumbError) {
          console.warn('Thumbnail rename failed, using upload instead:', thumbError);
          movedThumbnail = await cloudinary.uploader.upload(thumbnailUrl, {
            public_id: newThumbId,
            invalidate: true
          });
        }
      } else {
        movedThumbnail = { secure_url: thumbnailUrl, public_id: null };
      }
    } catch (renameError) {
      console.error('Rename failed, trying upload instead:', renameError);
      
      // Fallback: Direct upload if rename fails
      movedVideo = await cloudinary.uploader.upload(videoUrl, {
        resource_type: 'video',
        public_id: newVideoId,
        invalidate: true
      });

      if (thumbnailUrl) {
        movedThumbnail = await cloudinary.uploader.upload(thumbnailUrl, {
          public_id: newThumbId,
          invalidate: true
        });
      }
    }

    // 7. Update lesson document
    lesson.video = {
      url: movedVideo.secure_url,
      publicId: movedVideo.public_id,
      thumbnailUrl: movedThumbnail?.secure_url || thumbnailUrl,
      thumbnailPublicId: movedThumbnail?.public_id || null
    };
    lesson.duration = formatDuration(duration);
    lesson.type = 'video';

    const updatedLesson = await lesson.save();

    return res.json({
      success: true,
      message: 'Video assigned successfully',
      lesson: updatedLesson,
      resources: {
        video: {
          oldId: videoPublicId,
          newId: movedVideo.public_id,
          url: movedVideo.secure_url
        },
        thumbnail: {
          oldId: thumbnailPublicId,
          newId: movedThumbnail?.public_id || 'not moved',
          url: movedThumbnail?.secure_url || thumbnailUrl
        }
      },
      cleanup: cleanupResults.map(r => r.status)
    });

  } catch (error) {
    console.error('Video assignment failed:', {
      error: error.message,
      stack: error.stack,
      context: {
        lessonId,
        videoPublicId,
        thumbnailPublicId,
        timestamp: new Date().toISOString()
      }
    });

    return res.status(500).json({
      success: false,
      message: 'Failed to assign video to lesson',
      error: error.message,
      suggestion: 'Try uploading the video again or contact support',
      reference: `ERR-${Date.now()}`
    });
  }
});
// @desc    Replace lesson video
// @route   PUT /api/media/replace/:lessonId
// @access  Private/Instructor
export const replaceLessonVideo = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;

  if (!req.file) {
    res.status(400);
    throw new Error('No video file uploaded');
  }

  const lesson = await Lesson.findById(lessonId).populate({
    path: 'module',
    populate: {
      path: 'course'
    }
  });

  if (!lesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  if (lesson.module.course.instructor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this lesson');
  }

  try {
    // Delete old video if exists
    if (lesson.video?.publicId) {
      await cloudinary.uploader.destroy(lesson.video.publicId, {
        resource_type: 'video'
      });
      if (lesson.video.thumbnailPublicId) {
        await cloudinary.uploader.destroy(lesson.video.thumbnailPublicId);
      }
    }

    // Process new video
    const videoData = await processVideo(req.file.path, {
      public_id: `course-${lesson.module.course._id}/module-${lesson.module._id}/lesson-${lesson._id}`,
      resource_type: 'video'
    });

    // Update lesson with new video data
    lesson.video = {
      url: videoData.videoUrl,
      publicId: videoData.videoPublicId,
      thumbnailUrl: videoData.thumbnailUrl,
      thumbnailPublicId: videoData.thumbnailPublicId
    };
    lesson.duration = formatDuration(videoData.duration);
    lesson.type = 'video';

    const updatedLesson = await lesson.save();
    res.json(updatedLesson);
  } catch (error) {
    console.error('Video replacement error:', error);
    res.status(500);
    throw new Error('Failed to replace video');
  }
});

// @desc    Delete uploaded media
// @route   DELETE /api/media/:id
// @access  Private/Instructor
export const deleteMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // First try to delete as video
    await cloudinary.uploader.destroy(id, { resource_type: 'video' });
  } catch (videoError) {
    try {
      // If not a video, try to delete as image
      await cloudinary.uploader.destroy(id);
    } catch (imageError) {
      console.error('Error deleting media:', imageError);
      res.status(404);
      throw new Error('Media not found');
    }
  }

  res.json({ message: 'Media removed' });
});

// @desc    Get video preview
// @route   GET /api/media/preview/:id
// @access  Private/Instructor
export const getVideoPreview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const resource = await cloudinary.api.resource(id, {
      resource_type: 'video'
    });

    res.json({
      id: resource.public_id,
      url: resource.secure_url,
      duration: resource.duration,
      thumbnail: resource.thumbnail_url,
      format: resource.format,
      size: resource.bytes
    });
  } catch (error) {
    console.error('Error fetching video preview:', error);
    res.status(404);
    throw new Error('Video not found');
  }
});

// Helper function to format duration (seconds to MM:SS)
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}