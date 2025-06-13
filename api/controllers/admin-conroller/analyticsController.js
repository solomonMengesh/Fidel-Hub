import User from "../../models/User.js";
import Course from "../../models/Course.js";

export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInstructors = await User.countDocuments({ role: "instructor" });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCourses = await Course.countDocuments();

    return res.json({
      totalUsers,
      totalInstructors,
      totalStudents,
      totalCourses,
    });
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getUserGrowthData = async (req, res) => {
  try {
    const growth = await User.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const formatted = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    for (let i = 1; i <= 6; i++) {
      const monthData = { name: monthNames[i - 1], students: 0, instructors: 0 };
      for (const entry of growth) {
        if (entry._id.month === i) {
          if (entry._id.role === "student") {
            monthData.students = entry.count;
          } else if (entry._id.role === "instructor") {
            monthData.instructors = entry.count;
          }
        }
      }
      formatted.push(monthData);
    }

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching user growth:", error);
    res.status(500).json({ message: "Failed to load user growth" });
  }
};
