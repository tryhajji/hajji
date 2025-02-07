import PackageCard from '../components/PackageCard';
import  { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

interface Package {
  id: string;
  title: string;
  type: 'hajj' | 'umrah';
  agencyName: string;
  rating: number;
  reviewCount: number;
  price: number;
  duration: number;
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
  amenities: string[];
  thumbnail: string;
  isFeatured?: boolean;
  priceType: 'fixed' | 'per_day';
  isDurationFlexible: boolean;
  isDateFlexible: boolean;
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

const PackageSearch = ({ type }: PackageSearchProps) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [packages, setPackages] = useState<Package[]>([]);
  const [sortBy, setSortBy] = useState<string>('bestMatch');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Update initial state to include search parameters
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(() => {
    // Get search parameters
    const initialType = type || searchParams.get('type');
    const initialPriceRange = searchParams.get('priceRange');
    
    return {
      type: initialType ? [initialType] : [],
      hotelStars: [],
      meals: '',
      transportationType: '',
      amenities: [],
      priceMin: initialPriceRange ? parseInt(initialPriceRange.split(' - ')[0].replace(/[^0-9]/g, '')) : '',
      priceMax: initialPriceRange ? parseInt(initialPriceRange.split(' - ')[1].replace(/[^0-9]/g, '')) : ''
    };
  });

  // Add effect to update filters when search params change
  useEffect(() => {
    if (type || searchParams.get('type')) {
      setActiveFilters(prev => ({
        ...prev,
        type: [type || searchParams.get('type')!]
      }));
    }

    if (searchParams.get('priceRange')) {
      const priceRange = searchParams.get('priceRange')!;
      setActiveFilters(prev => ({
        ...prev,
        priceMin: priceRange.split(' - ')[0].replace(/[^0-9]/g, ''),
        priceMax: priceRange.split(' - ')[1].replace(/[^0-9]/g, '')
      }));
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
      type,
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      travelers: searchParams.get('travelers'),
      priceRange: searchParams.get('priceRange'),
      activeFilters
    });

    return packages.filter(pkg => {
      // Filter by type
      if (type && pkg.type !== type) {
        return false;
      }

      // Filter by price range
      if (searchParams.get('priceRange') && searchParams.get('priceRange') !== 'any') {
        const [minStr, maxStr] = searchParams.get('priceRange')!.split(' - ').map(str => str.replace(/[^0-9]/g, ''));
        const min = parseInt(minStr);
        const max = parseInt(maxStr);
        
        if (!isNaN(min) && !isNaN(max) && (pkg.price < min || pkg.price > max)) {
          return false;
        }
      }

      // Filter by date range
      if (searchParams.get('startDate') && searchParams.get('endDate')) {
        const packageStartDate = new Date(pkg.startDate);
        const packageEndDate = new Date(pkg.endDate);
        
        if (packageEndDate < new Date(searchParams.get('startDate')!) || packageStartDate > new Date(searchParams.get('endDate')!)) {
          return false;
        }
      }

      // Filter by travelers
      if (searchParams.get('travelers') && parseInt(searchParams.get('travelers')!) > 1 && pkg.groupSize < parseInt(searchParams.get('travelers')!)) {
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

  // Load packages when component mounts or when location state indicates a refresh
  useEffect(() => {
    const loadPackages = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        try {
          const dummyPackages: Package[] = [
            {
              id: 'premium-hajj',
              title: 'Premium Hajj Package',
              type: 'hajj',
              agencyName: 'Al-Safar Travel',
              rating: 4.9,
              reviewCount: 128,
              price: 8999,
              duration: 15,
              location: 'Mecca & Medina',
              hotelStars: 5,
              distanceFromHaram: 100,
              meals: 'full-board',
              groupSize: 25,
              transportationType: 'vip',
              flightIncluded: true,
              visaIncluded: true,
              startDate: new Date('2024-06-01'),
              endDate: new Date('2024-06-15'),
              amenities: ['Flight', 'Visa', 'VIP Transport', '5-Star Hotels', 'Full Board Meals', 'Ziyarat Tours'],
              thumbnail: '/images/mecca.jpg',
              isFeatured: true,
              priceType: 'fixed',
              isDurationFlexible: false,
              isDateFlexible: true
            },
            {
              id: 'standard-umrah',
              title: 'Standard Umrah Package',
              type: 'umrah',
              agencyName: 'Baraka Tours',
              rating: 4.7,
              reviewCount: 89,
              price: 5999,
              duration: 10,
              location: 'Mecca & Medina',
              hotelStars: 4,
              distanceFromHaram: 300,
              meals: 'half-board',
              groupSize: 30,
              transportationType: 'standard',
              flightIncluded: true,
              visaIncluded: true,
              startDate: new Date('2024-07-01'),
              endDate: new Date('2024-07-10'),
              amenities: ['Flight', 'Visa', 'Standard Transport', '4-Star Hotels', 'Half Board Meals'],
              thumbnail: '/images/medina.jpg',
              priceType: 'fixed',
              isDurationFlexible: false,
              isDateFlexible: false
            },
            {
              id: 'economy-hajj',
              title: 'Economy Hajj Package',
              type: 'hajj',
              agencyName: 'Ihsan Travel',
              rating: 4.5,
              reviewCount: 76,
              price: 6999,
              duration: 12,
              location: 'Mecca & Medina',
              hotelStars: 3,
              distanceFromHaram: 800,
              meals: 'breakfast',
              groupSize: 40,
              transportationType: 'economy',
              flightIncluded: true,
              visaIncluded: true,
              startDate: new Date('2024-08-01'),
              endDate: new Date('2024-08-12'),
              amenities: ['Flight', 'Visa', 'Economy Transport', '3-Star Hotels', 'Breakfast'],
              thumbnail: '/images/group.jpg',
              priceType: 'fixed',
              isDurationFlexible: false,
              isDateFlexible: false
            },
            {
              id: 'deluxe-umrah',
              title: 'Deluxe Umrah Package',
              type: 'umrah',
              agencyName: 'Royal Hajj Services',
              rating: 5.0,
              reviewCount: 45,
              price: 7999,
              duration: 14,
              location: 'Mecca & Medina',
              hotelStars: 5,
              distanceFromHaram: 50,
              meals: 'full-board',
              groupSize: 20,
              transportationType: 'vip',
              flightIncluded: true,
              visaIncluded: true,
              startDate: new Date('2024-09-01'),
              endDate: new Date('2024-09-14'),
              amenities: ['Flight', 'Visa', 'VIP Transport', 'Luxury Hotels', 'Full Board Meals', 'Private Guide'],
              thumbnail: '/images/deluxe.jpg',
              priceType: 'fixed',
              isDurationFlexible: false,
              isDateFlexible: false
            },
            {
              id: 'family-umrah',
              title: 'Family Umrah Package',
              type: 'umrah',
              agencyName: 'Family Muslim Tours',
              rating: 4.8,
              reviewCount: 92,
              price: 6499,
              duration: 10,
              location: 'Mecca & Medina',
              hotelStars: 4,
              distanceFromHaram: 400,
              meals: 'full-board',
              groupSize: 15,
              transportationType: 'standard',
              flightIncluded: true,
              visaIncluded: true,
              startDate: new Date('2024-10-01'),
              endDate: new Date('2024-10-10'),
              amenities: ['Flight', 'Visa', 'Family Rooms', 'Kid-Friendly Meals', 'Educational Tours'],
              thumbnail: '/images/family.jpg',
              priceType: 'fixed',
              isDurationFlexible: false,
              isDateFlexible: false
            },
            {
              id: 'luxury-hajj',
              title: 'Luxury Hajj Experience',
              type: 'hajj',
              agencyName: 'Elite Islamic Tours',
              rating: 5.0,
              reviewCount: 156,
              price: 12999,
              duration: 21,
              location: 'Mecca & Medina',
              hotelStars: 5,
              distanceFromHaram: 50,
              meals: 'full-board',
              groupSize: 15,
              transportationType: 'vip',
              flightIncluded: true,
              visaIncluded: true,
              startDate: new Date('2024-06-15'),
              endDate: new Date('2024-07-05'),
              amenities: ['Private Suite', 'Personal Guide', 'VIP Transport', 'Luxury Hotels', 'Gourmet Meals', 'Exclusive Ziyarat'],
              thumbnail: '/images/luxury.jpg',
              isFeatured: true,
              priceType: 'fixed',
              isDurationFlexible: false,
              isDateFlexible: false
            },
            {
              id: 'budget-umrah',
              title: 'Budget-Friendly Umrah',
              type: 'umrah',
              agencyName: 'Al-Amin Travel',
              rating: 4.3,
              reviewCount: 234,
              price: 3999,
              duration: 7,
              location: 'Mecca & Medina',
              hotelStars: 3,
              distanceFromHaram: 1200,
              meals: 'breakfast',
              groupSize: 45,
              transportationType: 'economy',
              flightIncluded: true,
              visaIncluded: true,
              startDate: new Date('2024-11-01'),
              endDate: new Date('2024-11-07'),
              amenities: ['Flight', 'Visa', 'Basic Transport', '3-Star Hotels', 'Breakfast'],
              thumbnail: '/images/budget.jpg',
              priceType: 'fixed',
              isDurationFlexible: false,
              isDateFlexible: false
            },
            {
              id: 'ramadan-umrah',
              title: 'Special Ramadan Umrah',
              type: 'umrah',
              agencyName: 'Blessed Journey',
              rating: 4.9,
              reviewCount: 178,
              price: 8499,
              duration: 15,
              location: 'Mecca & Medina',
              hotelStars: 5,
              distanceFromHaram: 200,
              meals: 'full-board',
              groupSize: 30,
              transportationType: 'vip',
              flightIncluded: true,
              visaIncluded: true,
              startDate: new Date('2025-03-01'),
              endDate: new Date('2025-03-15'),
              amenities: ['Flight', 'Visa', 'VIP Transport', '5-Star Hotels', 'Iftar & Suhoor', 'Ramadan Programs'],
              thumbnail: '/images/ramadan.jpg',
              isFeatured: true,
              priceType: 'fixed',
              isDurationFlexible: false,
              isDateFlexible: false
            }
          ];

          console.log('Total packages before filtering:', dummyPackages.length);
          
          // Apply filters to the packages
          const filteredPackages = filterPackages(dummyPackages);
          console.log('Packages after filtering:', filteredPackages.length);
          
          // Apply sorting
          const sortedPackages = sortPackages(filteredPackages, sortBy);
          
          setPackages(sortedPackages);
        } catch (error) {
          console.error('Error processing packages:', error);
          setPackages([]);
        } finally {
          setLoading(false);
        }
      }, 1000);
    };

    // Load packages on mount and when location state has refresh flag
    loadPackages();
  }, [location.state, type, sortBy, activeFilters]);

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
      <div className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-semibold mb-8">Search Packages</h1>

          {/* Displaying the search parameters */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Search Criteria</h2>
            <p>Number of Travelers: {parseInt(searchParams.get('travelers') || '1')}</p>
            <p>Trip Type: {type || (searchParams.get('type') as 'umrah' | 'hajj') || 'umrah'}</p>
            <p>Price Range: {searchParams.get('priceRange') || 'any'}</p>
          </div>

          {/* Top Bar with Sort and View Options */}
          <div className="sticky top-0 bg-white border-b z-30">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-emerald-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <i className="fas fa-th-large mr-2"></i>
                    Grid View
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-emerald-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <i className="fas fa-list mr-2"></i>
                    List View
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {packages.length} packages found
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-6">
            <div className="flex gap-6">
              {/* Filters Sidebar */}
              <div className="w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow p-4 sticky top-20">
                  <h2 className="font-semibold mb-4">Filters</h2>
                  {filterOptions.map((filter) => (
                    <div key={filter.field} className="mb-6">
                      <h3 className="font-medium mb-2">{filter.label}</h3>
                      {filter.type === 'checkbox' && (
                        <div className="space-y-2">
                          {filter.options?.map((option) => (
                            <label key={option.value} className="flex items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-emerald-600 rounded"
                                checked={activeFilters[filter.field]?.includes(option.value)}
                                onChange={(e) => handleFilterChange(filter.field, option.value, e.target.checked)}
                              />
                              <span className="ml-2 text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {filter.type === 'range' && filter.field === 'price' ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              className="w-24 h-8 px-2 border rounded focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                              placeholder="Min"
                              value={activeFilters.priceMin}
                              onChange={(e) => setActiveFilters(prev => ({
                                ...prev,
                                priceMin: e.target.value
                              }))}
                              min={filter.min}
                              max={filter.max}
                            />
                            <span>-</span>
                            <input
                              type="number"
                              className="w-24 h-8 px-2 border rounded focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                              placeholder="Max"
                              value={activeFilters.priceMax}
                              onChange={(e) => setActiveFilters(prev => ({
                                ...prev,
                                priceMax: e.target.value
                              }))}
                              min={filter.min}
                              max={filter.max}
                            />
                          </div>
                        </div>
                      ) : filter.type === 'range' && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              className="w-24 h-8 px-2 border rounded focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                              placeholder="Min"
                              min={filter.min}
                              max={filter.max}
                            />
                            <span>-</span>
                            <input
                              type="number"
                              className="w-24 h-8 px-2 border rounded focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                              placeholder="Max"
                              min={filter.min}
                              max={filter.max}
                            />
                          </div>
                        </div>
                      )}
                      {filter.type === 'radio' && (
                        <div className="space-y-2">
                          {filter.options?.map((option) => (
                            <label key={option.value} className="flex items-center">
                              <input
                                type="radio"
                                name={filter.field}
                                className="form-radio h-4 w-4 text-emerald-600"
                                checked={activeFilters[filter.field] === option.value}
                                onChange={(e) => handleFilterChange(filter.field, option.value, e.target.checked)}
                              />
                              <span className="ml-2 text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="flex-1">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading packages...</p>
                  </div>
                ) : packages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No packages found matching your criteria.</p>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
                    {packages.map((pkg) => (
                      <PackageCard
                        key={pkg.id}
                        {...pkg}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageSearch; 