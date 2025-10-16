import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, User, Menu, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);

  const profileRef = useRef(null);
  const navRef = useRef(null);

  // Detect mobile screen width
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsNavDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Dashboard', path: '/' },
    { label: 'Nutrition', path: '/nutrition' },
    { label: 'Workouts', path: '/workouts' },
    { label: 'Progress', path: '/progress' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 relative z-50">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {/* Menu icon (mobile sidebar toggle) */}
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              <Menu size={22} />
            </button>
          )}

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">FitLifeTracker</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* 🔽 Navigation Dropdown (Visible both mobile & desktop) */}
          <div className="relative" ref={navRef}>
            <button
              onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
              className="flex items-center space-x-1 px-3 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium rounded-md transition"
            >
              <span>Navigate</span>
              <ChevronDown size={16} />
            </button>

            {isNavDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 animate-slide-down z-50">
                <nav className="flex flex-col p-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsNavDropdownOpen(false)}
                      className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition text-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Notification icon */}
          <button className="relative p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell size={20} />
          </button>

          {/* Profile button */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="hidden sm:block text-right">
                <p className="font-medium text-gray-900 text-sm">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.fitnessGoal || 'User'}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </button>

            {/* Profile dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 sm:w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
