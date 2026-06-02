import express from 'express';
import { lockSlot, releaseSlot, getSlotStatus } from '../controllers/slotController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/lock', protect, authorizeRoles('user'), lockSlot);
router.post('/release', protect, authorizeRoles('user'), releaseSlot);
// This route can be public or protected, making it protected to check if 'lockedByMe'
router.get('/status/:parkingId/:slotNumber', protect, getSlotStatus);

export default router;
