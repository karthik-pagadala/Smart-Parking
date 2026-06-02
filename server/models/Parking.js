import mongoose from 'mongoose';

const parkingSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  images: [{ type: String }],
  totalSlots: { type: Number, required: true },
  activeSlots: { type: Number, required: true },
  pricing: {
    car: { type: Number, required: true },
    bike: { type: Number, required: true },
    heavy: { type: Number, required: true }
  },
  timings: {
    open: { type: String, required: true },
    close: { type: String, required: true }
  },
  schedule: {
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: true },
    sunday: { type: Boolean, default: true }
  },
  hasEVCharging: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Parking', parkingSchema);
