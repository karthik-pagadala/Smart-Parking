import Booking from '../models/Booking.js';
import SlotLock from '../models/SlotLock.js';
import Parking from '../models/Parking.js';
import { sendBookingConfirmationEmail } from '../utils/emailService.js';

// @desc    Create new booking
// @route   POST /api/booking/create
export const createBooking = async (req, res) => {
  try {
    const { parkingId, adminId, slotNumber, date, startTime, endTime, vehicleType, vehicleNumber, totalPrice } = req.body;

    const existingBooking = await Booking.findOne({
      parkingId,
      slotNumber,
      date: new Date(date),
      status: { $in: ['pending', 'approved', 'Pending', 'Approved'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Slot already booked for this date' });
    }

    const booking = new Booking({
      userId: req.user._id,
      parkingId,
      adminId,
      slotNumber,
      date,
      startTime,
      endTime,
      vehicleType,
      vehicleNumber,
      totalPrice,
      status: 'pending',
      paymentStatus: 'Unpaid'
    });

    const createdBooking = await booking.save();

    // Release slot lock
    await SlotLock.findOneAndDelete({ userId: req.user._id, slotNumber, parkingId });

    res.status(201).json(createdBooking);
  } catch (error) {
    console.log('CREATE BOOKING ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's active bookings (pending + approved)
// @route   GET /api/booking/my-bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
      status: { $in: ['pending', 'approved', 'Pending', 'Approved'] }
    }).populate('parkingId', 'name address location');
    res.json(bookings);
  } catch (error) {
    console.log('MY BOOKINGS ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin's booking requests
// @route   GET /api/booking/requests
export const getAdminBookingRequests = async (req, res) => {
  try {
    const bookings = await Booking.find({
      adminId: req.user._id,
      status: { $in: ['pending', 'Pending'] }
    })
      .populate('userId', 'name email phone')
      .populate('parkingId', 'name');
    res.json(bookings);
  } catch (error) {
    console.log('ADMIN REQUESTS ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve booking
// @route   PUT /api/booking/:id/approve
export const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('userId', 'email name');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.adminId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Unauthorized' });

    booking.status = 'approved';
    const updatedBooking = await booking.save();

    try {
      await sendBookingConfirmationEmail(booking.userId.email, booking);
    } catch (emailErr) {
      console.log('Email failed:', emailErr.message);
    }

    res.json(updatedBooking);
  } catch (error) {
    console.log('APPROVE BOOKING ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject booking
// @route   PUT /api/booking/:id/reject
export const rejectBooking = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.adminId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Unauthorized' });

    booking.status = 'rejected';
    booking.rejectionReason = rejectionReason || 'No reason provided';
    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } catch (error) {
    console.log('REJECT BOOKING ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/booking/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Unauthorized' });

    booking.status = 'cancelled';
    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } catch (error) {
    console.log('CANCEL BOOKING ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking history (completed + cancelled + rejected)
// @route   GET /api/booking/history
export const getBookingHistory = async (req, res) => {
  try {
    // Handle both lowercase and capitalized status values from seed/manual data
    const statusFilter = {
      $in: ['completed', 'cancelled', 'rejected', 'Completed', 'Cancelled', 'Rejected']
    };

    let query = { status: statusFilter };

    if (req.user.role === 'user') {
      query.userId = req.user._id;
    } else if (req.user.role === 'admin') {
      query.adminId = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('parkingId', 'name address')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.log('HISTORY ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booked slots for a parking on a date
// @route   GET /api/booking/booked-slots
export const getBookedSlots = async (req, res) => {
  try {
    const { parkingId, date } = req.query;

    if (!parkingId || !date) {
      return res.status(400).json({ message: 'parkingId and date are required' });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      parkingId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['pending', 'approved', 'Pending', 'Approved'] }
    });

    const bookedSlots = bookings.map((b) => b.slotNumber);
    res.json({ bookedSlots });
  } catch (error) {
    console.log('BOOKED SLOTS ERROR:', error.message);
    res.status(500).json({ message: error.message });
  }
};