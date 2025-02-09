import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  packageId: {
    type: String,
    required: true
  },
  paymentIntentId: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking; 