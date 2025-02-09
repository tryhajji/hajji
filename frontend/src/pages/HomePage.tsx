import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Footer from '../components/Footer';

const SearchBox = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="relative flex-1 min-w-[180px]">
    <div className="relative">
      <label className="absolute -top-[11px] left-4 bg-white px-2 text-xs font-medium text-gray-600 z-20">
        {label}
      </label>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [travelers, setTravelers] = useState<number>(1);
  const [tripType, setTripType] = useState<'umrah' | 'hajj'>('umrah');
  const [priceRange, setPriceRange] = useState<string>('any');

  const handleSearch = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        travelers: travelers.toString(),
        type: tripType,
        priceRange: priceRange,
      });

      // Log the search parameters for debugging
      console.log('Search parameters:', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        travelers,
        tripType,
        priceRange
      });

      // Navigate to the search results page
      navigate({
        pathname: '/packages',
        search: params.toString()
      });
    } catch (error) {
      console.error('Error during search:', error);
      alert('An error occurred while searching. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="images/kaaba.jpg"
            alt="Kaaba" 
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-16">
          <h1 className="text-5xl font-bold text-white mb-4 max-w-2xl">
            Find your perfect pilgrimage package
          </h1>
          <p className="text-xl text-white mb-8 opacity-90 max-w-2xl">
            Whether it's a spiritual journey to Mecca or a blessed visit to Medina, we've got you covered.
          </p>
        </div>

        {/* Search Form */}
        <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 z-20">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-wrap gap-2">
                <SearchBox label="Journey Type">
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value as 'umrah' | 'hajj')}
                    className="w-full h-[48px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-gray-800 bg-white"
                  >
                    <option value="umrah">Umrah</option>
                    <option value="hajj">Hajj</option>
                  </select>
                </SearchBox>

                <SearchBox label="Price Range">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full h-[48px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-gray-800 bg-white"
                  >
                    <option value="any">Any Price</option>
                    <option value="0-5000">$0 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="10000-15000">$10,000 - $15,000</option>
                    <option value="15000+">$15,000+</option>
                  </select>
                </SearchBox>

                <SearchBox label="Check-in">
                  <div className="relative">
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className="w-full h-[48px] px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-gray-600 bg-white cursor-pointer"
                      placeholderText="Add dates"
                      minDate={new Date()}
                      dateFormat="MMM d, yyyy"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <i className="fas fa-calendar text-gray-400 text-sm"></i>
                    </div>
                  </div>
                </SearchBox>

                <SearchBox label="Check-out">
                  <div className="relative">
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate || new Date()}
                      className="w-full h-[48px] px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-gray-600 bg-white cursor-pointer"
                      placeholderText="Add dates"
                      dateFormat="MMM d, yyyy"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <i className="fas fa-calendar text-gray-400 text-sm"></i>
                    </div>
                  </div>
                </SearchBox>

                <SearchBox label="Travelers">
                  <div className="flex items-center h-[48px] border border-gray-300 rounded-lg bg-white text-gray-800">
                    <button
                      type="button"
                      onClick={() => setTravelers(prev => Math.max(1, prev - 1))}
                      className="w-12 h-full flex items-center justify-center hover:bg-gray-100 text-gray-600"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center">
                      {travelers} {travelers === 1 ? 'person' : 'people'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTravelers(prev => prev + 1)}
                      className="w-12 h-full flex items-center justify-center hover:bg-gray-100 text-gray-600"
                    >
                      +
                    </button>
                  </div>
                </SearchBox>

                <div className="flex-1 min-w-[100px]">
                  <button
                    type="submit"
                    className="w-full h-[48px] bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Packages */}
      <div className="container mx-auto px-4 pt-40 pb-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Premium Hajj Package */}
          <Link to="/packages/premium-hajj" className="group">
            <div className="relative aspect-square mb-2 overflow-hidden rounded-lg">
              <img
                src="/images/mecca.jpg"
                alt="Premium Hajj Package"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-gold text-white text-xs px-2 py-1 rounded">
                Premium
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">Premium Hajj Package</h3>
                <div className="flex items-center">
                  <i className="fas fa-star text-primary text-sm mr-1"></i>
                  <span className="text-sm">4.9</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Mecca, Saudi Arabia</p>
              <p className="text-gray-500 text-sm">15 days (June 1-15, 2025)</p>
              <p className="mt-1">
                <span className="font-semibold">$8,999</span>
                <span className="text-gray-500"> fixed package</span>
              </p>
            </div>
          </Link>

          {/* Standard Umrah Package */}
          <Link to="/packages/standard-umrah" className="group">
            <div className="relative aspect-square mb-2 overflow-hidden rounded-lg">
              <img
                src="/images/medina.jpg"
                alt="Standard Umrah Package"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                Popular
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">Standard Umrah Package</h3>
                <div className="flex items-center">
                  <i className="fas fa-star text-primary text-sm mr-1"></i>
                  <span className="text-sm">4.7</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Medina, Saudi Arabia</p>
              <p className="text-gray-500 text-sm">Flexible Duration</p>
              <p className="mt-1">
                <span className="font-semibold">$200</span>
                <span className="text-gray-500"> per day</span>
              </p>
            </div>
          </Link>

          {/* Group Hajj Package */}
          <Link to="/packages/group-hajj" className="group">
            <div className="relative aspect-square mb-2 overflow-hidden rounded-lg">
              <img
                src="/images/group.jpg"
                alt="Group Hajj Package"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Group
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">Group Hajj Package</h3>
                <div className="flex items-center">
                  <i className="fas fa-star text-primary text-sm mr-1"></i>
                  <span className="text-sm">4.8</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Mecca & Medina</p>
              <p className="text-gray-500 text-sm">21 days (June 1-21, 2025)</p>
              <p className="mt-1">
                <span className="font-semibold">$7,499</span>
                <span className="text-gray-500"> fixed package</span>
              </p>
            </div>
          </Link>

          {/* Deluxe Umrah Package */}
          <Link to="/packages/deluxe-umrah" className="group">
            <div className="relative aspect-square mb-2 overflow-hidden rounded-lg">
              <img
                src="/images/deluxe.jpg"
                alt="Deluxe Umrah Package"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                Luxury
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">Deluxe Umrah Package</h3>
                <div className="flex items-center">
                  <i className="fas fa-star text-primary text-sm mr-1"></i>
                  <span className="text-sm">5.0</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Mecca & Medina</p>
              <p className="text-gray-500 text-sm">Flexible Duration</p>
              <p className="mt-1">
                <span className="font-semibold">$300</span>
                <span className="text-gray-500"> per day</span>
              </p>
            </div>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;