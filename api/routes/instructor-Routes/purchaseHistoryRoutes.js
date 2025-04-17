import express from 'express';
import { recordPurchase, getPurchaseHistory } from '../../controllers/Instructor-controller/purchaseHistory.js';

const router = express.Router();

// Record a purchase for a student
router.post('/', recordPurchase);

// Get the purchase history of a student
router.get('/:studentId', getPurchaseHistory);

export default router;
