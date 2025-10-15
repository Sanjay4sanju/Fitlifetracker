import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('sidebar-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('sidebar-open');
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.classList.remove('sidebar-open');
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar - Moved BEFORE overlay for proper z-index stacking */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden border-2 border-red-500 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ zIndex: 9999 }} // Debug: Force highest z-index
      >
        <Sidebar onMobileClose={closeMobileMenu} />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
          style={{ zIndex: 9998 }} // Debug: Ensure overlay is below sidebar
        ></div>
      )}

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-w-0 lg:ml-0 transition-all duration-300 ${
        isMobileMenuOpen ? 'lg:ml-0' : ''
      }`}>
        <Header onMenuClick={toggleMobileMenu} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Debug info - remove this in production */}
      {isMobileMenuOpen && (
        <div className="fixed top-0 right-0 bg-yellow-500 text-black p-2 z-[10000] text-xs">
          Debug: Mobile Menu Open - Sidebar z-index: 9999, Overlay z-index: 9998
        </div>
      )}
    </div>
  );
};

export default Layout;