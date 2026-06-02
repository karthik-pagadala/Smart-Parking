import Booking from '../models/Booking.js';

// @desc    Admin scans QR code to verify entry/exit
// @route   POST /api/qr/scan
export const scanQRCode = async (req, res) => {
  try {
    const { bookingId, action } = req.body; // action can be 'entry' or 'exit'

    const booking = await Booking.findById(bookingId).populate('userId', 'name email').populate('parkingId', 'name');
    
    if (!booking) {
      return res.status(404).json({ message: 'Invalid QR Code: Booking not found' });
    }

    if (booking.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: This booking is for a different parking location' });
    }

    if (booking.paymentStatus !== 'Paid') {
      return res.status(400).json({ message: 'Payment pending for this booking' });
    }

    if (action === 'entry') {
      if (booking.status === 'completed') return res.status(400).json({ message: 'Booking already completed' });
      
      // Update status or log entry time if we had an entryTime field
      // For now we just return success
      return res.json({ message: 'Entry Verified', booking });
    } 
    
    if (action === 'exit') {
      booking.status = 'completed';
      await booking.save();
      return res.json({ message: 'Exit Verified & Booking Completed', booking });
    }

    res.status(400).json({ message: 'Invalid action' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
