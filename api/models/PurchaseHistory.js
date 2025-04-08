 const mongoose = require('mongoose');

const purchaseHistorySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'failed'],
    required: true
  },
  transactionDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseHistory', purchaseHistorySchema);
