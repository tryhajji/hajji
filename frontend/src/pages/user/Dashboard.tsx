import { FC } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card } from '../../components';
import { Link } from 'react-router-dom';

const UserDashboard: FC = () => {
  // Mock data - replace with actual API calls
  const upcomingBookings = [
    {
      id: 1,
      package: 'Premium Hajj Package',
      date: '2024-05-15',
      status: 'confirmed'
    }
  ];

  const savedPackages = [
    {
      id: 1,
      name: 'Standard Umrah Package',
      agency: 'Al-Safar Travel',
      price: '$2,999'
    }
  ];

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Welcome Card */}
        <div className="md:col-span-2">
          <Card title="Welcome to Hajji">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h3 className="text-lg font-medium text-emerald-800 mb-2">
                Start Your Sacred Journey
              </h3>
              <p className="text-emerald-600">
                Browse our curated packages for Hajj and Umrah, or connect with experienced group leaders 
                to make your pilgrimage meaningful and hassle-free.
              </p>
            </div>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2">
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/packages" className="p-4 border rounded-lg hover:bg-emerald-50 text-left">
                <i className="fas fa-search text-emerald-600 mb-2"></i>
                <h3 className="font-medium">Browse Packages</h3>
                <p className="text-sm text-gray-500">Find your ideal package</p>
              </Link>
              <Link to="/groups" className="p-4 border rounded-lg hover:bg-emerald-50 text-left">
                <i className="fas fa-users text-emerald-600 mb-2"></i>
                <h3 className="font-medium">Join Group</h3>
                <p className="text-sm text-gray-500">Travel with others</p>
              </Link>
              <Link to="/profile" className="p-4 border rounded-lg hover:bg-emerald-50 text-left">
                <i className="fas fa-calendar text-emerald-600 mb-2"></i>
                <h3 className="font-medium">My Bookings</h3>
                <p className="text-sm text-gray-500">View your trips</p>
              </Link>
              <Link to="/guides" className="p-4 border rounded-lg hover:bg-emerald-50 text-left">
                <i className="fas fa-book text-emerald-600 mb-2"></i>
                <h3 className="font-medium">Resources</h3>
                <p className="text-sm text-gray-500">Learn more</p>
              </Link>
            </div>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <Card title="Your Upcoming Trips">
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium">{booking.package}</h3>
                  <p className="text-sm text-gray-500">Date: {booking.date}</p>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800 mt-2">
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-calendar-alt text-4xl mb-2"></i>
              <p>No upcoming trips</p>
              <Link to="/packages" className="text-emerald-600 hover:text-emerald-700 mt-2">
                Browse Packages
              </Link>
            </div>
          )}
        </Card>

        {/* Saved Packages */}
        <Card title="Saved Packages">
          {savedPackages.length > 0 ? (
            <div className="space-y-4">
              {savedPackages.map((pkg) => (
                <div key={pkg.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium">{pkg.name}</h3>
                  <p className="text-sm text-gray-500">{pkg.agency}</p>
                  <p className="text-emerald-600 font-medium mt-2">{pkg.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-heart text-4xl mb-2"></i>
              <p>No saved packages</p>
              <Link to="/packages" className="text-emerald-600 hover:text-emerald-700 mt-2">
                Discover Packages
              </Link>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard; 