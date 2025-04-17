import ffmpeg from 'fluent-ffmpeg';
import { v2 as cloudinary } from 'cloudinary';
import { promisify } from 'util';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { uploadToCloudinary, uploadVideoToCloudinary } from './cloudStorage.js';

config();

const unlinkAsync = promisify(fs.unlink);

// Utility to extract public ID from a Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const last = parts.pop();
  return last.split('.')[0]; // remove extension
};

export const processVideo = async (filePath, options = {}) => {
  // Ensure we're using the correct directory for temporary files
  const tempDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Generate thumbnail path in the temp directory
  const thumbnailName = `thumb-${path.basename(filePath, path.extname(filePath))}.jpg`;
  const thumbnailPath = path.join(tempDir, thumbnailName);

  let duration = 0;
  try {
    // Generate thumbnail
    await new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .screenshots({
          timestamps: ['10%'],
          filename: thumbnailName,
          folder: tempDir,
          size: '640x360'
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Get video duration
    duration = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata.format.duration);
      });
    });

    // Upload video to Cloudinary
    const videoUpload = await uploadVideoToCloudinary(filePath, options);

    // Upload thumbnail to Cloudinary
    const thumbnailUpload = await uploadToCloudinary(thumbnailPath, {
      folder: options.thumbnailFolder || 'video-thumbnails'
    });

    return {
      videoUrl: videoUpload.url,
      videoPublicId: videoUpload.publicId,
      thumbnailUrl: thumbnailUpload.url,
      thumbnailPublicId: thumbnailUpload.publicId,
      duration: Math.round(duration || 0)
    };
  } catch (error) {
    console.error('Video processing error:', error);
    throw error;
  } finally {
    // Clean up even if error occurs
    try { await unlinkAsync(filePath); } catch (e) {}
    try { await unlinkAsync(thumbnailPath); } catch (e) {}
  }
};

export const generateVideoThumbnail = async (videoPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['10%'],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '640x360'
      })
      .on('end', () => resolve(outputPath))
      .on('error', reject);
  });
};

export const getVideoDuration = async (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration);
    });
  });
};
