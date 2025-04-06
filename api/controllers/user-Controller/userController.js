// controllers/userController.js
import User from '../../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password'); // Use req.params.userId
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { name, email, bio } = req.body;
  const profilePic = req.file ? `/uploads/avatars/${req.file.filename}` : undefined;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    if (profilePic) user.profilePic = profilePic;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export const updateUserPassword = async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(userId).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // if (!currentPassword || !newPassword || !confirmPassword) {
    //   return res.status(400).json({ message: 'All fields are required' });
    // }

    // if (newPassword !== confirmPassword) {
    //   return res.status(400).json({ message: 'New passwords do not match' });
    // }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};