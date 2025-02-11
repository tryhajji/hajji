import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { account } from '../appwrite';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const createBooking = async () => {
      if (!location.state?.success || !location.state?.paymentIntentId) {
        setError('Invalid booking state');
        return;
      }

      try {
        setIsCreatingBooking(true);
        const session = await account.getSession('current');
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/my-bookings/create-booking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-appwrite-session': `${session.userId}.${session.$id}`
          },
          credentials: 'include',
          body: JSON.stringify({
            packageId: location.state.packageId,
            startDate: location.state.startDate,
            endDate: location.state.endDate,
            guests: location.state.guests,
            totalAmount: location.state.totalAmount,
            paymentIntentId: location.state.paymentIntentId
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to create booking');
        }

        console.log('Booking created:', data);
        setBooking(data.booking);
      } catch (error) {
        console.error('Error creating booking:', error);
        setError('Failed to save booking details. Please contact support.');
      } finally {
        setIsCreatingBooking(false);
      }
    };

    createBooking();
  }, [location.state]);

  if (!location.state?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-times text-red-500 text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-4">Something went wrong with your payment.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isCreatingBooking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Creating Your Booking</h1>
          <p className="text-gray-600">Please wait while we confirm your reservation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Your payment was successful, but we couldn't create your booking.</p>
          <p className="text-gray-600 mb-4">Please contact support with your payment ID: {location.state.paymentIntentId}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-green-500 text-2xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-4">Thank you for your booking. A confirmation email has been sent to your email address.</p>
        {booking && (
          <div className="mb-6 text-left bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Check-in:</span> {new Date(booking.checkIn).toLocaleDateString()}</p>
              <p><span className="font-medium">Check-out:</span> {new Date(booking.checkOut).toLocaleDateString()}</p>
              <p><span className="font-medium">Guests:</span> {booking.numberOfGuests}</p>
              <p><span className="font-medium">Total Amount:</span> ${booking.totalCost.toLocaleString()}</p>
              <p><span className="font-medium">Booking ID:</span> {booking._id}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation; 