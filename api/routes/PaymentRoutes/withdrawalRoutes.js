import express from 'express';
import { instructorTestWithdraw,getInstructorBalance  ,getWithdrawalHistory} from '../../controllers/paymentController/WithdrawalController.js';
import { getInstructorDashboard} from '../../controllers/paymentController/InstructorIncomeController.js';

import { protect} from '../../middleware/authMiddleware.js';
 
const router = express.Router();

router.post('/withdraw/test', protect, instructorTestWithdraw);
router.get('/balance',protect, getInstructorBalance );
router.get('/history', protect, getWithdrawalHistory);
router.get('/InstructorEarnings', protect,getInstructorDashboard);

export default router;

