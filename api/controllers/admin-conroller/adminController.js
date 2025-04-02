import User from '../../models/User.js';

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
