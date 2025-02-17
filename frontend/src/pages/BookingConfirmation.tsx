import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/sign-in');
        return;
      }

      // Process booking confirmation
      if (location.state?.bookingDetails) {
        // Handle booking confirmation logic here
        setIsLoading(false);
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [location, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Booking Confirmation
          </h1>
          {/* Display booking details here */}
          {location.state?.bookingDetails && (
            <div className="space-y-4">
              {/* Add your booking confirmation details here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 