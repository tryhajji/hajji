import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Package {
  id: string;
  title: string;
  image: string;
  price: number;
  duration: number;
  type: 'hajj' | 'umrah';
  startDate: string;
  rating: number;
  reviewCount: number;
  description: string;
  amenities: string[];
  availableSpots: number;
  isFeatured?: boolean;
}

interface Agency {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  location: string;
  description: string;
  yearEstablished: number;
  specialties: string[];
  certifications: string[];
}

interface AgencyDetailsProps {
  defaultTab?: 'packages' | 'groups';
}

const AgencyDetails = ({ defaultTab = 'packages' }: AgencyDetailsProps) => {
  const { id } = useParams<{ id: string }>();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hajj' | 'umrah'>(defaultTab === 'groups' ? 'umrah' : 'hajj');
  const [sortBy, setSortBy] = useState('featured');

  // Fetch agency and their packages
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const agencyData: Record<string, Agency> = {
        'al-safar': {
          id: 'al-safar',
          name: 'Al-Safar Travel',
          logo: '/images/agencies/al-safar.png',
          rating: 4.9,
          reviewCount: 328,
          location: 'Dubai, UAE',
          description: 'Premium Hajj and Umrah services with over 20 years of experience. Known for luxury packages and exceptional customer service.',
          yearEstablished: 2002,
          specialties: ['Luxury Hajj', 'VIP Umrah', 'Group Tours'],
          certifications: ['IATA Certified', 'Saudi Ministry of Hajj Approved']
        },
        'baraka-tours': {
          id: 'baraka-tours',
          name: 'Baraka Tours',
          logo: '/images/agencies/baraka.png',
          rating: 4.7,
          reviewCount: 245,
          location: 'London, UK',
          description: 'Family-owned agency specializing in guided group packages with educational programs.',
          yearEstablished: 2008,
          specialties: ['Group Hajj', 'Family Umrah', 'Educational Tours'],
          certifications: ['IATA Certified', 'ATOL Protected']
        },
        'blessed-journey': {
          id: 'blessed-journey',
          name: 'Blessed Journey',
          logo: '/images/agencies/blessed.png',
          rating: 4.9,
          reviewCount: 178,
          location: 'Toronto, Canada',
          description: 'Specialized in Ramadan Umrah packages and custom spiritual journeys.',
          yearEstablished: 2015,
          specialties: ['Ramadan Umrah', 'Custom Packages', 'Spiritual Guidance'],
          certifications: ['IATA Certified', 'TICO Registered']
        },
        'elite-islamic': {
          id: 'elite-islamic',
          name: 'Elite Islamic Tours',
          logo: '/images/agencies/elite.png',
          rating: 5.0,
          reviewCount: 156,
          location: 'New York, USA',
          description: 'Luxury travel specialists offering exclusive VIP packages with personalized service.',
          yearEstablished: 2010,
          specialties: ['Luxury Packages', 'VIP Services', 'Private Groups'],
          certifications: ['IATA Certified', 'ARC Accredited']
        },
        'al-amin': {
          id: 'al-amin',
          name: 'Al-Amin Travel',
          logo: '/images/agencies/al-amin.png',
          rating: 4.3,
          reviewCount: 234,
          location: 'Manchester, UK',
          description: 'Budget-friendly packages without compromising on quality and service.',
          yearEstablished: 2012,
          specialties: ['Budget Packages', 'Group Tours', 'Student Specials'],
          certifications: ['IATA Certified', 'ATOL Protected']
        }
      };

      const packageData: Record<string, Package[]> = {
        'al-safar': [
          {
            id: 'premium-umrah-1',
            title: 'Premium Umrah Package',
            image: '/images/packages/umrah1.jpg',
            price: 5999,
            duration: 14,
            type: 'umrah',
            startDate: '2024-03-15',
            rating: 4.8,
            reviewCount: 45,
            description: 'Luxury 5-star Umrah package with VIP services and exclusive amenities.',
            amenities: ['5-Star Hotels', 'VIP Transport', 'Private Guide', 'Luxury Services'],
            availableSpots: 10,
            isFeatured: true
          },
          {
            id: 'hajj-vip-1',
            title: 'VIP Hajj Experience',
            image: '/images/packages/hajj1.jpg',
            price: 12999,
            duration: 21,
            type: 'hajj',
            startDate: '2024-06-15',
            rating: 5.0,
            reviewCount: 28,
            description: 'All-inclusive VIP Hajj package with the finest accommodations and services.',
            amenities: ['Luxury Camp', 'Private Transport', '24/7 Support', 'Premium Services'],
            availableSpots: 5,
            isFeatured: true
          }
        ],
        'blessed-journey': [
          {
            id: 'ramadan-special',
            title: 'Special Ramadan Umrah',
            image: '/images/packages/ramadan.jpg',
            price: 8499,
            duration: 15,
            type: 'umrah',
            startDate: '2025-03-01',
            rating: 4.9,
            reviewCount: 178,
            description: 'Experience the blessed month of Ramadan in the holy cities with special programs and accommodations.',
            amenities: ['5-Star Hotels', 'VIP Transport', 'Iftar & Suhoor', 'Special Ramadan Programs'],
            availableSpots: 15,
            isFeatured: true
          }
        ],
        'baraka-tours': [
          {
            id: 'group-hajj',
            title: 'Group Hajj Package',
            image: '/images/packages/group.jpg',
            price: 7499,
            duration: 18,
            type: 'hajj',
            startDate: '2024-06-20',
            rating: 4.7,
            reviewCount: 89,
            description: 'Comprehensive group Hajj package with educational programs and experienced guides.',
            amenities: ['4-Star Hotels', 'Group Transport', 'Educational Sessions', 'Full Board Meals'],
            availableSpots: 20
          },
          {
            id: 'family-umrah',
            title: 'Family Umrah Package',
            image: '/images/packages/family.jpg',
            price: 4999,
            duration: 12,
            type: 'umrah',
            startDate: '2024-04-10',
            rating: 4.8,
            reviewCount: 67,
            description: 'Perfect for families with children, including special programs and family-friendly accommodations.',
            amenities: ['Family Rooms', 'Kid-Friendly Meals', 'Family Activities', 'Educational Programs'],
            availableSpots: 8
          }
        ],
        'elite-islamic': [
          {
            id: 'luxury-hajj',
            title: 'Luxury Hajj Experience',
            image: '/images/packages/luxury.jpg',
            price: 12999,
            duration: 21,
            type: 'hajj',
            startDate: '2024-06-15',
            rating: 5.0,
            reviewCount: 156,
            description: 'The ultimate luxury Hajj experience with exclusive accommodations and personalized service.',
            amenities: ['5-Star Hotels', 'Private Transport', 'Personal Guide', 'Gourmet Meals'],
            availableSpots: 5,
            isFeatured: true
          }
        ],
        'al-amin': [
          {
            id: 'budget-umrah',
            title: 'Budget-Friendly Umrah',
            image: '/images/packages/budget.jpg',
            price: 3999,
            duration: 10,
            type: 'umrah',
            startDate: '2024-05-01',
            rating: 4.3,
            reviewCount: 234,
            description: 'Affordable Umrah package without compromising on essential services.',
            amenities: ['3-Star Hotels', 'Group Transport', 'Basic Meals', 'Guide Service'],
            availableSpots: 25
          }
        ]
      };

      if (id && agencyData[id]) {
        setAgency(agencyData[id]);
        setPackages(packageData[id] || []);
      } else {
        setAgency(null);
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  // Filter and sort packages
  const filteredPackages = packages
    .filter(pkg => pkg.type === activeTab)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'date':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading agency details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Agency not found</h2>
            <p className="mt-2 text-gray-600">The agency you're looking for doesn't exist.</p>
            <Link to="/agencies" className="mt-4 inline-block text-emerald-600 hover:text-emerald-700">
              Back to Agencies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Agency Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <img 
              src={agency.logo} 
              alt={agency.name}
              className="h-20 w-20 object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{agency.name}</h1>
              <div className="flex items-center mt-2">
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
                <span className="ml-1 text-sm text-gray-600">({agency.reviewCount} reviews)</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-600">{agency.location}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 max-w-3xl">
            <p className="text-gray-600">{agency.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {agency.certifications.map(cert => (
                <span key={cert} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Package Filters */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex">
              <button
                onClick={() => setActiveTab('umrah')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'umrah'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Umrah Packages
              </button>
              <button
                onClick={() => setActiveTab('hajj')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'hajj'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Hajj Packages
              </button>
            </div>
            <div className="flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="date">Earliest Departure</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <i className="fas fa-package text-4xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} packages available
            </h3>
            <p className="text-gray-600">
              Check back later for new packages or view our {activeTab === 'hajj' ? 'Umrah' : 'Hajj'} packages.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <Link 
                key={pkg.id}
                to={`/packages/${pkg.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img 
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-48 object-cover"
                  />
                  {pkg.isFeatured && (
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.title}</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-medium text-gray-900">{pkg.rating}</span>
                    <div className="flex items-center ml-1">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i}
                          className={`fas fa-star text-sm ${
                            i < Math.floor(pkg.rating) 
                              ? 'text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        ></i>
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-600">({pkg.reviewCount})</span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {pkg.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Departure</div>
                      <div className="font-medium">
                        {new Date(pkg.startDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-medium">{pkg.duration} Days</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {pkg.availableSpots} spots left
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Starting from</div>
                      <div className="text-xl font-bold text-emerald-600">
                        ${pkg.price}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyDetails; 