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

 
export const protect = (req, res, next) => {
  let token;

  // Get token from cookies or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token; // If using cookies
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // If using Bearer token in Authorization header
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request object
    next(); // Move to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
}

