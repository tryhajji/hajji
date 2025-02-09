import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigationType } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import PackageCard from '../components/PackageCard';

interface Package {
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
  groupSize: number;
  transportationType: 'vip' | 'standard' | 'economy';
  flightIncluded: boolean;
  visaIncluded: boolean;
  startDate: Date;
  endDate: Date;
  isDateFlexible: boolean;
  amenities: string[];
  thumbnail: string;
  isFeatured?: boolean;
}

interface SortOption {
  label: string;
  value: keyof Package | 'bestMatch';
  order: 'asc' | 'desc';
}

interface FilterOption {
  type: 'range' | 'checkbox' | 'radio';
  label: string;
  field: keyof Package;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
}

interface PackageSearchProps {
  type?: 'hajj' | 'umrah';
}

const getDummyPackages = (): Package[] => [
  {
    id: 'premium-hajj',
    title: 'Premium Hajj Package',
    type: 'hajj',
    agencyName: 'Al-Safar Travel',
    rating: 4.9,
    reviewCount: 128,
    price: 8999,
    priceType: 'fixed',
    duration: 15,
    isDurationFlexible: false,
    location: 'Mecca, Saudi Arabia',
    hotelStars: 5,
    distanceFromHaram: 100,
    meals: 'full-board',
    groupSize: 25,
    transportationType: 'vip',
    flightIncluded: true,
    visaIncluded: true,
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-15'),
    isDateFlexible: false,
    amenities: ['5-star hotels', 'VIP transport', 'Full board meals', 'Guided tours'],
    thumbnail: '/images/mecca.jpg',
    isFeatured: true
  },
  {
    id: 'standard-umrah',
    title: 'Standard Umrah Package',
    type: 'umrah',
    agencyName: 'Baraka Tours',
    rating: 4.7,
    reviewCount: 95,
    price: 200,
    priceType: 'per_day',
    duration: 1,
    isDurationFlexible: true,
    location: 'Medina, Saudi Arabia',
    hotelStars: 4,
    distanceFromHaram: 300,
    meals: 'half-board',
    groupSize: 15,
    transportationType: 'standard',
    flightIncluded: true,
    visaIncluded: true,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    isDateFlexible: true,
    amenities: ['4-star hotels', 'Airport transfers', 'Half board meals', 'Local guide'],
    thumbnail: '/images/medina.jpg',
    isFeatured: true
  },
  {
    id: 'group-hajj',
    title: 'Group Hajj Package',
    type: 'hajj',
    agencyName: 'Al-Iman Travels',
    rating: 4.8,
    reviewCount: 112,
    price: 7499,
    priceType: 'fixed',
    duration: 21,
    isDurationFlexible: false,
    location: 'Mecca & Medina',
    hotelStars: 4,
    distanceFromHaram: 500,
    meals: 'full-board',
    groupSize: 35,
    transportationType: 'standard',
    flightIncluded: true,
    visaIncluded: true,
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-21'),
    isDateFlexible: false,
    amenities: ['4-star hotels', 'Group transport', 'Full board meals', 'Religious guide'],
    thumbnail: '/images/group.jpg',
    isFeatured: true
  },
  {
    id: 'deluxe-umrah',
    title: 'Deluxe Umrah Package',
    type: 'umrah',
    agencyName: 'Royal Hajj Services',
    rating: 5.0,
    reviewCount: 78,
    price: 300,
    priceType: 'per_day',
    duration: 1,
    isDurationFlexible: true,
    location: 'Mecca & Medina',
    hotelStars: 5,
    distanceFromHaram: 150,
    meals: 'full-board',
    groupSize: 10,
    transportationType: 'vip',
    flightIncluded: true,
    visaIncluded: true,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    isDateFlexible: true,
    amenities: ['5-star hotels', 'Private transport', 'Full board meals', 'Personal guide'],
    thumbnail: '/images/deluxe.jpg',
    isFeatured: true
  }
];

const PackageSearch = ({ type }: PackageSearchProps) => {
  console.log('PackageSearch component rendering with type:', type);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigationType = useNavigationType();
  const [packages, setPackages] = useState<Package[]>([]);
  const [sortBy, setSortBy] = useState<string>('bestMatch');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Parse search parameters with error handling
  const parseSearchParams = () => {
    try {
      return {
        startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null,
        endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null,
        travelers: parseInt(searchParams.get('travelers') || '1'),
        tripType: (type || searchParams.get('type') || 'umrah') as 'umrah' | 'hajj',
        priceRange: searchParams.get('priceRange') || 'any'
      };
    } catch (error) {
      console.error('Error parsing search parameters:', error);
      return null;
    }
  };

  // Initialize state from URL parameters
  const searchCriteria = parseSearchParams();
  const [startDate, setStartDate] = useState<Date | null>(searchCriteria?.startDate || null);
  const [endDate, setEndDate] = useState<Date | null>(searchCriteria?.endDate || null);
  const [travelers, setTravelers] = useState<number>(searchCriteria?.travelers || 1);
  const [tripType, setTripType] = useState<'umrah' | 'hajj'>(searchCriteria?.tripType || 'umrah');
  const [priceRange, setPriceRange] = useState<string>(searchCriteria?.priceRange || 'any');

  // Update initial state to include search parameters
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(() => {
    // Get search parameters with null checks and safe defaults
    const initialType = type || searchParams.get('type') || '';
    const initialPriceRange = searchParams.get('priceRange') || '';
    const [priceMin, priceMax] = initialPriceRange 
      ? initialPriceRange.split('-').map(p => p.trim()) 
      : ['', ''];

    return {
      type: initialType ? [initialType] : [],
      hotelStars: [],
      meals: '',
      transportationType: '',
      amenities: [],
      priceMin: priceMin || '',
      priceMax: priceMax || ''
    };
  });

  // Add effect to update filters when search params change
  useEffect(() => {
    // Update type filter
    if (type || searchParams.get('type')) {
      setActiveFilters(prev => ({
        ...prev,
        type: [type || searchParams.get('type')!]
      }));
    }

    // Update price range filter
    const priceRangeParam = searchParams.get('priceRange');
    if (priceRangeParam) {
      try {
        const [min = '', max = ''] = priceRangeParam.split('-').map(p => p?.trim() || '');
        setActiveFilters(prev => ({
          ...prev,
          priceMin: min,
          priceMax: max
        }));
      } catch (error) {
        console.error('Error parsing price range:', error);
        // Keep existing values on error
        setActiveFilters(prev => ({
          ...prev,
          priceMin: prev.priceMin || '',
          priceMax: prev.priceMax || ''
        }));
      }
    }
  }, [type, searchParams]);

  // Define sort options
  const sortOptions: SortOption[] = [
    { label: 'Best Match', value: 'bestMatch', order: 'desc' },
    { label: 'Price: Low to High', value: 'price', order: 'asc' },
    { label: 'Price: High to Low', value: 'price', order: 'desc' },
    { label: 'Duration', value: 'duration', order: 'asc' },
    { label: 'Rating', value: 'rating', order: 'desc' },
    { label: 'Distance from Haram', value: 'distanceFromHaram', order: 'asc' },
    { label: 'Hotel Stars', value: 'hotelStars', order: 'desc' },
    { label: 'Group Size: Small to Large', value: 'groupSize', order: 'asc' },
  ];

  // Add sorting function
  const sortPackages = (packages: Package[], sortBy: string): Package[] => {
    const sortOption = sortOptions.find(option => option.value === sortBy);
    if (!sortOption) return packages;

    return [...packages].sort((a, b) => {
      let comparison = 0;

      switch (sortOption.value) {
        case 'bestMatch':
          if (a.isFeatured && !b.isFeatured) comparison = -1;
          else if (!a.isFeatured && b.isFeatured) comparison = 1;
          else comparison = b.rating - a.rating;
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'rating':
          comparison = b.rating - a.rating;
          if (comparison === 0) {
            comparison = b.reviewCount - a.reviewCount;
          }
          break;
        case 'distanceFromHaram':
          comparison = a.distanceFromHaram - b.distanceFromHaram;
          break;
        case 'hotelStars':
          comparison = b.hotelStars - a.hotelStars;
          break;
        case 'groupSize':
          comparison = a.groupSize - b.groupSize;
          break;
        default:
          return 0;
      }

      return sortOption.order === 'desc' ? -comparison : comparison;
    });
  };

  // Add filter function
  const filterPackages = (packages: Package[]): Package[] => {
    console.log('Filtering with criteria:', {
      tripType,
      type,
      startDate,
      endDate,
      travelers,
      priceRange,
      activeFilters
    });

    return packages.filter(pkg => {
      // Filter by type
      if (type && pkg.type !== type) {
        return false;
      }

      // Filter by price range
      if (activeFilters.priceMin || activeFilters.priceMax) {
        const min = parseInt(activeFilters.priceMin) || 0;
        const max = parseInt(activeFilters.priceMax) || Infinity;
        
        if (pkg.price < min || pkg.price > max) {
          return false;
        }
      }

      // Filter by date range - check if package's date range overlaps with selected dates
      if (startDate && endDate) {
        const packageStartDate = new Date(pkg.startDate);
        const packageEndDate = new Date(pkg.endDate);
        
        // Package is available if it starts before the end date AND ends after the start date
        if (packageStartDate > endDate || packageEndDate < startDate) {
          return false;
        }
      }

      // Filter by travelers
      if (travelers && travelers > 1 && pkg.groupSize < travelers) {
        return false;
      }

      // Apply sidebar filters
      if (activeFilters.hotelStars?.length > 0 && !activeFilters.hotelStars.includes(pkg.hotelStars)) {
        return false;
      }

      if (activeFilters.meals && pkg.meals !== activeFilters.meals) {
        return false;
      }

      if (activeFilters.transportationType && pkg.transportationType !== activeFilters.transportationType) {
        return false;
      }

      if (activeFilters.amenities?.length > 0) {
        const hasAllAmenities = activeFilters.amenities.every((amenity: string) => 
          pkg.amenities.includes(amenity)
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      return true;
    });
  };

  // Load packages when component mounts
  useEffect(() => {
    console.log('Loading packages...');
    const loadPackages = async () => {
      try {
        const dummyData = getDummyPackages();
        console.log('Dummy data loaded:', dummyData);
        setPackages(dummyData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading packages:', error);
        setError('Failed to load packages.');
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  console.log('Current state:', { loading, error, packagesCount: packages.length });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <i className="fas fa-exclamation-circle text-4xl"></i>
          </div>
          <p className="text-gray-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // Filter and sort packages
  const filteredPackages = filterPackages(packages);
  const sortedPackages = sortPackages(filteredPackages, sortBy);

  // Define filter options
  const filterOptions: FilterOption[] = [
    {
      type: 'checkbox',
      label: 'Package Type',
      field: 'type',
      options: [
        { label: 'Hajj', value: 'hajj' },
        { label: 'Umrah', value: 'umrah' },
      ],
    },
    {
      type: 'range',
      label: 'Price Range',
      field: 'price',
      min: 0,
      max: 20000,
    },
    {
      type: 'checkbox',
      label: 'Hotel Rating',
      field: 'hotelStars',
      options: [
        { label: '5 Stars', value: 5 },
        { label: '4 Stars', value: 4 },
        { label: '3 Stars', value: 3 },
      ],
    },
    {
      type: 'radio',
      label: 'Meals',
      field: 'meals',
      options: [
        { label: 'Full Board', value: 'full-board' },
        { label: 'Half Board', value: 'half-board' },
        { label: 'Breakfast Only', value: 'breakfast' },
        { label: 'No Meals', value: 'none' },
      ],
    },
    {
      type: 'radio',
      label: 'Transportation',
      field: 'transportationType',
      options: [
        { label: 'VIP', value: 'vip' },
        { label: 'Standard', value: 'standard' },
        { label: 'Economy', value: 'economy' },
      ],
    },
    {
      type: 'checkbox',
      label: 'Inclusions',
      field: 'amenities',
      options: [
        { label: 'Flight Included', value: 'flightIncluded' },
        { label: 'Visa Included', value: 'visaIncluded' },
        { label: 'Airport Transfer', value: 'airportTransfer' },
        { label: 'Local Guide', value: 'localGuide' },
        { label: 'Ziyarat Tours', value: 'ziyaratTours' },
      ],
    },
  ];

  // Add handler for filter changes
  const handleFilterChange = (field: string, value: any, isChecked: boolean) => {
    setActiveFilters(prev => {
      if (Array.isArray(prev[field])) {
        // Handle array-based filters (checkboxes)
        return {
          ...prev,
          [field]: isChecked 
            ? [...prev[field], value]
            : prev[field].filter((v: any) => v !== value)
        };
      } else {
        // Handle single-value filters (radio buttons)
        return {
          ...prev,
          [field]: isChecked ? value : ''
        };
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <div className="space-y-6">
                {filterOptions.map((filter, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-medium mb-3">{filter.label}</h3>
                    {filter.type === 'checkbox' && filter.options && (
                      <div className="space-y-2">
                        {filter.options.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={activeFilters[filter.field]?.includes(option.value)}
                              onChange={(e) => handleFilterChange(filter.field, option.value, e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="ml-2 text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {filter.type === 'radio' && filter.options && (
                      <div className="space-y-2">
                        {filter.options.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center">
                            <input
                              type="radio"
                              name={filter.field}
                              checked={activeFilters[filter.field] === option.value}
                              onChange={(e) => handleFilterChange(filter.field, option.value, e.target.checked)}
                              className="border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="ml-2 text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {filter.type === 'range' && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <input
                            type="number"
                            placeholder="Min"
                            value={activeFilters.priceMin}
                            onChange={(e) => handleFilterChange('priceMin', e.target.value, true)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={activeFilters.priceMax}
                            onChange={(e) => handleFilterChange('priceMax', e.target.value, true)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sorting and View Controls */}
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                  >
                    <i className="fas fa-th"></i>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>
              <div className="text-gray-600">
                {sortedPackages.length} packages found
              </div>
            </div>

            {/* Package Cards */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2' 
                : 'grid-cols-1'
            }`}>
              {sortedPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  {...pkg}
                  viewMode={viewMode}
                />
              ))}
            </div>
            
            {sortedPackages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <i className="fas fa-search text-6xl"></i>
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No packages found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageSearch; 