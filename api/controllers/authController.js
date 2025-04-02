import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import upload from '../middleware/uploadMiddleware.js'; // Import your multer upload middleware
import jwt from 'jsonwebtoken';

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
    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email });

  try {
    const user = await User.findOne({ email });
    console.log("User found:", user ? user._id : "No user found");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.role === "instructor" && !user.isApproved) {
      console.log("Instructor approval status:", user.isApproved);
      return res.status(403).json({ message: "Your account is pending approval by an admin." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log("JWT Token generated:", token);

    res.json({ token, user });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
