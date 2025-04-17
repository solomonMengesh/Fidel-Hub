import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { config } from 'dotenv';

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for images (for thumbnails)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'course-thumbnails', // Cloudinary folder for images
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// Storage for video uploads
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'course-videos', // Cloudinary folder for videos
    resource_type: 'video', // This ensures it's uploaded as a video
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
    chunk_size: 6000000 // 6MB chunks for large files
  }
});

// Set up multer with storage
const upload = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

export { upload, uploadVideo };
