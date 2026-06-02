import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, authorizeRoles('user'), createOrder);
router.post('/verify', protect, authorizeRoles('user'), verifyPayment);

export default router;
