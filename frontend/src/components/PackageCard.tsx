import React from 'react';
import { Link } from 'react-router-dom';

interface PackageCardProps {
  id: string;
  title: string;
  type: 'hajj' | 'umrah';
  agencyName: string;
  rating: number;
  reviewCount: number;
  price: number;
  priceType: 'fixed' | 'per_day';
  duration: number;
  isDurationFlexible: boolean;
  location: string;
  hotelStars: number;
  distanceFromHaram: number;
  meals: 'full-board' | 'half-board' | 'breakfast' | 'none';
  transportationType: 'vip' | 'standard' | 'economy';
  thumbnail: string;
  startDate: Date;
  endDate: Date;
  isDateFlexible: boolean;
  amenities: string[];
  isFeatured?: boolean;
  viewMode: 'list' | 'grid';
}

const PackageCard: React.FC<PackageCardProps> = ({
  id,
  title,
  type,
  agencyName,
  rating,
  reviewCount,
  price,
  priceType,
  duration,
  isDurationFlexible,
  location,
  hotelStars,
  distanceFromHaram,
  meals,
  transportationType,
  thumbnail,
  startDate,
  endDate,
  isDateFlexible,
  amenities,
  isFeatured,
  viewMode
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderStars = (count: number) => {
    return Array(count).fill(0).map((_, i) => (
      <i key={i} className="fas fa-star text-yellow-400 text-sm"></i>
    ));
  };

  const getMealLabel = (mealType: string) => {
    switch (mealType) {
      case 'full-board': return 'Full Board';
      case 'half-board': return 'Half Board';
      case 'breakfast': return 'Breakfast Only';
      default: return 'No Meals';
    }
  };

  const cardClasses = viewMode === 'grid'
    ? 'flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full'
    : 'flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow';

  const imageClasses = viewMode === 'grid'
    ? 'w-full h-48 object-cover'
    : 'w-80 h-full object-cover';

  const contentClasses = viewMode === 'grid'
    ? 'flex-1 p-4'
    : 'flex-1 p-6';

  const renderPriceSection = () => {
    if (type === 'hajj') {
      return (
        <div>
          <div className="text-2xl font-bold text-primary">${price.toLocaleString()}</div>
          <div className="text-sm text-gray-600">fixed package</div>
          <div className="text-xs text-gray-500">
            {formatDate(startDate)} - {formatDate(endDate)}
          </div>
        </div>
      );
    } else { // Umrah package
      return (
        <div>
          <div className="text-2xl font-bold text-primary">${price.toLocaleString()}</div>
          <div className="text-sm text-gray-600">per day</div>
          <div className="text-xs text-gray-500">
            Flexible duration
          </div>
        </div>
      );
    }
  };

  return (
    <Link to={`/packages/${id}`} className={cardClasses}>
      {/* Image Section */}
      <div className={viewMode === 'grid' ? 'relative' : 'relative w-80 flex-shrink-0'}>
        <img 
          src={thumbnail} 
          alt={title}
          className={imageClasses}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1565552645632-d725c4196e6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
          }}
        />
        {isFeatured && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
            Featured
          </div>
        )}
        {!isDateFlexible && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
            <div className="text-white text-sm">
              {formatDate(startDate)} - {formatDate(endDate)}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={contentClasses}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                {renderStars(hotelStars)}
              </div>
              <span className="mx-2">·</span>
              <span className="text-sm text-gray-600">{location}</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <span className="font-medium">{rating}</span>
              <i className="fas fa-star text-primary ml-1 mr-1"></i>
              <span>({reviewCount} reviews)</span>
              <span className="mx-2">·</span>
              <span>{agencyName}</span>
            </div>
          </div>
          <div className="text-right">
            {renderPriceSection()}
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm font-medium">Duration</div>
            <div className="text-sm text-gray-600">{duration} days</div>
          </div>
          <div>
            <div className="text-sm font-medium">Distance from Haram</div>
            <div className="text-sm text-gray-600">{distanceFromHaram}m</div>
          </div>
          <div>
            <div className="text-sm font-medium">Meals</div>
            <div className="text-sm text-gray-600">{getMealLabel(meals)}</div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-4 flex flex-wrap gap-2">
          {amenities.slice(0, 4).map((amenity, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
            >
              <i className="fas fa-check text-primary mr-1"></i>
              {amenity}
            </span>
          ))}
          {amenities.length > 4 && (
            <span className="text-xs text-gray-500">
              +{amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Dates and View Deal */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {formatDate(startDate)} - {formatDate(endDate)}
          </div>
          <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            View Deal
          </button>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard; 