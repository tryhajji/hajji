import { useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './useAuth'; // Your auth hook

let socket: Socket | null = null;

export const useBookingSocket = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize socket connection
    socket = io(import.meta.env.VITE_API_BASE_URL, {
      withCredentials: true
    });

    if (user?.id) {
      // Join user-specific room
      socket.emit('join-user-room', user.id);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  const subscribeToBookingUpdates = useCallback((callback: (data: any) => void) => {
    if (!socket) return;

    socket.on('booking-update', callback);
    return () => {
      socket.off('booking-update', callback);
    };
  }, []);

  return { subscribeToBookingUpdates };
}; 