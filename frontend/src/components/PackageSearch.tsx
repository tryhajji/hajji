import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Package {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  priceType: 'fixed' | 'per_day';
  thumbnail: string;
  amenities: string[];
}

const PackageSearch: React.FC = () => {
  const navigate = useNavigate();

  const handlePackageClick = (packageId: string) => {
    navigate(`/package/${packageId}`);
  };

  const packages: Package[] = [
    {
      id: 'premium-hajj',
      title: "Premium Hajj Package",
      location: "Mecca & Medina, Saudi Arabia",
      rating: 4.9,
      reviews: 128,
      price: 8999,
      priceType: 'fixed',
      thumbnail: "/images/mecca.jpg",
      amenities: ["5-star hotels", "VIP transport", "Full board meals", "Guided tours"]
    },
    {
      id: 'standard-umrah',
      title: "Standard Umrah Package",
      location: "Medina, Saudi Arabia",
      rating: 4.7,
      reviews: 95,
      price: 200,
      priceType: 'per_day',
      thumbnail: "/images/medina.jpg",
      amenities: ["4-star hotels", "Airport transfers", "Half board meals", "Local guide"]
    },
    {
      id: 'group-hajj',
      title: "Group Hajj Package",
      location: "Mecca & Medina",
      rating: 4.8,
      reviews: 112,
      price: 7499,
      priceType: 'fixed',
      thumbnail: "/images/group.jpg",
      amenities: ["4-star hotels", "Group transport", "Full board meals", "Religious guide"]
    },
    {
      id: 'deluxe-umrah',
      title: "Deluxe Umrah Package",
      location: "Mecca & Medina",
      rating: 5.0,
      reviews: 78,
      price: 300,
      priceType: 'per_day',
      thumbnail: "/images/deluxe.jpg",
      amenities: ["5-star hotels", "Private transport", "Full board meals", "Personal guide"]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="cursor-pointer"
          onClick={() => handlePackageClick(pkg.id)}
        >
          {/* ... existing package card JSX ... */}
        </div>
      ))}
    </div>
  );
};

export default PackageSearch; 