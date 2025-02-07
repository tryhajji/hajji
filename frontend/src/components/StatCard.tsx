import React from 'react';

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
      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
        <i className={`${icon} text-emerald-600`}></i>
      </div>
    </div>
    <div className="text-2xl font-semibold mb-2">{value}</div>
    {trend && (
      <div className={`flex items-center text-sm ${trend.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
        <i className={`fas fa-arrow-${trend.isPositive ? 'up' : 'down'} mr-1`}></i>
        <span>{trend.value}% from last month</span>
      </div>
    )}
  </div>
);

export default StatCard; 