import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const profileChangeMiddleware = async (req, res, next) => {
  try {
    // 1. Authentication
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 2. User verification
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;

    // 3. Request validation
    const allowedFields = ['name', 'email', 'bio', 'profilePic'];
    const bodyUpdates = Object.keys(req.body).filter(key => allowedFields.includes(key));
    
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);
    console.log('Detected Updates:', bodyUpdates);

    // 4. Flexible validation rules
    const isFileUpload = !!req.file;
    const hasBodyUpdates = bodyUpdates.length > 0;
    const isJsonRequest = req.headers['content-type']?.includes('application/json');
    
    // Allow if:
    // - JSON request with valid fields (including profilePic) OR
    // - Form-data with file upload OR
    // - Form-data with at least one valid field
    if (!isFileUpload && !hasBodyUpdates) {
      return res.status(400).json({ 
        message: 'No valid updates provided',
        details: {
          required: 'Either provide valid fields (name, email, bio, profilePic) or upload a file',
          received: {
            body: req.body,
            file: req.file ? 'File attached' : 'No file'
          }
        }
      });
    }

    // 5. Special handling for profilePic in JSON
    if (isJsonRequest && req.body.profilePic) {
      // Validate URL format if needed
      if (!req.body.profilePic.startsWith('/uploads/avatars/')) {
        return res.status(400).json({ 
          message: 'Invalid profilePic path',
          hint: 'Must start with /uploads/avatars/'
        });
      }
    }

    next();
  } catch (error) {
    console.error('Profile middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ 
      message: 'Profile update validation failed',
      error: error.message 
    });
  }
};