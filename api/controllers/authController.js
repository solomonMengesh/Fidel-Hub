import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, phone, role, expertise, password, confirmPassword, cv } = req.body;

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
      if (!cv) {
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
      cv: role === 'instructor' ? cv : null, // Store CV if role is instructor
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

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Compare the password using the method from the schema
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate a token
    const token = generateToken(user._id);

    // Return success message and token
    res.json({ message: 'Login successful!', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
