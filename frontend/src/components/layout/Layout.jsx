import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="relative flex h-screen bg-gray-50 overflow-x-hidden">
      {/* Sidebar for desktop only */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0 relative z-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="container-responsive">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout; // 👈 VERY IMPORTANT


