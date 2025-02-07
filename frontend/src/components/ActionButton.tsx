import React from 'react';

interface ActionButtonProps {
  icon: string;
  title: string;
  description: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, title, description, onClick }) => (
  <button 
    onClick={onClick}
    className="p-4 border rounded-lg hover:bg-emerald-50 text-left transition-colors duration-200 group"
  >
    <i className={`${icon} text-emerald-600 mb-2 block transition-transform duration-200 group-hover:scale-110`}></i>
    <h3 className="font-medium text-gray-800">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </button>
);

export default ActionButton; 