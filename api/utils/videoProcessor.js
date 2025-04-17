import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Extract video metadata and generate thumbnail
 * @param {string} videoPath - Path to video file
 * @returns {Promise<{duration: string, thumbnailPath: string}>}
 */
export const processVideo = (videoPath) => {
  return new Promise((resolve, reject) => {
    const thumbnailName = `thumb-${uuidv4()}.jpg`;
    const thumbnailPath = path.join(path.dirname(videoPath), thumbnailName);

    ffmpeg(videoPath)
      .on('end', () => {
        // Get duration after processing
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
          if (err) return reject(err);

          const duration = metadata.format.duration;
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

          resolve({
            duration: formattedDuration,
            thumbnailPath: thumbnailName
          });
        });
      })
      .on('error', (err) => reject(err))
      .screenshots({
        timestamps: ['50%'], // Capture at 50% of video
        filename: thumbnailName,
        folder: path.dirname(videoPath),
        size: '320x180'
      });
  });
};

/**
 * Delete video and associated files
 * @param {string} videoPath - Path to video file
 * @param {string} thumbnailPath - Path to thumbnail file
 */
export const cleanupVideoFiles = (videoPath, thumbnailPath) => {
  try {
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    if (thumbnailPath && fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
  } catch (err) {
    console.error('Error cleaning up video files:', err);
  }
};
