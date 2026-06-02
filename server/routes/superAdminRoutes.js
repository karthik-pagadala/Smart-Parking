import express from 'express';
import { 
  getPendingAdmins, 
  verifyAdmin, 
  getAnalytics, 
  getAllUsers, 
  manageAccount 
} from '../controllers/superAdminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply superadmin protection to all routes in this file
router.use(protect);
router.use(authorizeRoles('superadmin'));

router.get('/pending-admins', getPendingAdmins);
router.put('/verify-admin/:id', verifyAdmin);
router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.put('/manage-account/:type/:id', manageAccount);

export default router;
