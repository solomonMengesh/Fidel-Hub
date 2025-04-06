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
    },
  });

// File filters
const pdfFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are allowed.'));
  }
  cb(null, true);
};

const imageFilter = (req, file, cb) => {
  const allowedExt = /jpeg|jpg|png|gif|bmp|svg|webp|tiff/; // Add other image extensions here
  const allowedMime = /image\/(jpeg|png|gif|bmp|svg\+xml|webp|tiff)/; // Add corresponding MIME types here

  const isValidExt = allowedExt.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedMime.test(file.mimetype);

  if (!isValidExt || !isValidMime) {
    return cb(new Error('Only image files are allowed.'));
  }

  cb(null, true);
};


// Export specific uploaders
export const uploadPDF = multer({
  storage: storage('cvs'),
  fileFilter: pdfFilter,
});

export const uploadImage = multer({
    storage: storage('avatars'),
    fileFilter: imageFilter,
  });