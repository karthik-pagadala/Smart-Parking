import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import sendEmail from '../utils/emailService.js';

// @desc    Get all pending admin registrations
// @route   GET /api/superadmin/pending-admins
export const getPendingAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ status: 'pending', role: 'admin' }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify (Approve/Reject) Admin
// @route   PUT /api/superadmin/verify-admin/:id
export const verifyAdmin = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.status = status;
    if (status === 'rejected') {
      admin.rejectionReason = rejectionReason;
    }
    await admin.save();

    // Send email notification to admin
    const subject = `Your Admin Account is ${status === 'approved' ? 'Approved' : 'Rejected'}`;
    const html = `
      <h1>Account Verification Update</h1>
      <p>Your business account has been <strong>${status}</strong>.</p>
      ${status === 'rejected' ? `<p>Reason: ${rejectionReason}</p>` : '<p>You can now log in and add your parking spaces.</p>'}
    `;
    await sendEmail({ to: admin.email, subject, html });

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform analytics
// @route   GET /api/superadmin/analytics
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await Admin.countDocuments({ role: 'admin' });
    const totalBookings = await Booking.countDocuments();
    
    // Calculate total revenue from completed/paid bookings
    const completedBookings = await Booking.find({ paymentStatus: 'Paid' });
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    res.json({
      totalUsers,
      totalAdmins,
      totalBookings,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (for manage users table)
// @route   GET /api/superadmin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suspend or Delete a user/admin
// @route   PUT /api/superadmin/manage-account/:type/:id
export const manageAccount = async (req, res) => {
  try {
    const { action } = req.body; // 'suspend' or 'delete'
    const { type, id } = req.params; // 'user' or 'admin'

    const Model = type === 'admin' ? Admin : User;
    
    if (action === 'delete') {
      await Model.findByIdAndDelete(id);
      return res.json({ message: 'Account deleted' });
    } else if (action === 'suspend') {
      const account = await Model.findById(id);
      if (!account) return res.status(404).json({ message: 'Account not found' });
      account.status = 'suspended'; // Note: User model might need a status field, currently defaults to active logic
      await account.save();
      return res.json({ message: 'Account suspended' });
    }

    res.status(400).json({ message: 'Invalid action' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
