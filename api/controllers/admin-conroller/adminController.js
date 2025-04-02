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
