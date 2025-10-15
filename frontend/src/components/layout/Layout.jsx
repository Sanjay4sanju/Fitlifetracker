import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    console.log('Toggle menu clicked, current state:', isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    console.log('Closing mobile menu');
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Overlay - This dims the background */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar - This should slide in */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden z-50 border-4 border-green-500 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ zIndex: 9999 }}
      >
        <Sidebar onMobileClose={closeMobileMenu} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={toggleMobileMenu} />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Debug Panel - Remove in production */}
      {isMobileMenuOpen && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded-lg z-[10000] text-sm font-mono">
          <div>DEBUG INFO:</div>
          <div>Menu Open: {isMobileMenuOpen.toString()}</div>
          <div>Sidebar should be visible</div>
          <div>Look for green border on left</div>
        </div>
      )}
    </div>
  );
};

export default Layout;