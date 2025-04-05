import express from 'express';
import { updateProfile, updateUserPassword } from '../../controllers/user-Controller/userController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { uploadImage } from '../../middleware/uploadMiddleware.js';

const router = express.Router();

// Update account info
router.put(
  '/profile',
  protect,
  uploadImage.single('profilePic'),
  updateProfile
);

// Change password
router.put('/profile/password', protect, updateUserPassword);

export default router;
