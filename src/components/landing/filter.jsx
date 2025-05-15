"use client";

import { useState } from "react";
import { Search, MapPin, CalendarDays, Users } from "lucide-react";

function Filter() {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality here
    console.log({ destination, dates, guests });
  };

  return (
    <section className="bg-[#EEF7FF] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#205781] mb-6 text-center">
            Find Your Perfect Trip
          </h2>
          
          <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
            {/* Destination */}
            <div className="relative">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Where are you going?"
                />
              </div>
            </div>
            
            {/* Travel Dates */}
            <div className="relative">
              <label htmlFor="dates" className="block text-sm font-medium text-gray-700 mb-1">
                Travel Dates
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarDays className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="dates"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Select dates"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                />
              </div>
            </div>
            
            {/* Guests */}
            <div className="relative">
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                Guests
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
                >
                  <option value="">Number of guests</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5+">5+ Guests</option>
                </select>
              </div>
            </div>
            
            {/* Search Button */}
            <div className="relative flex items-end">
              <button
                type="submit"
                className="w-full bg-[#F0A04B] hover:bg-amber-600 text-white py-2 px-4 rounded-lg flex items-center justify-center transition duration-300"
              >
                <Search className="h-5 w-5 mr-2" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Filter;
