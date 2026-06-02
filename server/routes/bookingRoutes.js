import express from 'express';
import {
  createBooking,
  getMyBookings,
  getAdminBookingRequests,
  approveBooking,
  rejectBooking,
  cancelBooking,
  getBookingHistory,
  getBookedSlots
} from '../controllers/bookingController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// ⚠️ IMPORTANT: specific routes BEFORE /:id routes
router.get('/booked-slots', protect, getBookedSlots);
router.get('/my-bookings', protect, authorizeRoles('user'), getMyBookings);
router.get('/requests', protect, authorizeRoles('admin'), getAdminBookingRequests);
router.get('/history', protect, getBookingHistory);

router.post('/create', protect, authorizeRoles('user'), createBooking);
router.put('/:id/cancel', protect, authorizeRoles('user'), cancelBooking);
router.put('/:id/approve', protect, authorizeRoles('admin'), approveBooking);
router.put('/:id/reject', protect, authorizeRoles('admin'), rejectBooking);

export default router;