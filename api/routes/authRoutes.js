import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import upload from '../middleware/uploadMiddleware.js'; // Import the upload middleware

const router = express.Router();

// Apply the upload middleware to the register route
router.post('/register', upload.single('cv'), registerUser); // 'cv' is the name of the file field in the form
router.post('/login', loginUser);

export default router;
