import { FC, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PackageDetailsLayout from '../components/PackageDetailsLayout';

const StandardPackageDetails: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerContainerRef = useRef<HTMLDivElement>(null);

  // Mock data for Standard Package
  const package_data = {
    id: id || '',
    title: "Standard Hajj Package",
    location: "Mecca & Medina, Saudi Arabia",
    rating: 4.8,
    reviews: 95,
    host: {
      name: "Al-Safwah Travel",
      type: "Verified Agency",
      hosting_time: "5 years"
    },
    price: 6999,
    cleaning_fee: 100,
    service_fee: 200,
    images: [
      "/images/mecca-standard.jpg",
      "/images/standard-room1.jpg",
      "/images/standard-room2.jpg",
      "/images/standard-room3.jpg",
      "/images/standard-room4.jpg"
    ],
    description: "Experience a comfortable and spiritually enriching Hajj journey with our standard package. This well-planned package provides all essential services for a fulfilling pilgrimage...",
    highlights: [
      {
        icon: "fas fa-check-circle",
        title: "Standard Package",
        description: "Well-rated Hajj package with quality service"
      },
      {
        icon: "fas fa-calendar-check",
        title: "Free cancellation",
        description: "Cancel up to 45 days before your trip for a full refund"
      },
      {
        icon: "fas fa-headset",
        title: "Support available",
        description: "Dedicated support team for assistance"
      }
    ],
    amenities: [
      {
        icon: "fas fa-hotel",
        title: "4-Star Hotel Accommodations",
        description: "Comfortable rooms in Mecca & Medina"
      },
      {
        icon: "fas fa-utensils",
        title: "Full-Board Meals",
        description: "3 halal meals daily"
      },
      {
        icon: "fas fa-bus",
        title: "Transportation",
        description: "Ground transport included"
      },
      {
        icon: "fas fa-user-tie",
        title: "Religious Guide",
        description: "Experienced scholarly guidance"
      },
      {
        icon: "fas fa-plane",
        title: "Air Travel",
        description: "Economy flights included"
      },
      {
        icon: "fas fa-map-marked-alt",
        title: "Ziyarat Tours",
        description: "Major sites visits included"
      },
      {
        icon: "fas fa-first-aid",
        title: "Basic Medical Support",
        description: "Medical assistance available"
      },
      {
        icon: "fas fa-phone",
        title: "Customer Support",
        description: "Support during business hours"
      }
    ]
  };

  const handleDateSelect = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setIsDatePickerOpen(false);
    }
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

  return (
    <PackageDetailsLayout
      package_data={package_data}
      startDate={startDate}
      endDate={endDate}
      guests={guests}
      isDatePickerOpen={isDatePickerOpen}
      datePickerContainerRef={datePickerContainerRef}
      onDatePickerOpen={() => setIsDatePickerOpen(true)}
      onDatePickerClose={() => setIsDatePickerOpen(false)}
      onDateSelect={handleDateSelect}
      onGuestsChange={setGuests}
      onReserve={handleReserve}
    />
  );
};

export default StandardPackageDetails; 