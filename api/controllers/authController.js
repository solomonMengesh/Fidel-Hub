import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { uploadImage, uploadPDF } from '../middleware/uploadMiddleware.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../Email Service/emailService.js';

 export const registerUser = async (req, res) => {
  const { name, email, phone, role, expertise, password, confirmPassword } = req.body;

   if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

     if (role === 'instructor') {
      if (!expertise) {
        return res.status(400).json({ message: 'Expertise is required for instructors' });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'CV is required for instructors' });
      }
    }

     const user = new User({
      name,
      email,
      phone,
      role,
      expertise: role === 'instructor' ? expertise : null, 
      cv: role === 'instructor' ? req.file.path : null,  
      password, 
    });

    await user.save();

     const otp = user.generateOTP();  
    await user.save(); 
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

     if (!user.isVerified) {
      if (!otp) {
         const generatedOtp = user.generateOTP();
        await user.save();
        await sendEmail(user.email, 'Your OTP Code', `Your OTP code is: ${generatedOtp}`);
        
        return res.status(400).json({ message: "OTP required to verify your account. Check your email." });
      }

       const isOtpValid = user.verifyOTP(otp);
      if (!isOtpValid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

       user.isVerified = true;
      await user.save();
    }

    if (user.role === "instructor" && !user.isApproved) {
       
      return res.status(403).json({ message: "Your account is pending approval by an admin." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
     

     res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",  
      sameSite: "strict", 
      maxAge: 1 * 24 * 60 * 60 * 1000,  
    });

    res.status(200).json({ message: "Login successful", user, token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


 
export const logoutUser = (req, res) => {
  try {
     res.clearCookie("token"); 
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


 
export const getMe = async (req, res) => {
  try {
    

     const user = await User.findById(req.user.id);  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);  
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
