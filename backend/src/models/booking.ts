import mongoose from 'mongoose';
import { BookingStatus } from '../services/BookingService';

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  // Reference to either a hotel or a package
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  // Common fields
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  numberOfGuests: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  status: { 
    type: String, 
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING 
  },
  paymentIntentId: { type: String },
  // Metadata
  bookingType: {
    type: String,
    enum: ['HOTEL', 'PACKAGE'],
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Ensure either hotelId or packageId is provided
bookingSchema.pre('save', function(next) {
  if (!this.hotelId && !this.packageId) {
    next(new Error('A booking must have either a hotelId or packageId'));
  } else if (this.hotelId && this.packageId) {
    next(new Error('A booking cannot have both hotelId and packageId'));
  } else {
    next();
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking; 