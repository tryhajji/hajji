import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { loadStripe, Appearance } from '@stripe/stripe-js';
import { 
  Elements, 
  useStripe, 
  useElements, 
  PaymentElement
} from '@stripe/react-stripe-js';

import "react-datepicker/dist/react-datepicker.css";
import { useAppContext } from '../contexts/AppContext';
import { loginWithGoogle } from '../appwrite';
import Footer from '../components/Footer';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const BookingFunnel = () => {
  const { id } = useParams(); // Get package ID from URL parameters
  const navigate = useNavigate(); // Hook to programmatically navigate
  const location = useLocation(); // Hook to access location object
  const { isLoggedIn } = useAppContext(); // Get authentication status from context
  const [startDate, setStartDate] = useState<Date | null>(null); // State for start date
  const [endDate, setEndDate] = useState<Date | null>(null); // State for end date
  const [guests, setGuests] = useState(1); // State for number of guests
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'monthly'>('full'); // State for payment method
  const [package_data, setPackageData] = useState<any>(null); // State for package data
  const [clientSecret, setClientSecret] = useState(''); // State for Stripe client secret
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); // State for payment processing status

  // Effect to load package data from location state
  useEffect(() => {
    if (location.state) {
      const { startDate, endDate, guests, package_data } = location.state;
      setStartDate(new Date(startDate)); // Set start date
      setEndDate(new Date(endDate)); // Set end date
      setGuests(guests); // Set number of guests
      setPackageData(package_data); // Set package data
    } else {
      // If no state is passed, redirect back to package details
      navigate(`/packages/${id}`);
    }
  }, [location.state, id, navigate]);

  // Effect to handle authenticated state
  useEffect(() => {
    if (isLoggedIn) {
      console.log('User authenticated, ready for payment processing');
      // TODO: Implement payment processing flow
    }
  }, [isLoggedIn]);

  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle(); // Call login function
    } catch (error) {
      console.error('Google sign-in error:', error); // Log any errors
    }
  };

  // Function to calculate total cost
  const calculateTotal = () => {
    if (!startDate || !endDate || !package_data) return null; // Return null if data is missing
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)); // Calculate number of nights
    const subtotal = package_data.price * nights; // Calculate subtotal
    const taxes = Math.round(subtotal * 0.05); // Calculate taxes (5% tax rate)
    return {
      subtotal,
      cleaning_fee: package_data.cleaning_fee,
      service_fee: package_data.service_fee,
      taxes,
      total: subtotal + package_data.cleaning_fee + package_data.service_fee + taxes // Calculate total
    };
  };

  // Function to format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // Format date
  };

  // Return loading state if package data is not available
  if (!package_data) {
    return <div>Loading...</div>;
  }

  const total = calculateTotal(); // Calculate total cost

  // Function to create payment intent
  const createPaymentIntent = async () => {
    if (!total) return; // Exit if total is not available
    
    try {
      setIsProcessingPayment(true); // Set processing state to true
      console.log('Creating payment intent with data:', {
        amount: total.total,
        currency: 'usd',
        package_id: id,
        metadata: {
          package_type: package_data.type,
          start_date: startDate?.toISOString(),
          end_date: endDate?.toISOString(),
          guests: guests,
          payment_method: paymentMethod
        }
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total.total,
          currency: 'usd',
          package_id: id,
          metadata: {
            package_type: package_data.type,
            start_date: startDate?.toISOString(),
            end_date: endDate?.toISOString(),
            guests: guests,
            payment_method: paymentMethod
          }
        }),
      });

      const data = await response.json(); // Parse response data
      console.log('Payment intent response:', data);
      setClientSecret(data.clientSecret); // Set client secret for Stripe
    } catch (error) {
      console.error('Error creating payment intent:', error); // Log any errors
    } finally {
      setIsProcessingPayment(false); // Reset processing state
    }
  };

  // Function to handle continue button click
  const handleContinue = async () => {
    console.log('Handle continue clicked. isLoggedIn:', isLoggedIn);
    if (!isLoggedIn) {
      const authSection = document.getElementById('auth-section');
      if (authSection) {
        authSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      console.log('Creating payment intent...');
      await createPaymentIntent();
    }
  };

  // Function to handle successful payment
  const handlePaymentSuccess = () => {
    navigate('/booking-confirmation', {
      state: {
        package_data,
        booking_details: {
          startDate,
          endDate,
          guests,
          total
        }
      }
    });
  };

  // Define Stripe appearance
  const appearance: Appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#10B981',
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <button 
            onClick={() => navigate(-1)} // Navigate back
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <i className="fas fa-chevron-left"></i>
            Back
          </button>

          <h1 className="text-3xl font-semibold mb-8">Request to book</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Booking Form */}
            <div>
              {/* Price Alert */}
              <div className="border rounded-lg p-4 mb-8">
                <div className="flex items-start gap-4">
                  <i className="fas fa-tag text-primary"></i>
                  <div>
                    <h3 className="font-semibold mb-1">Good price</h3>
                    <p className="text-gray-600 text-sm">
                      Your dates are $53 less than the avg. nightly rate over the last 3 months.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your trip</h2>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold">Dates</h3>
                    <p className="text-gray-600">
                      {startDate && endDate ? `${formatDate(startDate)} – ${formatDate(endDate)}` : 'No dates selected'}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(-1)} // Edit button to go back
                    className="text-primary underline font-medium"
                  >
                    Edit
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Guests</h3>
                    <p className="text-gray-600">{guests} {guests === 1 ? 'guest' : 'guests'}</p>
                  </div>
                  <button 
                    onClick={() => navigate(-1)} // Edit button to go back
                    className="text-primary underline font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Payment Options */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Choose how to pay</h2>
                
                <div className="space-y-4">
                  <label className="block border rounded-lg p-4 cursor-pointer hover:border-primary">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">Pay in full</div>
                        <div className="text-gray-600">Pay the total (${total?.total.toLocaleString()})</div>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'full'}
                        onChange={() => setPaymentMethod('full')} // Set payment method to full
                        className="text-primary"
                      />
                    </div>
                  </label>

                  <label className="block border rounded-lg p-4 cursor-pointer hover:border-primary">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">Pay monthly</div>
                        <div className="text-gray-600">
                          From ${Math.round(total ? total.total / 12 : 0)}/mo with Klarna
                        </div>
                        <div className="text-sm text-gray-500">Interest may apply</div>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'monthly'}
                        onChange={() => setPaymentMethod('monthly')} // Set payment method to monthly
                        className="text-primary"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Login Section */}
              <div id="auth-section">
                <h2 className="text-2xl font-semibold mb-4">
                  {isLoggedIn ? 'Proceed with payment' : 'Log in or sign up to book'}
                </h2>
                
                {!isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <select className="w-full h-14 px-4 border border-gray-300 rounded-t-lg focus:outline-none focus:ring-1 focus:ring-primary appearance-none">
                        <option value="US">United States (+1)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <i className="fas fa-chevron-down text-gray-400"></i>
                      </div>
                    </div>

                    <input
                      type="tel"
                      placeholder="Phone number"
                      className="w-full h-14 px-4 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />

                    <p className="text-sm text-gray-600">
                      We'll call or text you to confirm your number. Standard message and data rates apply. 
                      <button className="text-primary underline ml-1">Privacy Policy</button>
                    </p>

                    <button
                      onClick={handleContinue} // Continue button to handle payment
                      className="w-full h-12 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                      disabled={isProcessingPayment} // Disable button if processing payment
                    >
                      {isProcessingPayment ? 'Processing...' : 'Continue'} // Change button text based on processing state
                    </button>

                    <div className="relative text-center my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative">
                        <span className="px-4 bg-white text-gray-500 text-sm">or</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button className="w-full h-12 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                        <i className="fab fa-facebook text-[#1877F2]"></i>
                        <span>Continue with Facebook</span>
                      </button>
                      <button 
                        onClick={handleGoogleSignIn} // Google sign-in button
                        className="w-full h-12 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
                      >
                        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                        </svg>
                        <span>Continue with Google</span>
                      </button>
                      <button className="w-full h-12 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                        <i className="fab fa-apple"></i>
                        <span>Continue with Apple</span>
                      </button>
                      <button className="w-full h-12 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                        <i className="far fa-envelope"></i>
                        <span>Continue with email</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      You're logged in and ready to proceed with payment.
                    </p>
                    <button
                      onClick={handleContinue} // Continue button to handle payment
                      className="w-full h-12 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Price Details */}
            <div className="lg:pl-12">
              <div className="sticky top-8 border rounded-lg p-6 divide-y">
                {/* Package Preview */}
                <div className="flex gap-4 pb-6">
                  <img
                    src={package_data.image}
                    alt={package_data.title}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <div className="text-sm text-gray-600">{package_data.type}</div>
                    <h3 className="font-semibold">{package_data.title}</h3>
                    <div className="flex items-center text-sm">
                      <i className="fas fa-star text-primary"></i>
                      <span className="ml-1">{package_data.rating}</span>
                      <span className="mx-1">·</span>
                      <span className="text-gray-600">({package_data.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                {total && (
                  <>
                    <div className="py-6">
                      <h3 className="text-lg font-semibold mb-4">Price details</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="underline">
                            ${package_data.price.toLocaleString()} x {Math.ceil((endDate!.getTime() - startDate!.getTime()) / (1000 * 60 * 60 * 24))} nights
                          </span>
                          <span>${total.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="underline">Cleaning fee</span>
                          <span>${total.cleaning_fee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="underline">Service fee</span>
                          <span>${total.service_fee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="underline">Taxes</span>
                          <span>${total.taxes.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <div className="flex justify-between font-semibold">
                        <span>Total (USD)</span>
                        <span>${total.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {clientSecret && id && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Complete Payment</h2>
            <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
              <PaymentForm
                amount={total?.total || 0}
                packageId={id}
                startDate={startDate}
                endDate={endDate}
                guests={guests}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setClientSecret('')}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  packageId: string;
  startDate: Date | null;
  endDate: Date | null;
  guests: number;
}

// Payment Form Component
const PaymentForm: React.FC<PaymentFormProps> = ({ 
  amount,  
  onCancel,
  packageId,
  startDate,
  endDate,
  guests
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Payment failed');
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-confirmation?${new URLSearchParams({
            success: 'true',
            package_id: packageId,
            start_date: startDate?.toISOString() || '',
            end_date: endDate?.toISOString() || '',
            guests: String(guests),
            total_amount: String(amount)
          })}`,
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
      <div className="flex justify-end space-x-4 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-400"
        >
          {processing ? 'Processing...' : `Pay ${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}
        </button>
      </div>
    </form>
  );
};

export default BookingFunnel; 