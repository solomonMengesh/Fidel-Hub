import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create upload directory if it doesn't exist
const ensureUploadPath = (folder) => {
  const dir = `uploads/${folder}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

// Generic storage config
const storage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = ensureUploadPath(folder);
      cb(null, dir); // Store in dynamic subfolder
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const name = req.user?.name?.replace(/\s+/g, '-') || 'user';
      cb(null, `${name}-${Date.now()}${ext}`);
    }
    
  });

// File filters
const pdfFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are allowed.'));
  }
  cb(null, true);
};

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const isValid =
    allowed.test(path.extname(file.originalname).toLowerCase()) &&
    allowed.test(file.mimetype);
  if (!isValid) {
    return cb(new Error('Only image files (jpg, jpeg, png) are allowed.'));
  }
  cb(null, true);
};

// Export specific uploaders
export const uploadPDF = multer({
  storage: storage('pdfs'),
  fileFilter: pdfFilter,
});

export const uploadImage = multer({
  storage: storage('profile-pics'),
  fileFilter: imageFilter,
});
