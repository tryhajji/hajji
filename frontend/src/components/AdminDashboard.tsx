import { useBookingSocket } from '../hooks/useBookingSocket';
import { useEffect, useState } from 'react';

export const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const socket = useBookingSocket();

  useEffect(() => {
    // Join admin room
    socket.emit('join-admin-room');

    const unsubscribe = socket.on('admin-booking-update', (data) => {
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === data.booking.id 
            ? { ...booking, ...data.booking }
            : booking
        )
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // ... rest of your dashboard component
}; 