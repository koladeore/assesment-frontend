import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 text-xl font-semibold">
            <Link to="/">AlumUnite</Link>
          </div>

          {/* Hamburger/Cross Icon for Mobile */}
          <div className="lg:hidden mt-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                // Cancel (close) icon
                <span className="block w-6 h-6 bg-transparent relative">
                  <span className="absolute block w-6 h-0.5 bg-white rotate-45 top-2.5"></span>
                  <span className="absolute block w-6 h-0.5 bg-white -rotate-45 top-2.5"></span>
                </span>
              ) : (
                // Hamburger icon
                <span className="block w-6 h-6 bg-transparent relative">
                  <span className="block w-6 h-0.5 bg-white mb-1"></span>
                  <span className="block w-6 h-0.5 bg-white mb-1"></span>
                  <span className="block w-6 h-0.5 bg-white mb-1"></span>
                  <span className="block w-6 h-0.5 bg-white"></span>
                </span>
              )}
            </button>
          </div>

          {/* Desktop Navbar Links */}
          <div className="hidden lg:flex space-x-6">
            <Link to="/" className="hover:text-gray-200 transition-colors">
              Home
            </Link>
            <Link
              to="/add-user"
              className="hover:text-gray-200 transition-colors"
            >
              Add User
            </Link>
            <Link
              to="/manage-user"
              className="hover:text-gray-200 transition-colors"
            >
              Manage User
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navbar Links */}
      <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 py-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
          >
            Home
          </Link>
          <Link
            to="/add-user"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
          >
            Add User
          </Link>
          <Link
            to="/manage-user"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
          >
            Manage User
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
