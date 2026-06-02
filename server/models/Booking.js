import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parkingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parking', required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  slotNumber: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  vehicleType: { type: String, enum: ['car', 'bike', 'heavy'], required: true },
  vehicleNumber: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'], default: 'pending' },
  rejectionReason: { type: String },
  paymentStatus: { type: String, enum: ['Unpaid', 'Paid', 'Refunded', 'Failed'], default: 'Unpaid' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
