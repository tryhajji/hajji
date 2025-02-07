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

const UmrahGroupDashboard = () => {
  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Total Members',
      value: '45',
      icon: 'fas fa-users',
      trend: { value: 10, isPositive: true }
    },
    {
      title: 'Active Groups',
      value: '3',
      icon: 'fas fa-user-friends',
      trend: { value: 1, isPositive: true }
    },
    {
      title: 'Upcoming Trips',
      value: '2',
      icon: 'fas fa-plane-departure',
      trend: { value: 0, isPositive: true }
    },
    {
      title: 'Announcements',
      value: '8',
      icon: 'fas fa-bullhorn',
      trend: { value: 3, isPositive: true }
    }
  ];

  const activeGroups = [
    {
      id: 1,
      name: 'Ramadan Umrah 2024',
      members: 20,
      startDate: '2024-03-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Family Umrah Group',
      members: 15,
      startDate: '2024-04-01',
      status: 'preparing'
    },
    {
      id: 3,
      name: 'Youth Umrah Program',
      members: 10,
      startDate: '2024-05-10',
      status: 'recruiting'
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
        {/* Active Groups */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Active Groups</h2>
            <button className="text-primary hover:text-primary-dark text-sm font-medium">
              View All Groups
            </button>
          </div>
          <div className="space-y-4">
            {activeGroups.map((group) => (
              <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.members} members</p>
                  <p className="text-sm text-gray-500">Starts: {group.startDate}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  group.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : group.status === 'preparing'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
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
              <i className="fas fa-plus-circle text-primary mb-2"></i>
              <h3 className="font-medium">Create Group</h3>
              <p className="text-sm text-gray-500">Start a new Umrah group</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
              <i className="fas fa-user-plus text-primary mb-2"></i>
              <h3 className="font-medium">Add Members</h3>
              <p className="text-sm text-gray-500">Add members to groups</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
              <i className="fas fa-bullhorn text-primary mb-2"></i>
              <h3 className="font-medium">Announcement</h3>
              <p className="text-sm text-gray-500">Send group announcement</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
              <i className="fas fa-calendar-alt text-primary mb-2"></i>
              <h3 className="font-medium">Schedule</h3>
              <p className="text-sm text-gray-500">Manage trip schedule</p>
            </button>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Announcements</h2>
            <button className="text-primary hover:text-primary-dark text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Pre-departure Meeting</h3>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <p className="text-gray-600">Important meeting for all Ramadan Umrah 2024 group members on Sunday at 2 PM.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Document Submission Reminder</h3>
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>
              <p className="text-gray-600">Please submit your passport copies and visa forms by the end of this week.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UmrahGroupDashboard; 