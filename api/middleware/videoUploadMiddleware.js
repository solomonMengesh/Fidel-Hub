import multer from 'multer';
import path from 'path';

// Set up storage configuration for multer (video upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/lessons/');  // Store video in 'uploads/lessons/'
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  // Get file extension
    const filename = `${Date.now()}${ext}`;  // Generate a unique filename
    cb(null, filename);
  }
});

// Create multer instance for video upload
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|avi|mov|mkv/;  // Allowed video file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only MP4, AVI, MOV, MKV videos are allowed.'));
  },
  limits: { fileSize: 50 * 1024 * 1024 }  // Limit video size to 50MB
}).single('lessonVideo');  // 'lessonVideo' is the field name in the form

export default upload;
