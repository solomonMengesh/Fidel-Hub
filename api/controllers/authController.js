import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { uploadImage, uploadPDF } from '../middleware/uploadMiddleware.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../Email Service/emailService.js';

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, phone, role, expertise, password, confirmPassword } = req.body;

  // Validation checks
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Only instructors should have expertise, and CV is required for instructors
    if (role === 'instructor') {
      if (!expertise) {
        return res.status(400).json({ message: 'Expertise is required for instructors' });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'CV is required for instructors' });
      }
    }

    // Create user
    const user = new User({
      name,
      email,
      phone,
      role,
      expertise: role === 'instructor' ? expertise : null, // Add expertise only if role is instructor
      cv: role === 'instructor' ? req.file.path : null, // Store the file path of CV if role is instructor
      password, // Password will be hashed by the schema pre-save hook
    });

    await user.save();

    // Generate OTP and send it via email
    const otp = user.generateOTP(); // Generates OTP and stores it in user model
    await user.save(); // Save OTP in the user model
    await sendEmail(email, 'Your OTP Code', `Your OTP code is: ${otp}`);

    res.status(201).json({ message: 'Registration successful! Please verify your email with the OTP sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const loginUser = async (req, res) => {
  const { email, password, otp } = req.body;  

   

  try {
    const user = await User.findOne({ email });
     

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
     

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.blocked) {
      return res.status(403).json({ message: "Your account has been blocked by the admin." });
    }

    // Check if the user has verified their OTP
    if (!user.isVerified) {
      if (!otp) {
        // If OTP is not provided, send it to the user's email
        const generatedOtp = user.generateOTP();
        await user.save();
        await sendEmail(user.email, 'Your OTP Code', `Your OTP code is: ${generatedOtp}`);
        
        return res.status(400).json({ message: "OTP required to verify your account. Check your email." });
      }

      // If OTP is provided, verify it
      const isOtpValid = user.verifyOTP(otp);
      if (!isOtpValid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // OTP is valid, mark user as verified
      user.isVerified = true;
      await user.save();
    }

    if (user.role === "instructor" && !user.isApproved) {
       
      return res.status(403).json({ message: "Your account is pending approval by an admin." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
     

    // ✅ Set the token as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Login successful", user, token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// User logout
export const logoutUser = (req, res) => {
  try {
    // Invalidate JWT token (client-side action needed as well)
    res.clearCookie("token"); // Optionally clear cookie if using it to store the token
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// In your authController.js

export const getMe = async (req, res) => {
  try {
    

    // If you are storing the user ID in the JWT token, you can get it from req.user
    const user = await User.findById(req.user.id); // Find the user by ID from the decoded JWT
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Return the user data as the response
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
