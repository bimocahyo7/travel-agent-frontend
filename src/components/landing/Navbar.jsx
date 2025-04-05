"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed w-full bg-[#EEF7FF] backdrop-blur-md border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <p className="text-2xl font-bold text-[#205781]">
                Trip
                <span className="text-[#f3bb66]">nesia</span>
              </p>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#destinations" className="text-gray-600 hover:text-primary">
              Destinations
            </Link>
            <Link href="/#packages" className="text-gray-600 hover:text-primary">
              Packages
            </Link>
            <Link href="/#about" className="text-gray-600 hover:text-primary">
              About Us
            </Link>
            <Link href="/#contact" className="text-gray-600 hover:text-primary">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* <button className="px-4 py-2 text-sm font-medium text-cyan-800 hover:text-primary">Sign In</button> */}
            <button className="px-4 py-2 text-sm font-medium text-white bg-cyan-700 hover:bg-cyan-600/90 rounded-full">
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={toggleMenu} className="p-2 rounded-full">
              {isMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <Link
                href="/#destinations"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">
                Destinations
              </Link>
              <Link
                href="/#packages"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">
                Packages
              </Link>
              <Link
                href="/#about"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">
                About Us
              </Link>
              <Link
                href="/#contact"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">
                Contact
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full px-3 py-2 mt-2 text-base font-medium text-white bg-cyan-700 hover:bg-cyan-600/90 rounded-md">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
