import multer from "multer";
import path from "path";
import fs from "fs";

// Setting up the storage location and file naming convention
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/chat"; // This is where the files will be saved
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`; // Generating a unique name for the file
    cb(null, uniqueName);
  },
});

// Creating the upload middleware using multer
export const upload = multer({ storage });
