import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Agency {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  location: string;
  description: string;
  packageCount: number;
  yearEstablished: number;
  specialties: string[];
  certifications: string[];
  featuredPackages: {
    id: string;
    title: string;
    price: number;
    type: 'hajj' | 'umrah';
  }[];
  isFeatured?: boolean;
}

const AgencySearch = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('bestMatch');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    locations: [] as string[],
    minRating: 0,
    specialties: [] as string[],
    priceRange: 'all',
    certifications: [] as string[]
  });

  // Get unique locations from agencies
  const locations = [...new Set(agencies.map(agency => agency.location.split(',')[1].trim()))];
  
  // Get unique specialties from agencies
  const specialties = [...new Set(agencies.flatMap(agency => agency.specialties))];
  
  // Get unique certifications from agencies
  const certifications = [...new Set(agencies.flatMap(agency => agency.certifications))];

  // Filter and sort agencies
  useEffect(() => {
    let result = [...agencies];

    // Apply search term
    if (searchTerm) {
      result = result.filter(agency => 
        agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agency.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.locations.length > 0) {
      result = result.filter(agency => 
        filters.locations.some(loc => agency.location.includes(loc))
      );
    }

    if (filters.minRating > 0) {
      result = result.filter(agency => agency.rating >= filters.minRating);
    }

    if (filters.specialties.length > 0) {
      result = result.filter(agency =>
        filters.specialties.some(specialty => 
          agency.specialties.includes(specialty)
        )
      );
    }

    if (filters.certifications.length > 0) {
      result = result.filter(agency =>
        filters.certifications.some(cert => 
          agency.certifications.includes(cert)
        )
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'packages':
          return b.packageCount - a.packageCount;
        case 'established':
          return a.yearEstablished - b.yearEstablished;
        case 'bestMatch':
        default:
          // For best match, prioritize featured and high-rated agencies
          const aScore = (a.isFeatured ? 1 : 0) + a.rating;
          const bScore = (b.isFeatured ? 1 : 0) + b.rating;
          return bScore - aScore;
      }
    });

    setFilteredAgencies(result);
  }, [agencies, sortBy, searchTerm, filters]);

  // Dummy data
  useEffect(() => {
    setTimeout(() => {
      const dummyAgencies: Agency[] = [
        {
          id: 'al-safar',
          name: 'Al-Safar Travel',
          logo: '/images/agencies/al-safar.png',
          rating: 4.9,
          reviewCount: 328,
          location: 'Dubai, UAE',
          description: 'Premium Hajj and Umrah services with over 20 years of experience. Known for luxury packages and exceptional customer service.',
          packageCount: 15,
          yearEstablished: 2002,
          specialties: ['Luxury Hajj', 'VIP Umrah', 'Group Tours'],
          certifications: ['IATA Certified', 'Saudi Ministry of Hajj Approved'],
          featuredPackages: [
            { id: 'premium-hajj', title: 'Premium Hajj Package', price: 8999, type: 'hajj' },
            { id: 'vip-umrah', title: 'VIP Umrah Experience', price: 5999, type: 'umrah' }
          ],
          isFeatured: true
        },
        {
          id: 'baraka-tours',
          name: 'Baraka Tours',
          logo: '/images/agencies/baraka.png',
          rating: 4.7,
          reviewCount: 245,
          location: 'London, UK',
          description: 'Family-owned agency specializing in guided group packages with educational programs.',
          packageCount: 12,
          yearEstablished: 2008,
          specialties: ['Group Hajj', 'Family Umrah', 'Educational Tours'],
          certifications: ['IATA Certified', 'ATOL Protected'],
          featuredPackages: [
            { id: 'group-hajj', title: 'Group Hajj Package', price: 7499, type: 'hajj' },
            { id: 'family-umrah', title: 'Family Umrah Package', price: 4999, type: 'umrah' }
          ]
        },
        {
          id: 'blessed-journey',
          name: 'Blessed Journey',
          logo: '/images/agencies/blessed.png',
          rating: 4.9,
          reviewCount: 178,
          location: 'Toronto, Canada',
          description: 'Specialized in Ramadan Umrah packages and custom spiritual journeys.',
          packageCount: 8,
          yearEstablished: 2015,
          specialties: ['Ramadan Umrah', 'Custom Packages', 'Spiritual Guidance'],
          certifications: ['IATA Certified', 'TICO Registered'],
          featuredPackages: [
            { id: 'ramadan-special', title: 'Special Ramadan Umrah', price: 8499, type: 'umrah' }
          ],
          isFeatured: true
        },
        {
          id: 'elite-islamic',
          name: 'Elite Islamic Tours',
          logo: '/images/agencies/elite.png',
          rating: 5.0,
          reviewCount: 156,
          location: 'New York, USA',
          description: 'Luxury travel specialists offering exclusive VIP packages with personalized service.',
          packageCount: 10,
          yearEstablished: 2010,
          specialties: ['Luxury Packages', 'VIP Services', 'Private Groups'],
          certifications: ['IATA Certified', 'ARC Accredited'],
          featuredPackages: [
            { id: 'luxury-hajj', title: 'Luxury Hajj Experience', price: 12999, type: 'hajj' }
          ],
          isFeatured: true
        },
        {
          id: 'al-amin',
          name: 'Al-Amin Travel',
          logo: '/images/agencies/al-amin.png',
          rating: 4.3,
          reviewCount: 234,
          location: 'Manchester, UK',
          description: 'Budget-friendly packages without compromising on quality and service.',
          packageCount: 20,
          yearEstablished: 2012,
          specialties: ['Budget Packages', 'Group Tours', 'Student Specials'],
          certifications: ['IATA Certified', 'ATOL Protected'],
          featuredPackages: [
            { id: 'budget-umrah', title: 'Budget-Friendly Umrah', price: 3999, type: 'umrah' }
          ]
        }
      ];

      setAgencies(dummyAgencies);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Travel Agencies</h1>
          <p className="mt-2 text-gray-600">Find the perfect agency for your spiritual journey</p>
          
          {/* Search Bar */}
          <div className="mt-6 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search agencies by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <i className="fas fa-search"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h2 className="font-semibold mb-4">Filters</h2>
              
              {/* Location Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Location</h3>
                <div className="space-y-2">
                  {locations.map(location => (
                    <label key={location} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.locations.includes(location)}
                        onChange={(e) => {
                          setFilters(prev => ({
                            ...prev,
                            locations: e.target.checked
                              ? [...prev.locations, location]
                              : prev.locations.filter(loc => loc !== location)
                          }));
                        }}
                        className="form-checkbox h-4 w-4 text-emerald-600 rounded"
                      />
                      <span className="ml-2 text-sm">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Minimum Rating</h3>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    minRating: Number(e.target.value)
                  }))}
                  className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value={0}>Any Rating</option>
                  <option value={4.5}>4.5+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={3.5}>3.5+ Stars</option>
                </select>
              </div>

              {/* Specialties Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Specialties</h3>
                <div className="space-y-2">
                  {specialties.map(specialty => (
                    <label key={specialty} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.specialties.includes(specialty)}
                        onChange={(e) => {
                          setFilters(prev => ({
                            ...prev,
                            specialties: e.target.checked
                              ? [...prev.specialties, specialty]
                              : prev.specialties.filter(s => s !== specialty)
                          }));
                        }}
                        className="form-checkbox h-4 w-4 text-emerald-600 rounded"
                      />
                      <span className="ml-2 text-sm">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Certifications Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Certifications</h3>
                <div className="space-y-2">
                  {certifications.map(cert => (
                    <label key={cert} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.certifications.includes(cert)}
                        onChange={(e) => {
                          setFilters(prev => ({
                            ...prev,
                            certifications: e.target.checked
                              ? [...prev.certifications, cert]
                              : prev.certifications.filter(c => c !== cert)
                          }));
                        }}
                        className="form-checkbox h-4 w-4 text-emerald-600 rounded"
                      />
                      <span className="ml-2 text-sm">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => setFilters({
                  locations: [],
                  minRating: 0,
                  specialties: [],
                  priceRange: 'all',
                  certifications: []
                })}
                className="w-full py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="bestMatch">Best Match</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="packages">Most Packages</option>
                  <option value="established">Longest Established</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                {filteredAgencies.length} agencies found
              </div>
            </div>

            {/* Agency Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading agencies...</p>
              </div>
            ) : filteredAgencies.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <i className="fas fa-search text-4xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No agencies found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgencies.map((agency) => (
                  <Link 
                    key={agency.id} 
                    to={`/agencies/${agency.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      {/* Agency Logo and Featured Badge */}
                      <div className="relative flex justify-center mb-4">
                        <img 
                          src={agency.logo} 
                          alt={agency.name}
                          className="h-16 object-contain"
                        />
                        {agency.isFeatured && (
                          <div className="absolute -top-2 right-0 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                            Featured
                          </div>
                        )}
                      </div>

                      {/* Agency Info */}
                      <div className="text-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">{agency.name}</h2>
                        <div className="flex items-center justify-center mt-2">
                          <span className="text-lg font-medium text-gray-900">{agency.rating}</span>
                          <div className="flex items-center ml-1">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i}
                                className={`fas fa-star text-sm ${
                                  i < Math.floor(agency.rating) 
                                    ? 'text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              ></i>
                            ))}
                          </div>
                          <span className="ml-1 text-sm text-gray-600">({agency.reviewCount})</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{agency.location}</div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {agency.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-center text-sm">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="font-medium text-gray-900">{agency.packageCount}</div>
                          <div className="text-gray-600">Packages</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="font-medium text-gray-900">{new Date().getFullYear() - agency.yearEstablished}</div>
                          <div className="text-gray-600">Years Experience</div>
                        </div>
                      </div>

                      {/* Featured Packages Preview */}
                      {agency.featuredPackages.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="text-sm font-medium text-gray-900 mb-2">Featured Packages:</div>
                          <div className="space-y-2">
                            {agency.featuredPackages.map(pkg => (
                              <div key={pkg.id} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">{pkg.title}</span>
                                <span className="font-medium text-emerald-600">${pkg.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencySearch; 