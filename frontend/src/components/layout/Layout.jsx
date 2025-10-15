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
    <div className="flex h-screen bg-gray-50 relative">
      {/* Desktop Sidebar - Always visible on large screens */}
      <div className="hidden lg:flex lg:flex-shrink-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile Overlay - Only shows on mobile when menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
          style={{ zIndex: 9998 }}
        />
      )}

      {/* Mobile Sidebar - Only shows on mobile when menu is open */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          zIndex: 9999,
          border: '4px solid red',
          backgroundColor: 'white'
        }}
      >
        <Sidebar onMobileClose={closeMobileMenu} />
      </div>

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col min-w-0 overflow-hidden relative"
        style={{ 
          zIndex: isMobileMenuOpen ? 1 : 2 
        }}
      >
        <Header onMenuClick={toggleMobileMenu} />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Debug Info */}
      {isMobileMenuOpen && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg z-[10000] text-sm">
          <div>DEBUG: Menu is OPEN</div>
          <div>Sidebar z-index: 9999</div>
          <div>Overlay z-index: 9998</div>
          <div>Look for RED border on left</div>
        </div>
      )}
    </div>
  );
};

export default Layout;