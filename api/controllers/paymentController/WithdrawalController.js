 import User from '../../models/User.js';
import { testModeWithdrawal } from '../../utils/chapaTest.js';

 import Withdrawal from '../../models/Withdrawal.js';

export const instructorTestWithdraw = async (req, res) => {
  try {
    const { account_name, account_number, bank_code, amount, bank_name } = req.body;
    const instructor = await User.findById(req.user._id);

    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
    if (instructor.availableBalance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    const result = await testModeWithdrawal({ account_name, account_number, bank_code, amount });

    const reference = result?.data || `FIDEL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newWithdrawal = await Withdrawal.create({
      user: req.user._id,
      amount,
      reference,
      status: result.status === 'success' ? 'success' : 'failed',
      responseMessage: result.message,
      bankName: bank_name,
      accountNumber: account_number,
    });

    instructor.availableBalance -= amount;
    await instructor.save();

    return res.status(200).json({
      message: 'Withdrawal successful (test mode)',
      transaction: result,
      remainingBalance: instructor.availableBalance.toFixed(1),
      withdrawal: newWithdrawal,
    });
  } catch (error) {
    console.error('Withdrawal Processing Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};


export const getWithdrawalHistory = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ withdrawals });
  } catch (error) {
    console.error('Error fetching withdrawal history:', error.message);
    return res.status(500).json({ error: error.message });
  }
};


export const getInstructorBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('availableBalance');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format the balance to one decimal place
    const formattedBalance = Number(user.availableBalance).toFixed(1);

    return res.status(200).json({
      message: 'Instructor balance retrieved successfully',
      balance: parseFloat(formattedBalance),
    });
  } catch (error) {
    console.error('Error retrieving instructor balance:', error.message);
    return res.status(500).json({ error: error.message });
  }
};


