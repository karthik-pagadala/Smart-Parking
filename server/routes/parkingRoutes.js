import express from 'express';
import { 
  getAllParkings, 
  getParkingById, 
  addParking, 
  updateParking, 
  deleteParking, 
  getNearbyParkings 
} from '../controllers/parkingController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/all', getAllParkings);
router.get('/nearby', getNearbyParkings);
router.get('/:id', getParkingById);

// Admin only routes
router.post('/add', protect, authorizeRoles('admin'), upload.array('images', 5), addParking);
router.put('/:id', protect, authorizeRoles('admin'), updateParking);
router.delete('/:id', protect, authorizeRoles('admin'), deleteParking);

export default router;
