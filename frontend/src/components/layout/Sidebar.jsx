import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Utensils, 
  Dumbbell, 
  TrendingUp, 
  BarChart3,
  Settings,
  User,
  X
} from 'lucide-react';

const Sidebar = ({ onMobileClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/nutrition', icon: Utensils, label: 'Nutrition' },
    { path: '/workouts', icon: Dumbbell, label: 'Workouts' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white w-64">
      {/* Logo and Close Button */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">FitLifeTracker</span>
        </div>
        {onMobileClose && (
          <button 
            onClick={onMobileClose}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors lg:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto bg-white">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3 px-3 py-2 text-gray-600">
          <User size={20} />
          <div>
            <span className="font-medium">Health First</span>
            <div className="text-xs text-gray-500">Track • Improve • Succeed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;