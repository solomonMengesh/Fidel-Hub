import multer from 'multer';
import path from 'path';

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/courses/');  // Define folder for course images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  // Get file extension
    const filename = `${Date.now()}${ext}`;  // Create unique filename
    cb(null, filename);
  }
});

// Create the multer upload instance
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;  // Allowed file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }  // Limit file size to 5MB
}).single('courseImage');  // 'courseImage' is the field name in the form

export default upload;
