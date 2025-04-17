import PurchaseHistory from '../../models/PurchaseHistory.js';

// Record a purchase
export const recordPurchase = async (req, res) => {
  try {
    const purchase = await PurchaseHistory.create(req.body);
    res.status(201).json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get purchase history for a student
export const getPurchaseHistory = async (req, res) => {
  const { studentId } = req.params;
  const purchases = await PurchaseHistory.find({ studentId });
  res.json(purchases);
};
