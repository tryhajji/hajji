import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="text-gray-500">{title}</div>
      <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
        <i className={`${icon} text-primary`}></i>
      </div>
    </div>
    <div className="text-2xl font-semibold mb-2">{value}</div>
    {trend && (
      <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
        <i className={`fas fa-arrow-${trend.isPositive ? 'up' : 'down'} mr-1`}></i>
        <span>{trend.value}% from last month</span>
      </div>
    )}
  </div>
);

const AgencyDashboard = () => {
  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Active Bookings',
      value: '156',
      icon: 'fas fa-calendar-check',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Total Revenue',
      value: '$45,678',
      icon: 'fas fa-dollar-sign',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Active Packages',
      value: '12',
      icon: 'fas fa-box',
      trend: { value: 5, isPositive: true }
    },
    {
      title: 'Client Reviews',
      value: '4.8',
      icon: 'fas fa-star',
      trend: { value: 2, isPositive: true }
    }
  ];

  const recentBookings = [
    {
      id: 1,
      package: 'Premium Hajj Package',
      client: 'Ahmed Mohammad',
      date: '2024-05-15',
      status: 'confirmed'
    },
    {
      id: 2,
      package: 'Standard Umrah Package',
      client: 'Sarah Abdullah',
      date: '2024-06-01',
      status: 'pending'
    },
    {
      id: 3,
      package: 'Group Hajj Package',
      client: 'Omar Khan',
      date: '2024-05-20',
      status: 'confirmed'
    }
  ];

  return (
    <DashboardLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Bookings</h2>
            <button className="text-primary hover:text-primary-dark text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{booking.package}</h3>
                  <p className="text-sm text-gray-500">{booking.client}</p>
                  <p className="text-sm text-gray-500">{booking.date}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
              <i className="fas fa-plus text-primary mb-2"></i>
              <h3 className="font-medium">Add Package</h3>
              <p className="text-sm text-gray-500">Create new travel package</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
              <i className="fas fa-calendar-plus text-primary mb-2"></i>
              <h3 className="font-medium">New Booking</h3>
              <p className="text-sm text-gray-500">Create booking for client</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
              <i className="fas fa-users text-primary mb-2"></i>
              <h3 className="font-medium">Manage Clients</h3>
              <p className="text-sm text-gray-500">View and manage clients</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
              <i className="fas fa-chart-bar text-primary mb-2"></i>
              <h3 className="font-medium">Analytics</h3>
              <p className="text-sm text-gray-500">View business insights</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgencyDashboard; 