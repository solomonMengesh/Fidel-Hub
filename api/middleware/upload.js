import multer from 'multer';
import path from 'path';

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';
    if (file.fieldname === 'courseImage') {
      uploadPath = 'uploads/courseImages'; // Folder for course images
    } else if (file.fieldname === 'lessonVideo') {
      uploadPath = 'uploads/lessonVideos'; // Folder for lesson videos
    }
    cb(null, uploadPath); // Where to store the uploaded file
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Use a timestamp for unique filenames
  },
});

// Multer file filter for video files and images
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'lessonVideo' && !file.mimetype.startsWith('video')) {
    return cb(new Error('Only video files are allowed!'), false);
  } else if (file.fieldname === 'courseImage' && !file.mimetype.startsWith('image')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true); // Accept the file
};

// Create the multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
});

export default upload;
