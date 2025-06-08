"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Tambahkan import router
import { useDestination } from "@/hooks/destination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Destination() {
  const router = useRouter(); // Inisialisasi router
  const { destinations, loading } = useDestination();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoreDetail = (dest) => {
    setSelectedDestination(dest);
    setIsModalOpen(true);
  };

  const handleOrderNow = (destinationId) => {
    if (destinationId) {
      localStorage.setItem("selectedDestinationId", destinationId);
      router.push("/login");
    }
  };

  const filteredDestinations = destinations?.filter((dest) =>
    `${dest.name} ${dest.location} ${dest.description}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || [];

  const visibleDestinations = showAll
    ? filteredDestinations
    : filteredDestinations.slice(0, 3);

  return (
    <section id="destinations" className="h-fit bg-[#F6F8D5] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <h1 className="text-4xl font-bold text-center text-[#2A4D50] mt-8">
          Popular Destinations
        </h1>
        <p className="text-xl text-center text-slate-700 mt-3 mb-6">
          Explore the beauty of Indonesia
        </p>

        <div className="flex justify-center mb-10">
          <Input
            type="text"
            className="w-full max-w-md"
            placeholder="Cari destinasi berdasarkan nama, lokasi, atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-[#2A4D50] text-center">Memuat data...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleDestinations.length === 0 ? (
                <p className="text-[#2A4D50] col-span-3 text-center">
                  Destinasi tidak ditemukan.
                </p>
              ) : (
                visibleDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="relative bg-white rounded-xl shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {dest.image ? (
                        <img
                          src={dest.image_url || `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/images/${dest.image}`}
                          alt={dest.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/default.jpg";
                          }}
                        />
                      ) : (
                        <img
                          src="/images/default.jpg"
                          alt="default"
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {dest.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {dest.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#b22660]">
                          Rp {dest.price?.toLocaleString("id-ID") || "Harga Custom"}
                        </span>
                        <Button
                          className="bg-[#F0A04B] hover:bg-amber-600 text-white text-sm rounded-full"
                          onClick={() => handleOrderNow(dest.id)}
                        >
                          Book Now
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-sm text-[#27445D] underline"
                          onClick={() => handleMoreDetail(dest)}
                        >
                          More
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredDestinations.length > 3 && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="outline"
                  className="text-black border-black hover:bg-black hover:text-white transition"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show Less" : "More Destinations"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && selectedDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedDestination.name}</h2>
            {selectedDestination.image ? (
              <img
                src={
                  selectedDestination.image_url ||
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/images/${selectedDestination.image}`
                }
                alt={selectedDestination.name}
                className="w-full h-48 object-cover rounded mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/default.jpg";
                }}
              />
            ) : (
              <img
                src="/images/default.jpg"
                alt="default"
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}

            <p className="mb-2"><strong>Location:</strong> {selectedDestination.location}</p>
            <p className="mb-2">
              <strong>Price:</strong> {
                selectedDestination.price
                  ? `Rp ${selectedDestination.price.toLocaleString("id-ID")}`
                  : "Harga dapat disesuaikan"
              }
            </p>
            <p className="mb-2"><strong>Description:</strong> {selectedDestination.description}</p>
          </div>
        </div>
      )}
    </section>
  );
}