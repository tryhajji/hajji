import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Footer from '../components/Footer';
import CustomDatePicker from '../components/CustomDatePicker';

// Package data mapping
const packageData = {
  'premium-hajj': {
    title: "Premium Hajj Package",
    type: 'hajj',
    location: "Mecca & Medina, Saudi Arabia",
    rating: 4.9,
    reviews: 128,
    host: {
      name: "Al-Safar Travel",
      type: "Superhost",
      hosting_time: "9 months"
    },
    price: 8999,
    priceType: 'fixed',
    cleaning_fee: 150,
    service_fee: 286,
    images: [
      "/images/mecca.jpg",
      "/images/room1.jpg",
      "/images/room2.jpg",
      "/images/room3.jpg",
      "/images/room4.jpg"
    ],
    description: "Experience a luxurious and spiritually fulfilling Hajj journey with our premium package. This carefully curated package ensures your comfort and peace of mind throughout this sacred pilgrimage...",
    highlights: [
      {
        icon: "fas fa-medal",
        title: "Premium Package",
        description: "Top-rated Hajj package with exceptional service"
      },
      {
        icon: "fas fa-calendar-check",
        title: "Free cancellation",
        description: "Cancel up to 30 days before your trip for a full refund"
      },
      {
        icon: "fas fa-headset",
        title: "24/7 support",
        description: "Dedicated support throughout your journey"
      }
    ],
    amenities: [
      {
        icon: "fas fa-hotel",
        title: "5-Star Hotel Accommodations",
        description: "Luxury rooms in Mecca & Medina"
      },
      {
        icon: "fas fa-utensils",
        title: "Full-Board Meals",
        description: "3 halal meals per day"
      },
      {
        icon: "fas fa-bus",
        title: "Transportation",
        description: "All ground transport included"
      },
      {
        icon: "fas fa-user-tie",
        title: "Religious Guide",
        description: "24/7 scholarly guidance"
      },
      {
        icon: "fas fa-plane",
        title: "Air Travel",
        description: "Return flights included"
      },
      {
        icon: "fas fa-map-marked-alt",
        title: "Ziyarat Tours",
        description: "Historical sites visits"
      },
      {
        icon: "fas fa-first-aid",
        title: "Medical Support",
        description: "On-site medical assistance"
      },
      {
        icon: "fas fa-phone",
        title: "24/7 Support",
        description: "Dedicated customer service"
      }
    ]
  },
  'standard-umrah': {
    title: "Standard Umrah Package",
    type: 'umrah',
    location: "Medina, Saudi Arabia",
    rating: 4.7,
    reviews: 95,
    host: {
      name: "Baraka Tours",
      type: "Verified Agency",
      hosting_time: "5 years"
    },
    price: 200,
    priceType: 'per_day',
    cleaning_fee: 50,
    service_fee: 100,
    images: [
      "/images/medina.jpg",
      "/images/standard-room1.jpg",
      "/images/standard-room2.jpg",
      "/images/standard-room3.jpg",
      "/images/standard-room4.jpg"
    ],
    description: "Our Standard Umrah Package offers a comfortable and spiritually enriching experience. Perfect for those seeking a balanced combination of comfort and value...",
    highlights: [
      {
        icon: "fas fa-star",
        title: "Popular Choice",
        description: "Well-rated Umrah package with great value"
      },
      {
        icon: "fas fa-calendar-check",
        title: "Flexible Dates",
        description: "Choose your preferred dates"
      },
      {
        icon: "fas fa-headset",
        title: "Local Support",
        description: "Available support during your stay"
      }
    ],
    amenities: [
      {
        icon: "fas fa-hotel",
        title: "4-Star Hotel Accommodations",
        description: "Comfortable rooms near Haram"
      },
      {
        icon: "fas fa-utensils",
        title: "Half-Board Meals",
        description: "Breakfast and dinner included"
      },
      {
        icon: "fas fa-bus",
        title: "Transportation",
        description: "Airport transfers included"
      },
      {
        icon: "fas fa-user",
        title: "Local Guide",
        description: "Experienced guide available"
      },
      {
        icon: "fas fa-map-marked-alt",
        title: "Local Tours",
        description: "Optional ziyarat tours"
      },
      {
        icon: "fas fa-phone",
        title: "Support Line",
        description: "Help when you need it"
      }
    ]
  },
  'group-hajj': {
    title: "Group Hajj Package",
    type: 'hajj',
    location: "Mecca & Medina",
    rating: 4.8,
    reviews: 112,
    host: {
      name: "Al-Iman Travels",
      type: "Verified Agency",
      hosting_time: "7 years"
    },
    price: 7499,
    priceType: 'fixed',
    cleaning_fee: 100,
    service_fee: 200,
    images: [
      "/images/group.jpg",
      "/images/group-room1.jpg",
      "/images/group-room2.jpg",
      "/images/group-room3.jpg",
      "/images/group-room4.jpg"
    ],
    description: "Join our group Hajj package for a well-organized and spiritually fulfilling pilgrimage. Perfect for those who prefer traveling with a larger group...",
    highlights: [
      {
        icon: "fas fa-users",
        title: "Group Experience",
        description: "Travel with like-minded pilgrims"
      },
      {
        icon: "fas fa-calendar-check",
        title: "Fixed Dates",
        description: "Well-planned schedule"
      },
      {
        icon: "fas fa-headset",
        title: "Group Support",
        description: "Dedicated group leaders"
      }
    ],
    amenities: [
      {
        icon: "fas fa-hotel",
        title: "4-Star Hotel Accommodations",
        description: "Comfortable group accommodations"
      },
      {
        icon: "fas fa-utensils",
        title: "Full-Board Meals",
        description: "All meals included"
      },
      {
        icon: "fas fa-bus",
        title: "Group Transportation",
        description: "All transfers included"
      },
      {
        icon: "fas fa-user-tie",
        title: "Religious Guide",
        description: "Scholarly guidance"
      },
      {
        icon: "fas fa-plane",
        title: "Air Travel",
        description: "Group flights included"
      },
      {
        icon: "fas fa-map-marked-alt",
        title: "Group Tours",
        description: "Organized ziyarat tours"
      }
    ]
  },
  'deluxe-umrah': {
    title: "Deluxe Umrah Package",
    type: 'umrah',
    location: "Mecca & Medina",
    rating: 5.0,
    reviews: 78,
    host: {
      name: "Royal Hajj Services",
      type: "Premium Host",
      hosting_time: "8 years"
    },
    price: 300,
    priceType: 'per_day',
    cleaning_fee: 75,
    service_fee: 150,
    images: [
      "/images/deluxe.jpg",
      "/images/deluxe-room1.jpg",
      "/images/deluxe-room2.jpg",
      "/images/deluxe-room3.jpg",
      "/images/deluxe-room4.jpg"
    ],
    description: "Experience ultimate luxury with our Deluxe Umrah Package. Enjoy 5-star accommodations, private transportation, and personalized service throughout your stay...",
    highlights: [
      {
        icon: "fas fa-crown",
        title: "Luxury Experience",
        description: "Premium services and accommodations"
      },
      {
        icon: "fas fa-calendar-check",
        title: "Flexible Booking",
        description: "Choose your preferred dates"
      },
      {
        icon: "fas fa-concierge-bell",
        title: "VIP Service",
        description: "24/7 concierge support"
      }
    ],
    amenities: [
      {
        icon: "fas fa-hotel",
        title: "5-Star Hotel Accommodations",
        description: "Luxury rooms with Haram view"
      },
      {
        icon: "fas fa-utensils",
        title: "Full-Board Meals",
        description: "Gourmet halal dining"
      },
      {
        icon: "fas fa-car",
        title: "Private Transportation",
        description: "Luxury vehicle service"
      },
      {
        icon: "fas fa-user-tie",
        title: "Personal Guide",
        description: "Dedicated religious guide"
      },
      {
        icon: "fas fa-plane",
        title: "VIP Travel",
        description: "Premium flight options"
      },
      {
        icon: "fas fa-map-marked-alt",
        title: "Private Tours",
        description: "Exclusive ziyarat tours"
      }
    ]
  }
};

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerContainerRef = useRef<HTMLDivElement>(null);

  // Get the package data based on the ID
  const package_data = id ? packageData[id as keyof typeof packageData] : null;

  // If package not found, show error
  if (!package_data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <i className="fas fa-exclamation-circle text-4xl"></i>
          </div>
          <h2 className="text-xl font-semibold mb-2">Package Not Found</h2>
          <p className="text-gray-600 mb-4">The package you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/packages')}
            className="text-primary hover:text-primary-dark"
          >
            Browse All Packages
          </button>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!startDate || !endDate) return null;
    
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = package_data.priceType === 'fixed' ? package_data.price : package_data.price * nights;
    
    return {
      subtotal: basePrice,
      cleaning_fee: package_data.cleaning_fee,
      service_fee: package_data.service_fee,
      total: basePrice + package_data.cleaning_fee + package_data.service_fee
    };
  };

  const handleReserve = () => {
    if (!startDate || !endDate) {
      setIsDatePickerOpen(true);
      return;
    }
    navigate(`/packages/${id}/book`, {
      state: {
        startDate,
        endDate,
        guests,
        package_data
      }
    });
  };

  const handleDateSelect = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setIsDatePickerOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold mb-1">{package_data.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center">
                <i className="fas fa-star text-primary mr-1"></i>
                <span className="font-semibold">{package_data.rating}</span>
                <span className="mx-1">·</span>
                <button className="underline">{package_data.reviews} reviews</button>
              </div>
              <span className="text-gray-300">·</span>
              <span>{package_data.location}</span>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-1 text-sm">
                <i className="far fa-share-square"></i>
                Share
              </button>
              <button className="flex items-center gap-1 text-sm">
                <i className="far fa-heart"></i>
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-2 mb-4 rounded-xl overflow-hidden">
          <div className="col-span-2 row-span-2 h-[400px]">
            <img src={package_data.images[0]} alt="Main" className="w-full h-full object-cover" />
          </div>
          {package_data.images.slice(1).map((img, index) => (
            <div key={index} className="h-[198px]">
              <img src={img} alt={`Room ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Host Information */}
        <div className="flex items-center gap-3 py-3 border-b">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
          <div>
            <h2 className="text-lg font-semibold">Hosted by {package_data.host.name}</h2>
            <p className="text-gray-600 text-sm">{package_data.host.hosting_time} hosting</p>
          </div>
        </div>

        {/* Package Highlights */}
        <div className="py-3 space-y-3 border-b">
          {package_data.highlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="text-lg text-gray-600 w-6">
                <i className={highlight.icon}></i>
              </div>
              <div>
                <h3 className="font-medium">{highlight.title}</h3>
                <p className="text-gray-600 text-sm">{highlight.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content and Booking Card Section */}
        <div className="grid grid-cols-3 gap-6 mt-4">
          {/* Main Content */}
          <div className="col-span-2">
            {/* Package Description */}
            <div className="pb-4 border-b">
              <p className="text-gray-600 text-sm leading-relaxed">{package_data.description}</p>
              <button className="mt-2 text-sm font-medium underline">Show more</button>
            </div>

            {/* What this package offers */}
            <div className="py-4 border-b">
              <h2 className="text-lg font-semibold mb-4">What this package offers</h2>
              <div className="grid grid-cols-2 gap-3">
                {package_data.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-base text-gray-600 w-5">
                      <i className={amenity.icon}></i>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{amenity.title}</h3>
                      <p className="text-gray-600 text-xs">{amenity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="mt-4 px-4 py-2 border border-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100"
                onClick={() => {/* TODO: Show all amenities modal */}}
              >
                Show all {package_data.amenities.length} amenities
              </button>
            </div>

            {/* Reviews Section */}
            <div className="py-8">
              <div className="flex items-center gap-2 mb-8">
                <i className="fas fa-star text-primary"></i>
                <span className="font-semibold text-xl">{package_data.rating}</span>
                <span className="text-xl">·</span>
                <span className="font-semibold text-xl">{package_data.reviews} reviews</span>
              </div>

              {/* Overall Rating Distribution */}
              <div className="grid grid-cols-2 gap-12 mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <button className="flex-1 flex items-center gap-2 hover:underline">
                      <span className="w-4">5</span>
                      <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                      <span className="text-gray-600 w-8 text-right">95%</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <button className="flex-1 flex items-center gap-2 hover:underline">
                      <span className="w-4">4</span>
                      <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '4%' }}></div>
                      </div>
                      <span className="text-gray-600 w-8 text-right">4%</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <button className="flex-1 flex items-center gap-2 hover:underline">
                      <span className="w-4">3</span>
                      <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '1%' }}></div>
                      </div>
                      <span className="text-gray-600 w-8 text-right">1%</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <button className="flex-1 flex items-center gap-2 hover:underline">
                      <span className="w-4">2</span>
                      <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-gray-600 w-8 text-right">0%</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <button className="flex-1 flex items-center gap-2 hover:underline">
                      <span className="w-4">1</span>
                      <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-gray-600 w-8 text-right">0%</span>
                    </button>
                  </div>
                </div>

                {/* Rating Categories */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cleanliness</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                      <span className="text-sm">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Accuracy</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Check-in</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                      <span className="text-sm">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Communication</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Location</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                      <span className="text-sm">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Value</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <span className="text-sm">4.6</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Grid */}
              <div className="grid grid-cols-2 gap-12">
                {/* Review Item */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div>
                      <h3 className="font-medium">Louis</h3>
                      <p className="text-gray-500 text-sm">Valhalla, New York</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                    </div>
                    <span>·</span>
                    <span>August 2024</span>
                    <span>·</span>
                    <span>Stayed about a week</span>
                  </div>
                  <p className="text-gray-600">Perfect home for a large family; had everything we were looking for.</p>
                </div>

                {/* Review Item */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div>
                      <h3 className="font-medium">Julia</h3>
                      <p className="text-gray-500 text-sm">New York, New York</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                    </div>
                    <span>·</span>
                    <span>May 2024</span>
                    <span>·</span>
                    <span>Group trip</span>
                  </div>
                  <p className="text-gray-600">Had an absolutely wonderful restorative weekend with old friends at Kara's place. Upon arrival the grill and outdoor furniture weren't...</p>
                  <button className="text-gray-800 underline font-medium text-sm mt-2">Show more</button>
                </div>

                {/* Review Item */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div>
                      <h3 className="font-medium">Karen</h3>
                      <p className="text-gray-500 text-sm">Franklin Lakes, New Jersey</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                    </div>
                    <span>·</span>
                    <span>November 2023</span>
                    <span>·</span>
                    <span>Stayed with kids</span>
                  </div>
                  <p className="text-gray-600">This home is magnificent! Large enough for our extended family. The ocean views are spectacular with such beautiful sunrises. Ther...</p>
                  <button className="text-gray-800 underline font-medium text-sm mt-2">Show more</button>
                </div>

                {/* Review Item */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div>
                      <h3 className="font-medium">Matt</h3>
                      <p className="text-gray-500 text-sm">New York, New York</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                      <i className="fas fa-star text-primary text-xs"></i>
                    </div>
                    <span>·</span>
                    <span>September 2023</span>
                    <span>·</span>
                    <span>Group trip</span>
                  </div>
                  <p className="text-gray-600">A great stay for a large group!</p>
                </div>
              </div>

              {/* Show All Reviews Button */}
              <button 
                className="mt-8 px-6 py-3 border border-gray-800 rounded-lg font-medium hover:bg-gray-100"
                onClick={() => {/* TODO: Show all reviews modal */}}
              >
                Show all {package_data.reviews} reviews
              </button>
            </div>
          </div>

          {/* Booking Card */}
          <div className="relative">
            <div className="sticky top-20 bg-white rounded-lg border shadow-lg p-3">
              <div className="flex justify-between items-start mb-3">
                <div>
                  {startDate && endDate ? (
                    <>
                      <span className="text-lg font-semibold">${package_data.price}</span>
                      <span className="text-gray-600"> night</span>
                    </>
                  ) : (
                    <span className="text-lg font-semibold">Add dates for prices</span>
                  )}
                </div>
                <div className="flex items-center text-xs">
                  <i className="fas fa-star text-primary mr-1"></i>
                  <span className="font-medium">{package_data.rating}</span>
                  <span className="mx-1">·</span>
                  <button className="underline">{package_data.reviews} reviews</button>
                </div>
              </div>

              <div className="border rounded-lg mb-3">
                <div 
                  ref={datePickerContainerRef}
                  className="relative grid grid-cols-2 border-b"
                >
                  <div className="p-1.5 border-r">
                    <label className="block text-xs font-medium uppercase">Check-in</label>
                    <button
                      onClick={() => setIsDatePickerOpen(true)}
                      className="w-full text-left py-0.5 px-1 text-sm hover:bg-gray-50 rounded"
                    >
                      {startDate ? startDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'Add dates'}
                    </button>
                  </div>
                  <div className="p-1.5">
                    <label className="block text-xs font-medium uppercase">Checkout</label>
                    <button
                      onClick={() => setIsDatePickerOpen(true)}
                      className="w-full text-left py-0.5 px-1 text-sm hover:bg-gray-50 rounded"
                    >
                      {endDate ? endDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'Add dates'}
                    </button>
                  </div>

                  {/* Date Picker Popup */}
                  <CustomDatePicker
                    isOpen={isDatePickerOpen}
                    onClose={() => setIsDatePickerOpen(false)}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleDateSelect}
                    containerRef={datePickerContainerRef}
                  />
                </div>
                <div className="p-1.5">
                  <label className="block text-xs font-medium uppercase">Guests</label>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{guests} guest</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                        className="w-6 h-6 rounded-full border flex items-center justify-center text-gray-600 text-sm"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-sm">{guests}</span>
                      <button
                        onClick={() => setGuests(prev => prev + 1)}
                        className="w-6 h-6 rounded-full border flex items-center justify-center text-gray-600 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleReserve}
                className="w-full bg-primary text-white py-2.5 rounded-lg font-medium mb-3"
              >
                Reserve
              </button>

              <p className="text-center text-xs text-gray-600 mb-3">You won't be charged yet</p>

              {calculateTotal() && (
                <>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="underline">
                        ${package_data.price} x {Math.ceil((endDate!.getTime() - startDate!.getTime()) / (1000 * 60 * 60 * 24))} nights
                      </span>
                      <span>${calculateTotal()?.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="underline">Cleaning fee</span>
                      <span>${calculateTotal()?.cleaning_fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="underline">Service fee</span>
                      <span>${calculateTotal()?.service_fee}</span>
                    </div>
                  </div>
                  <div className="pt-2 mt-2 border-t flex justify-between font-medium text-sm">
                    <span>Total before taxes</span>
                    <span>${calculateTotal()?.total}</span>
                  </div>
                </>
              )}
            </div>

            {/* Report Listing Button */}
            <div className="mt-2 flex justify-center">
              <button 
                onClick={() => {/* TODO: Implement report functionality */}}
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-xs"
              >
                <i className="fas fa-flag"></i>
                <span>Report this listing</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PackageDetails; 