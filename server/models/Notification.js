import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can be User or Admin
  recipientModel: { type: String, enum: ['User', 'Admin'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  type: { type: String } // e.g., 'booking_approved', 'system_alert'
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
