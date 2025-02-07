import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import Footer from '../components/Footer';

type PaymentStatus = 'succeeded' | 'failed' | 'processing' | 'requires_payment_method';

interface PackageData {
  id: string;
  title: string;
  type: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  cleaning_fee: number;
  service_fee: number;
}

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  useEffect(() => {
    const createBooking = async (paymentIntentId: string) => {
      try {
        setIsCreatingBooking(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/packages/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            paymentIntentId,
            packageId: searchParams.get('package_id'),
            startDate: searchParams.get('start_date'),
            endDate: searchParams.get('end_date'),
            guests: parseInt(searchParams.get('guests') || '1'),
            totalAmount: parseFloat(searchParams.get('total_amount') || '0')
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create booking');
        }

        const bookingData = await response.json();
        console.log('Booking created:', bookingData);
      } catch (error) {
        console.error('Error creating booking:', error);
        setErrorMessage('Failed to save booking details. Please contact support.');
      } finally {
        setIsCreatingBooking(false);
      }
    };

    const fetchPackageData = async () => {
      const package_id = searchParams.get('package_id');
      if (!package_id) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/packages/${package_id}`);
        if (!response.ok) throw new Error('Failed to fetch package data');
        const data = await response.json();
        setPackageData(data);

        // Construct booking details from URL parameters
        const start_date = searchParams.get('start_date');
        const end_date = searchParams.get('end_date');
        const guests = searchParams.get('guests');
        const total_amount = searchParams.get('total_amount');

        if (start_date && end_date && guests && total_amount) {
          const nights = Math.ceil((new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24));
          const subtotal = data.price * nights;
          const total = {
            subtotal,
            cleaning_fee: data.cleaning_fee,
            service_fee: data.service_fee,
            taxes: Math.round(subtotal * 0.05),
            total: parseFloat(total_amount)
          };

          setBookingDetails({
            startDate: start_date,
            endDate: end_date,
            guests: parseInt(guests),
            total
          });
        }
      } catch (error) {
        console.error('Error fetching package data:', error);
        setErrorMessage('Failed to load booking details');
        setPaymentStatus('failed');
      }
    };

    // If we have state data, use it directly
    if (location.state?.package_data && location.state?.booking_details) {
      setPackageData(location.state.package_data);
      setBookingDetails(location.state.booking_details);
      setPaymentStatus('succeeded');
    } else {
      // Otherwise fetch data based on URL parameters
      fetchPackageData();
    }

    // Check payment status from URL parameters
    const payment_intent = searchParams.get('payment_intent');
    const redirect_status = searchParams.get('redirect_status');
    const success = searchParams.get('success');

    if (redirect_status === 'succeeded' || success === 'true') {
      setPaymentStatus('succeeded');
      // Create booking record if payment was successful
      if (payment_intent) {
        createBooking(payment_intent);
      }
    } else if (redirect_status === 'failed') {
      setPaymentStatus('failed');
      setErrorMessage('Your payment was declined. Please try again with a different payment method.');
    } else if (redirect_status === 'requires_payment_method') {
      setPaymentStatus('requires_payment_method');
      setErrorMessage('The payment requires additional verification or a different payment method.');
    }
  }, [location.state, searchParams]);

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case 'succeeded':
        return (
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-emerald-500 text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your booking. A confirmation email has been sent to your email address.
            </p>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-times text-red-500 text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-spinner fa-spin text-blue-500 text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Processing Payment</h1>
            <p className="text-gray-600">
              Please wait while we confirm your payment. This may take a few moments.
            </p>
          </div>
        );

      case 'requires_payment_method':
        return (
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-yellow-500 text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Needs Attention</h1>
            <p className="text-yellow-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Update Payment Method
            </button>
          </div>
        );
    }
  };

  if (!packageData || !bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <i className="fas fa-spinner fa-spin text-emerald-500 text-3xl"></i>
          </div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleBrowsePackagesClick = () => {
    navigate('/packages');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {renderPaymentStatus()}

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>
          
          {/* Package Info */}
          <div className="flex items-start gap-6 mb-8 pb-8 border-b">
            <img
              src={packageData.image}
              alt={packageData.title}
              className="w-32 h-24 object-cover rounded-lg"
            />
            <div>
              <span className="text-emerald-600 font-medium">{packageData.type}</span>
              <h3 className="text-xl font-semibold">{packageData.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <i className="fas fa-star text-emerald-500"></i>
                <span className="ml-1">{packageData.rating}</span>
                <span className="mx-1">·</span>
                <span>({packageData.reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Trip Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-gray-600">Dates</span>
                  <div className="font-medium">
                    {formatDate(bookingDetails.startDate)} - {formatDate(bookingDetails.endDate)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Guests</span>
                  <div className="font-medium">
                    {bookingDetails.guests} {bookingDetails.guests === 1 ? 'guest' : 'guests'}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h3 className="font-semibold mb-4">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${bookingDetails.total.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cleaning fee</span>
                  <span>${bookingDetails.total.cleaning_fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span>${bookingDetails.total.service_fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span>${bookingDetails.total.taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Total paid</span>
                  <span>${bookingDetails.total.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-envelope text-emerald-500"></i>
              </div>
              <h3 className="font-medium mb-2">Check Your Email</h3>
              <p className="text-gray-600 text-sm">
                We've sent you a detailed confirmation email with your booking information
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-calendar-alt text-emerald-500"></i>
              </div>
              <h3 className="font-medium mb-2">Mark Your Calendar</h3>
              <p className="text-gray-600 text-sm">
                Add your trip dates to your calendar to stay organized
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user text-emerald-500"></i>
              </div>
              <h3 className="font-medium mb-2">Complete Your Profile</h3>
              <p className="text-gray-600 text-sm">
                Update your preferences to help us personalize your experience
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleDashboardClick}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            disabled={isCreatingBooking}
          >
            {isCreatingBooking ? 'Saving...' : 'Go to Dashboard'}
          </button>
          <button
            onClick={handleBrowsePackagesClick}
            className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
            disabled={isCreatingBooking}
          >
            Browse More Packages
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingConfirmation; 