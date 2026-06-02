import mongoose from 'mongoose';

const slotLockSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parkingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parking', required: true },
  slotNumber: { type: String, required: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

// Auto-delete documents when expiresAt is reached
slotLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('SlotLock', slotLockSchema);
