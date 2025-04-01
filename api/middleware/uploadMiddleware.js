import multer from 'multer';
import path from 'path';

// File storage setup (you can adjust the path as needed)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store files in an 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// File filter (only allow PDFs)
const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are allowed.'));
  }
  cb(null, true);
};

// Initialize multer with storage and file filter
const upload = multer({ storage, fileFilter });

export default upload;
