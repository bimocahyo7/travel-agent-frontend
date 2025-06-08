"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { usePackages } from "@/hooks/package";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Package() {
  const router = useRouter();
  const { packages, loading } = usePackages();
  const [searchTerm, setSearchTerm] = useState("");
  // const [visibleCount, setVisibleCount] = useState(3);
  const [showAll, setShowAll] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoreDetail = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleOrderNow = (packageId) => {
    if (packageId) {
      localStorage.setItem("selectedPackageId", packageId);
      router.push("/login");
    }
  };

  const filteredPackages = packages?.filter((pkg) =>
    `${pkg.name} ${pkg.description}`.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []; // ← tambahkan fallback array kosong jika undefined

  const visiblePackages = showAll
    ? filteredPackages
    : filteredPackages.slice(0, 3);


  // // Potong hasil yang ditampilkan berdasarkan visibleCount
  // const displayedPackages = filteredPackages?.slice(0, visibleCount);

  // const handleLoadMore = () => {
  //   setVisibleCount(filteredPackages.length);
  // };

  return (
    <section
      id="packages"
      className="h-fit [#95BFC4] bg-[#27445D] scroll-mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <h1 className="text-4xl font-bold text-center text-white mt-8">
          Our Packages
        </h1>
        <p className="text-xl text-center text-slate-300 mt-3 mb-6">
          Choose from a variety of travel packages designed to fit your dream
          destinations and budget.
        </p>

        <div className="flex justify-center mb-10">
          <Input
            type="text"
            className="w-full max-w-md"
            placeholder="Cari berdasarkan nama atau deskripsi paket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-white text-center">Memuat data...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiblePackages?.length === 0 ? (
                <p className="text-white col-span-3 text-center">
                  Paket tidak ditemukan.
                </p>
              ) : (
                visiblePackages?.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="relative bg-white rounded-xl shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={
                          pkg.image
                            ? `http://localhost:8000/storage/images/${pkg.image}`
                            : "/images/default.jpg"
                        }
                        alt={pkg.name}
                        width={500}
                        height={300}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {pkg.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {pkg.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#b22660]">
                          Rp {pkg.price.toLocaleString("id-ID")}
                        </span>
                        <Button
                          className="bg-[#F0A04B] hover:bg-amber-600 text-white text-sm rounded-full"
                          onClick={() => handleOrderNow(pkg.id)}
                        >
                          Book Now
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-sm text-[#27445D] underline"
                          onClick={() => handleMoreDetail(pkg)}
                        >
                          More
                        </Button>

                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {filteredPackages.length > 3 && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="outline"
                  className="text-Black border-white hover:bg-white hover:text-[#27445D] transition"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show Less" : "More Packages"}
                </Button>
              </div>
            )}

          </>
        )}
      </div>
      {isModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedPackage.name}</h2>
            {selectedPackage.destination?.image ? (
              <img
                src={
                  selectedPackage.destination.image_url ||
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/images/${selectedPackage.destination?.image}`
                }
                alt={selectedPackage.name}
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
            <p className="mb-2"><strong>Destination:</strong> {selectedPackage.destination?.name || "N/A"}</p>
            <p className="mb-2"><strong>Location:</strong> {selectedPackage.destination?.location || "N/A"}</p>
            <p className="mb-2"><strong>Duration:</strong> {selectedPackage.duration}</p>
            <p className="mb-2"><strong>Price:</strong> Rp {selectedPackage.price.toLocaleString("id-ID")}</p>
            <p className="mb-2"><strong>Description:</strong> {selectedPackage.description}</p>
          </div>
        </div>
      )}

    </section>
  );
}
