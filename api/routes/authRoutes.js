import express from 'express';
import { registerUser, loginUser ,logoutUser ,getMe } from '../controllers/authController.js';
import upload from '../middleware/uploadMiddleware.js'; // Import the upload middleware
import { protect } from '../middleware/authMiddleware.js'; // Import the JWT protection middleware

const router = express.Router();

// Apply the upload middleware to the register route
router.post('/register', upload.single('cv'), registerUser); // 'cv' is the name of the file field in the form
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe); // Get current user info (protected route)

export default router;
