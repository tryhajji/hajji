import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface UmrahGroup {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  departureLocation: string;
  departureDate: string;
  duration: number;
  groupSize: number;
  price: number;
  description: string;
  leaderName: string;
  leaderExperience: number;
  language: string[];
  amenities: string[];
  availableSpots: number;
  isFeatured?: boolean;
}

const UmrahGroupSearch = () => {
  const [groups, setGroups] = useState<UmrahGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<UmrahGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('bestMatch');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    departureLocations: [] as string[],
    minRating: 0,
    priceRange: 'all',
    languages: [] as string[],
    duration: 'all',
    amenities: [] as string[]
  });

  // Get unique values for filters
  const departureLocations = [...new Set(groups.map(group => group.departureLocation))];
  const languages = [...new Set(groups.flatMap(group => group.language))];
  const amenities = [...new Set(groups.flatMap(group => group.amenities))];

  // Filter and sort groups
  useEffect(() => {
    let result = [...groups];

    // Apply search term
    if (searchTerm) {
      result = result.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.leaderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.departureLocations.length > 0) {
      result = result.filter(group => 
        filters.departureLocations.includes(group.departureLocation)
      );
    }

    if (filters.minRating > 0) {
      result = result.filter(group => group.rating >= filters.minRating);
    }

    if (filters.languages.length > 0) {
      result = result.filter(group =>
        filters.languages.some(lang => 
          group.language.includes(lang)
        )
      );
    }

    if (filters.amenities.length > 0) {
      result = result.filter(group =>
        filters.amenities.some(amenity => 
          group.amenities.includes(amenity)
        )
      );
    }

    if (filters.duration !== 'all') {
      const [min, max] = filters.duration.split('-').map(Number);
      result = result.filter(group => 
        group.duration >= min && (!max || group.duration <= max)
      );
    }

    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(group => 
        group.price >= min && (!max || group.price <= max)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'date-soon':
          return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
        case 'availability':
          return b.availableSpots - a.availableSpots;
        case 'bestMatch':
        default:
          // For best match, prioritize featured groups and availability
          const aScore = (a.isFeatured ? 2 : 0) + (a.availableSpots > 0 ? 1 : 0) + a.rating;
          const bScore = (b.isFeatured ? 2 : 0) + (b.availableSpots > 0 ? 1 : 0) + b.rating;
          return bScore - aScore;
      }
    });

    setFilteredGroups(result);
  }, [groups, sortBy, searchTerm, filters]);

  // Dummy data
  useEffect(() => {
    setTimeout(() => {
      const dummyGroups: UmrahGroup[] = [
        {
          id: 'blessed-group-1',
          name: 'Blessed Journey Ramadan Group',
          image: '/images/groups/group1.jpg',
          rating: 4.9,
          reviewCount: 124,
          departureLocation: 'London, UK',
          departureDate: '2024-03-15',
          duration: 14,
          groupSize: 25,
          price: 3999,
          description: 'Join our blessed Ramadan Umrah group led by Sheikh Ahmad. Experience spiritual guidance and exclusive access to special prayers.',
          leaderName: 'Sheikh Ahmad',
          leaderExperience: 15,
          language: ['English', 'Arabic'],
          amenities: ['5-Star Hotel', 'Private Transport', 'Guided Tours', 'Daily Classes'],
          availableSpots: 8,
          isFeatured: true
        },
        {
          id: 'family-group-1',
          name: 'Family-Friendly Umrah Group',
          image: '/images/groups/group2.jpg',
          rating: 4.8,
          reviewCount: 89,
          departureLocation: 'Toronto, Canada',
          departureDate: '2024-04-01',
          duration: 10,
          groupSize: 20,
          price: 3499,
          description: 'Perfect for families with children. Special programs for kids and dedicated support for first-time pilgrims.',
          leaderName: 'Ustadh Mohammed',
          leaderExperience: 10,
          language: ['English', 'Urdu'],
          amenities: ['Family Rooms', 'Kids Program', 'Halal Meals', 'Medical Support'],
          availableSpots: 4
        },
        {
          id: 'scholars-group-1',
          name: 'Scholars Special Group',
          image: '/images/groups/group3.jpg',
          rating: 5.0,
          reviewCount: 67,
          departureLocation: 'Dubai, UAE',
          departureDate: '2024-03-20',
          duration: 21,
          groupSize: 15,
          price: 5999,
          description: 'An exclusive group focusing on deep spiritual knowledge with daily lessons from prominent scholars.',
          leaderName: 'Dr. Abdullah',
          leaderExperience: 20,
          language: ['English', 'Arabic', 'Turkish'],
          amenities: ['VIP Transport', 'Premium Hotel', 'Daily Lectures', 'Private Sessions'],
          availableSpots: 3,
          isFeatured: true
        }
      ];
      setGroups(dummyGroups);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Umrah Groups</h1>
          <p className="mt-2 text-gray-600">Join a guided group for your blessed journey</p>
          
          {/* Search Bar */}
          <div className="mt-6 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search groups by name, description, or leader..."
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
              
              {/* Departure Location Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Departure From</h3>
                <div className="space-y-2">
                  {departureLocations.map(location => (
                    <label key={location} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.departureLocations.includes(location)}
                        onChange={(e) => {
                          setFilters(prev => ({
                            ...prev,
                            departureLocations: e.target.checked
                              ? [...prev.departureLocations, location]
                              : prev.departureLocations.filter(loc => loc !== location)
                          }));
                        }}
                        className="form-checkbox h-4 w-4 text-emerald-600 rounded"
                      />
                      <span className="ml-2 text-sm">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Duration</h3>
                <select
                  value={filters.duration}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    duration: e.target.value
                  }))}
                  className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="all">Any Duration</option>
                  <option value="7-10">7-10 Days</option>
                  <option value="11-14">11-14 Days</option>
                  <option value="15-21">15-21 Days</option>
                  <option value="21">21+ Days</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Price Range</h3>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: e.target.value
                  }))}
                  className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="all">Any Price</option>
                  <option value="0-3000">Under $3,000</option>
                  <option value="3000-5000">$3,000 - $5,000</option>
                  <option value="5000-7000">$5,000 - $7,000</option>
                  <option value="7000">$7,000+</option>
                </select>
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

              {/* Language Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Languages</h3>
                <div className="space-y-2">
                  {languages.map(language => (
                    <label key={language} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.languages.includes(language)}
                        onChange={(e) => {
                          setFilters(prev => ({
                            ...prev,
                            languages: e.target.checked
                              ? [...prev.languages, language]
                              : prev.languages.filter(lang => lang !== language)
                          }));
                        }}
                        className="form-checkbox h-4 w-4 text-emerald-600 rounded"
                      />
                      <span className="ml-2 text-sm">{language}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Amenities</h3>
                <div className="space-y-2">
                  {amenities.map(amenity => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={(e) => {
                          setFilters(prev => ({
                            ...prev,
                            amenities: e.target.checked
                              ? [...prev.amenities, amenity]
                              : prev.amenities.filter(a => a !== amenity)
                          }));
                        }}
                        className="form-checkbox h-4 w-4 text-emerald-600 rounded"
                      />
                      <span className="ml-2 text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => setFilters({
                  departureLocations: [],
                  minRating: 0,
                  priceRange: 'all',
                  languages: [],
                  duration: 'all',
                  amenities: []
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
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="date-soon">Earliest Departure</option>
                  <option value="availability">Most Available Spots</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                {filteredGroups.length} groups found
              </div>
            </div>

            {/* Groups Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading groups...</p>
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <i className="fas fa-search text-4xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                  <Link 
                    key={group.id} 
                    to={`/groups/${group.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img 
                        src={group.image} 
                        alt={group.name}
                        className="w-full h-48 object-cover"
                      />
                      {group.isFeatured && (
                        <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                          Featured
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {/* Group Info */}
                      <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h2>
                        <div className="flex items-center mb-2">
                          <span className="text-lg font-medium text-gray-900">{group.rating}</span>
                          <div className="flex items-center ml-1">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i}
                                className={`fas fa-star text-sm ${
                                  i < Math.floor(group.rating) 
                                    ? 'text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              ></i>
                            ))}
                          </div>
                          <span className="ml-1 text-sm text-gray-600">({group.reviewCount})</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {group.description}
                        </p>
                      </div>

                      {/* Key Details */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Departure</div>
                          <div className="font-medium">{new Date(group.departureDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Duration</div>
                          <div className="font-medium">{group.duration} Days</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Group Size</div>
                          <div className="font-medium">{group.groupSize} People</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Available Spots</div>
                          <div className="font-medium">{group.availableSpots}</div>
                        </div>
                      </div>

                      {/* Leader Info */}
                      <div className="mb-4 pb-4 border-b">
                        <div className="text-sm text-gray-600">Group Leader</div>
                        <div className="font-medium">{group.leaderName}</div>
                        <div className="text-sm text-gray-600">{group.leaderExperience} years experience</div>
                      </div>

                      {/* Price and Languages */}
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-sm text-gray-600">Languages</div>
                          <div className="flex gap-1">
                            {group.language.map(lang => (
                              <span key={lang} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Price per person</div>
                          <div className="text-xl font-bold text-emerald-600">${group.price}</div>
                        </div>
                      </div>
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

export default UmrahGroupSearch; 