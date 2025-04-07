import User from '../../models/User.js';
import { sendEmail } from '../../Email Service/emailService.js';

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    
    // Generate OTP and store it in the database
    const otp = user.generateOTP();
    await user.save();

    // Send OTP via email
    await sendEmail(email, 'Your OTP Code', `Your OTP code is: ${otp}`);
    
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error generating OTP', error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    
    const isValid = user.verifyOTP(otp);
    if (!isValid) return res.status(400).json({ message: 'Invalid or expired OTP You can ' });
    
    user.isVerified = true;
    await user.save();
    
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};





// Password reset request (send OTP to email)
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Generate OTP for password reset
      const otp = user.generatePasswordResetOTP();
      await user.save(); // Save OTP and expiration time in the user model
  
      // Send OTP to user's email
      await sendEmail(email, 'Password Reset OTP', `Your password reset OTP is: ${otp}`);
  
      res.status(200).json({ message: 'OTP sent to your email for password reset' });
    } catch (error) {
      res.status(500).json({ message: 'Error requesting password reset', error: error.message });
    }
  };


  // Verify OTP for password reset
  export const verifyPasswordResetOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Log OTP and expiry details for debugging
      console.log('Stored OTP:', user.otp); // Log stored OTP
      console.log('OTP Expiry:', user.otpExpiry); // Log OTP expiration time
      console.log('Received OTP:', otp); // Log received OTP
  
      // Verify OTP
      const isOtpValid = user.verifyPasswordResetOTP(otp);
      console.log('Is OTP valid:', isOtpValid); // Log whether OTP is valid
  
      if (!isOtpValid) {
        return res.status(400).json({ message: 'Invalid or expired OTPw' });
      }
  
      res.status(200).json({ message: 'verified successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
  };
  
  

  // Reset password after OTP verification
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Verify OTP
      const isOtpValid = user.verifyPasswordResetOTP(otp);
      if (!isOtpValid) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
      // Update password
      user.password = newPassword; // This will trigger the pre-save hook and hash the password
      user.passwordResetOtp = undefined; // Clear the OTP after successful password reset
      user.passwordResetOtpExpiration = undefined; // Clear expiration time
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
  };
  