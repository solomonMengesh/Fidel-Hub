import Payment from '../../models/Transaction.js'; // Adjust the path as necessary
import mongoose from 'mongoose';

export const getInstructorDashboard = async (req, res) => {
    try {
      const instructorId = req.user._id;
      const { startDate, endDate } = req.query;
  
      const matchStage = {
        instructorId: new mongoose.Types.ObjectId(instructorId),
      };
  
      if (startDate && endDate) {
        matchStage.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
  
       const summaryResult = await Payment.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalInstructorEarnings: { $sum: '$instructorShare' },
            totalPlatformRevenue: { $sum: '$platformShare' },
            totalReceived: { $sum: '$amountPaid' }
          }
        }
      ]);
  
      const summary = summaryResult[0] || {
        totalInstructorEarnings: 0,
        totalPlatformRevenue: 0,
        totalReceived: 0
      };
  
      // Per Course Revenue with Student Name
      const perCourseRevenue = await Payment.aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        { $unwind: '$student' },
        {
          $lookup: {
            from: 'courses',
            localField: 'courseId',
            foreignField: '_id',
            as: 'course'
          }
        },
        { $unwind: '$course' },
        {
          $group: {
            _id: '$courseId',
            totalEarnings: { $sum: '$instructorShare' },
            totalPayments: { $sum: '$amountPaid' },
            studentCount: { $sum: 1 },
            courseName: { $first: '$course.title' },
            students: { $addToSet: '$student.name' }
          }
        }
      ]);
  
      res.json({
        summary,
        perCourseRevenue
      });
    } catch (err) {
      console.error('Error in getInstructorDashboard:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
