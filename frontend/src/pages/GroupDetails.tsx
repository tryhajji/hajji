import  { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

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
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  inclusions: string[];
  exclusions: string[];
  requirements: string[];
}

const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<UmrahGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'inclusions'>('overview');

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setGroup({
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
        isFeatured: true,
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Jeddah',
            description: 'Arrival at Jeddah Airport, transfer to Makkah hotel, rest and preparation.'
          },
          {
            day: 2,
            title: 'Umrah Rituals',
            description: 'Perform Umrah rituals with guidance from Sheikh Ahmad.'
          },
          // Add more days...
        ],
        inclusions: [
          '5-star hotel accommodation',
          'All transfers in private AC buses',
          'Daily Islamic lectures',
          'Guided Ziyarat tours',
          'Three meals daily',
          'Visa processing'
        ],
        exclusions: [
          'International flights',
          'Personal expenses',
          'Optional tours',
          'Travel insurance'
        ],
        requirements: [
          'Valid passport with 6 months validity',
          'Vaccination requirements as per current guidelines',
          'Mahram requirements for females',
          'Good health condition'
        ]
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading group details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Group not found</h2>
            <p className="mt-2 text-gray-600">The group you're looking for doesn't exist.</p>
            <Link to="/groups" className="mt-4 inline-block text-emerald-600 hover:text-emerald-700">
              Back to Groups
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96">
        <img 
          src={group.image}
          alt={group.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-white mb-4">{group.name}</h1>
              <div className="flex items-center text-white mb-4">
                <span className="text-lg font-medium">{group.rating}</span>
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
                <span className="ml-1 text-sm">({group.reviewCount} reviews)</span>
              </div>
              <p className="text-lg text-white">{group.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 divide-x">
            <div className="py-4 px-6">
              <div className="text-sm text-gray-600">Departure</div>
              <div className="font-medium">{new Date(group.departureDate).toLocaleDateString()}</div>
            </div>
            <div className="py-4 px-6">
              <div className="text-sm text-gray-600">Duration</div>
              <div className="font-medium">{group.duration} Days</div>
            </div>
            <div className="py-4 px-6">
              <div className="text-sm text-gray-600">Group Size</div>
              <div className="font-medium">{group.groupSize} People</div>
            </div>
            <div className="py-4 px-6">
              <div className="text-sm text-gray-600">Available Spots</div>
              <div className="font-medium">{group.availableSpots}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="mb-6 border-b">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-4 text-sm font-medium border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`pb-4 text-sm font-medium border-b-2 ${
                    activeTab === 'itinerary'
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Itinerary
                </button>
                <button
                  onClick={() => setActiveTab('inclusions')}
                  className={`pb-4 text-sm font-medium border-b-2 ${
                    activeTab === 'inclusions'
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Inclusions & Requirements
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div>
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Group Leader</h2>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{group.leaderName}</h3>
                      <p className="text-gray-600">{group.leaderExperience} years of experience</p>
                      <div className="mt-2 flex gap-2">
                        {group.language.map(lang => (
                          <span key={lang} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {group.amenities.map(amenity => (
                      <div key={amenity} className="flex items-center">
                        <i className="fas fa-check text-emerald-600 mr-2"></i>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Day by Day Itinerary</h2>
                <div className="space-y-6">
                  {group.itinerary.map(day => (
                    <div key={day.day} className="flex">
                      <div className="w-16 flex-shrink-0">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-medium">
                          {day.day}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">{day.title}</h3>
                        <p className="text-gray-600">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'inclusions' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Inclusions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {group.inclusions.map(item => (
                      <div key={item} className="flex items-center">
                        <i className="fas fa-check text-emerald-600 mr-2"></i>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Exclusions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {group.exclusions.map(item => (
                      <div key={item} className="flex items-center">
                        <i className="fas fa-times text-red-600 mr-2"></i>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                  <div className="space-y-3">
                    {group.requirements.map(item => (
                      <div key={item} className="flex items-center">
                        <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="text-center mb-4">
                <div className="text-sm text-gray-600">Price per person</div>
                <div className="text-3xl font-bold text-emerald-600">${group.price}</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available spots</span>
                  <span className="font-medium">{group.availableSpots}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Departure from</span>
                  <span className="font-medium">{group.departureLocation}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{group.duration} Days</span>
                </div>
              </div>

              <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                Book Now
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Secure your spot with a deposit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails; 