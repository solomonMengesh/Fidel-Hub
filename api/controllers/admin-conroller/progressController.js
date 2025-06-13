import Progress from "../../models/Progress.js";
import Course from "../../models/Course.js";

export const getCategoryCompletionRates = async (req, res) => {
  try {
    const aggregation = await Progress.aggregate([
      {
        $group: {
          _id: "$courseId",
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $gte: ["$progressPercentage", 100] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $group: {
          _id: "$course.category",
          total: { $sum: "$total" },
          completed: { $sum: "$completed" },
        },
      },
      {
        $project: {
          category: "$_id",
          _id: 0,
          total: 1,
          completed: 1,
          percentage: {
            $multiply: [{ $divide: ["$completed", "$total"] }, 100],
          },
        },
      },
      { $sort: { percentage: -1 } },
      { $limit: 6 }, // Top 6 categories
    ]);

    const formatted = aggregation.map((item) => ({
      name: item.category,
      completed: Math.round(item.percentage),
      total: item.total,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching completion data by category:", error);
    res.status(500).json({ message: "Failed to load category completion data" });
  }
};
