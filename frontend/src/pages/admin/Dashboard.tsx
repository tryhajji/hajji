import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ApprovalQueue from '../../components/ApprovalQueue';

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

const AdminDashboard = () => {
  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Total Users',
      value: '2,547',
      icon: 'fas fa-users',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Active Agencies',
      value: '156',
      icon: 'fas fa-building',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Active Groups',
      value: '89',
      icon: 'fas fa-user-friends',
      trend: { value: 5, isPositive: true }
    },
    {
      title: 'Pending Approvals',
      value: '12',
      icon: 'fas fa-clock',
      trend: { value: 3, isPositive: false }
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'new_agency',
      message: 'New agency registration: Al-Safar Travel',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'new_booking',
      message: 'New Hajj package booking #12345',
      time: '3 hours ago'
    },
    {
      id: 3,
      type: 'verification',
      message: 'Agency verification request from Baraka Tours',
      time: '5 hours ago'
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

      {/* Approval Queue */}
      <div className="mb-8">
        <ApprovalQueue />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mt-1">
                  <i className={`fas fa-${
                    activity.type === 'new_agency' ? 'building' :
                    activity.type === 'new_booking' ? 'calendar-check' :
                    'check-circle'
                  } text-primary text-sm`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <button className="text-primary hover:text-primary-dark">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-center text-primary hover:text-primary-dark text-sm font-medium">
            View All Activities
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left transition duration-150">
              <i className="fas fa-user-plus text-primary mb-2"></i>
              <h3 className="font-medium">Add New User</h3>
              <p className="text-sm text-gray-500">Create new user account</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left transition duration-150">
              <i className="fas fa-building text-primary mb-2"></i>
              <h3 className="font-medium">Verify Agency</h3>
              <p className="text-sm text-gray-500">Review agency applications</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left transition duration-150">
              <i className="fas fa-box text-primary mb-2"></i>
              <h3 className="font-medium">Manage Packages</h3>
              <p className="text-sm text-gray-500">Review and update packages</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left transition duration-150">
              <i className="fas fa-cog text-primary mb-2"></i>
              <h3 className="font-medium">Settings</h3>
              <p className="text-sm text-gray-500">Configure system settings</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard; 