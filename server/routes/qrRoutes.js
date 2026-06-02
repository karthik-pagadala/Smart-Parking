import express from 'express';
import { scanQRCode } from '../controllers/qrController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/scan', protect, authorizeRoles('admin'), scanQRCode);

export default router;
