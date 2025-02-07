import React from 'react';
import CustomDatePicker from './CustomDatePicker';
import Footer from './Footer';

interface PackageData {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  host: {
    name: string;
    type: string;
    hosting_time: string;
  };
  price: number;
  cleaning_fee: number;
  service_fee: number;
  images: string[];
  description: string;
  highlights: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  amenities: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

interface PackageDetailsLayoutProps {
  package_data: PackageData;
  startDate: Date | null;
  endDate: Date | null;
  guests: number;
  isDatePickerOpen: boolean;
  datePickerContainerRef: React.RefObject<HTMLDivElement>;
  onDatePickerOpen: () => void;
  onDatePickerClose: () => void;
  onDateSelect: (dates: [Date | null, Date | null]) => void;
  onGuestsChange: (newCount: number) => void;
  onReserve: () => void;
}

const PackageDetailsLayout: React.FC<PackageDetailsLayoutProps> = ({
  package_data,
  startDate,
  endDate,
  guests,
  isDatePickerOpen,
  datePickerContainerRef,
  onDatePickerOpen,
  onDatePickerClose,
  onDateSelect,
  onGuestsChange,
  onReserve,
}) => {
  const calculateTotal = () => {
    if (!startDate || !endDate) return null;
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const subtotal = package_data.price * nights;
    return {
      subtotal,
      cleaning_fee: package_data.cleaning_fee,
      service_fee: package_data.service_fee,
      total: subtotal + package_data.cleaning_fee + package_data.service_fee
    };
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
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Star Ratings */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs">
                    <button className="flex-1 flex items-center gap-1.5 hover:underline">
                      <span className="w-3">5</span>
                      <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                      <span className="text-gray-600 w-7 text-right">95%</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button className="flex-1 flex items-center gap-1.5 hover:underline">
                      <span className="w-3">4</span>
                      <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '4%' }}></div>
                      </div>
                      <span className="text-gray-600 w-7 text-right">4%</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button className="flex-1 flex items-center gap-1.5 hover:underline">
                      <span className="w-3">3</span>
                      <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '1%' }}></div>
                      </div>
                      <span className="text-gray-600 w-7 text-right">1%</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button className="flex-1 flex items-center gap-1.5 hover:underline">
                      <span className="w-3">2</span>
                      <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-gray-600 w-7 text-right">0%</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button className="flex-1 flex items-center gap-1.5 hover:underline">
                      <span className="w-3">1</span>
                      <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-gray-600 w-7 text-right">0%</span>
                    </button>
                  </div>
                </div>

                {/* Rating Categories */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-gray-600 text-sm mb-1">Cleanliness</div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-medium">4.9</span>
                      <div className="w-4 h-4 text-primary">
                        <i className="fas fa-star text-xs"></i>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 text-sm mb-1">Accuracy</div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-medium">4.8</span>
                      <div className="w-4 h-4 text-primary">
                        <i className="fas fa-star text-xs"></i>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 text-sm mb-1">Check-in</div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-medium">4.9</span>
                      <div className="w-4 h-4 text-primary">
                        <i className="fas fa-star text-xs"></i>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 text-sm mb-1">Communication</div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-medium">4.8</span>
                      <div className="w-4 h-4 text-primary">
                        <i className="fas fa-star text-xs"></i>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 text-sm mb-1">Location</div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-medium">4.9</span>
                      <div className="w-4 h-4 text-primary">
                        <i className="fas fa-star text-xs"></i>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 text-sm mb-1">Value</div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-medium">4.6</span>
                      <div className="w-4 h-4 text-primary">
                        <i className="fas fa-star text-xs"></i>
                      </div>
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

          {/* Booking Card Column */}
          <div className="sticky top-20 self-start h-fit">
            <div className="bg-white rounded-lg border shadow-lg p-3">
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
                      onClick={onDatePickerOpen}
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
                      onClick={onDatePickerOpen}
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
                    onClose={onDatePickerClose}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={onDateSelect}
                    containerRef={datePickerContainerRef}
                  />
                </div>
                <div className="p-1.5">
                  <label className="block text-xs font-medium uppercase">Guests</label>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{guests} guest</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onGuestsChange(Math.max(1, guests - 1))}
                        className="w-6 h-6 rounded-full border flex items-center justify-center text-gray-600 text-sm"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-sm">{guests}</span>
                      <button
                        onClick={() => onGuestsChange(guests + 1)}
                        className="w-6 h-6 rounded-full border flex items-center justify-center text-gray-600 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={onReserve}
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

              {/* Report Listing Button */}
              <div className="pt-3 mt-3 border-t text-center">
                <button 
                  onClick={() => {/* TODO: Implement report functionality */}}
                  className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-xs mx-auto"
                >
                  <i className="fas fa-flag"></i>
                  <span>Report this listing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PackageDetailsLayout; 