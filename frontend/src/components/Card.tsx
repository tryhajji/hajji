import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Card: React.FC<CardProps> = ({ title, children, action }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {action && (
        <button 
          onClick={action.onClick}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
    {children}
  </div>
);

export default Card; 