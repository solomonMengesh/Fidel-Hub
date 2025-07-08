import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

     

    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // ✅ **Block Check: Prevent blocked users from proceeding**
    if (user.blocked) {
      return res.status(403).json({ message: "Your account has been blocked." });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);
    res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  }
};
export const instructor = (req, res, next) => {
  if (req.user && req.user.role === 'instructor') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an instructor');
  }
};
export const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token; 
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

     if (user.blocked) {
      return res.status(403).json({ message: "Your account has been blocked." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Protect Middleware Error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
