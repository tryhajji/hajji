import Booking from '../models/booking';

export enum BookingStatus {
  PENDING = 'PENDING',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

class BookingService {
  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
    userId: string
  ) {
    try {
      const booking = await Booking.findOne({ _id: bookingId, userId });
      
      if (!booking) {
        throw new Error('Booking not found');
      }

      booking.status = status;
      await booking.save();

      return booking;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }
}

export const bookingService = new BookingService(); 