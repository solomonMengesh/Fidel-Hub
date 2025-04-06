import express from 'express';
import { sendOtp, verifyOtp,requestPasswordReset, verifyPasswordResetOtp, resetPassword } from '../../controllers/otp-Controller/otpController.js';

const router = express.Router();

// Route to send OTP
router.post('/send-otp', sendOtp);

// Route to verify OTP
router.post('/verify-otp', verifyOtp);
router.post('/request-password-reset', requestPasswordReset);  // Send OTP for password reset
router.post('/verify-password-reset-otp', verifyPasswordResetOtp);  // Verify OTP
router.post('/reset-password', resetPassword);  // Reset the password
export default router;
