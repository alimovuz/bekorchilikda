import React from 'react';
import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';

interface FooterItemProps {
  icon: IconType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  url: string
}

const FooterItem: React.FC<FooterItemProps> = ({ 
  icon: Icon, 
  label, 
  isActive = false, 
  onClick, url 
}) => {
  return (
    <Link to={url}
    onClick={onClick}
      className={`flex flex-col items-center justify-center px-3 py-2 transition-all duration-200 ease-in-out ${
        isActive 
          ? 'text-red-500 scale-105' 
          : 'text-gray-400 hover:text-red-500'
      }`}
    >
      <Icon className={`w-6 h-6 mb-1`} />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

export default FooterItem;