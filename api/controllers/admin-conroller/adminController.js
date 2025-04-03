import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

export const approveInstructor = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Instructor not found" });
        }

        if (user.role !== 'instructor') {
            return res.status(400).json({ message: "User is not an instructor" });
        }

        if (user.isApproved) {
            return res.status(400).json({ message: "Instructor is already approved" });
        }

        user.isApproved = true;
        user.status = 'active';
        await user.save();

        res.json({ message: "Instructor approved successfully!" });

    } catch (error) {
        console.error("Error approving instructor:", error);
        res.status(500).json({ message: "Server error" });
    }
};
 

// Reject and delete instructor
export const rejectInstructor = async (req, res) => {
  try {
    const { id } = req.params; // Get instructor ID from URL params

    // Find the instructor by their ID
    const instructor = await User.findById(id);

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Check if the user is an instructor and is pending approval
    if (instructor.role !== 'instructor' || instructor.isApproved) {
      return res.status(400).json({ message: 'Instructor cannot be rejected or is already approved' });
    }

    // Delete the instructor from the database
    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Instructor rejected and deleted successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// List all pending instructors for approval
export const listPendingInstructors = async (req, res) => {
  try {
    const pendingInstructors = await User.find({ role: 'instructor', isApproved: false });

    return res.status(200).json({ pendingInstructors });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

//  List All Active Instructors
export const listActiveInstructors = async (req, res) => {
  try {
    const activeInstructors = await User.find({ role: 'instructor', isApproved: true })
      .select('name email phone status createdAt');

    res.status(200).json({ activeInstructors });

  } catch (error) {
    console.error("Error listing active instructors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  List ALL Users (Students, Instructors, Admins)
export const listAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email phone role status createdAt');

    res.status(200).json({ users });

  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUsersByRole = async (req, res) => {
  const { role } = req.params; 

  try {
    const users = await User.find({ role });

    if (users.length === 0) {
      return res.status(404).json({ message: `No users found with the role: ${role}` });
    }

    res.status(200).json({ users });

  } catch (error) {
    console.error("Error retrieving users by role:", error);
    res.status(500).json({ message: 'Server error' });
  }
};