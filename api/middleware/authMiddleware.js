// uploadMiddleware.js
import multer from 'multer';
import path from 'path';

// File storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Path to store the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to make filenames unique
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

export default upload;
