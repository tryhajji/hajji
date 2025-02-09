import React from 'react';

type StatusType = 'active' | 'pending' | 'confirmed' | 'preparing' | 'recruiting' | 'completed' | 'cancelled';

interface StatusBadgeProps {
  status: StatusType;
}

const getStatusStyles = (status: StatusType): string => {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-emerald-100 text-emerald-800';
    case 'preparing':
      return 'bg-blue-100 text-blue-800';
    case 'recruiting':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(status)}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </div>
);

export default StatusBadge; 