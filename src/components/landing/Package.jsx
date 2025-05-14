import BeachImage from "@/public/images/package/Beach.webp";
import MountainImage from "@/public/images/package/Mountain.jpg";
import CityImage from "@/public/images/package/City.jpg";
import Image from "next/image";

function Package() {
  const travelPackages = [
    {
      name: "Beach Getaway",
      description:
        "A relaxing beach vacation package with luxury accommodations, beach activities, and more.",
      price: "From Rp 2.499.000",
      image: BeachImage,
    },
    {
      name: "Mountain Adventure",
      description:
        "Explore the great outdoors with our mountain trekking package, including guided hikes and scenic views.",
      price: "From Rp 1.999.000",
      image: MountainImage,
    },
    {
      name: "City Tour",
      description:
        "Discover the best cities in the world with guided tours, local experiences, and more.",
      price: "From Rp 1.299.000",
      image: CityImage,
    },
  ];

  return (
    <section
      id="packages"
      className="h-fit [#95BFC4] bg-[#27445D] scroll-mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <h1 className="text-4xl font-bold text-center text-white mt-8">
          Our Packages
        </h1>
        <p className="text-xl text-center text-slate-300 mt-3 mb-12">
          Choose from a variety of travel packages designed to fit your dream
          destinations and budget.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {travelPackages.map((pkg, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content Container */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {pkg.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#b22660]">
                    {pkg.price}
                  </span>
                  <button className="px-4 py-1.5 bg-[#F0A04B] text-white text-sm rounded-full hover:bg-amber-600 transition duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Package;
