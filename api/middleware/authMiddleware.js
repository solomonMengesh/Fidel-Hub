import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

export const adminAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log("Received Token: ", token); // Add this line to check if the token is passed properly

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use JWT secret from environment variable

    // Find the user based on decoded information (like _id)
    const user = await User.findById(decoded.id);

    // Check if the user exists and is an admin
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Attach the user to the request object for later use
    req.user = user;

    // Call next to continue to the route handler
    next();
  } catch (error) {
    console.log(error);  // Log the error to see the full stack trace
    res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  }
};
