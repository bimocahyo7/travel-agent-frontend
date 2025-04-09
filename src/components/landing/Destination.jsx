import Image from "next/image";
import MalangImage from "../../../public/images/destination/malang.jpg";
import BaliImage from "../../../public/images/destination/bali.jpg";
import YogyaImage from "../../../public/images/destination/yogyakarta.jpg";

function Destination() {
  const cityDestinations = [
    {
      name: "Bali",
      image: BaliImage,
    },
    {
      name: "Yogyakarta",
      image: YogyaImage,
    },
    {
      name: "Malang",
      image: MalangImage,
    },
  ];

  return (
    <section id="destinations" className="min-h-screen pt-1 bg-[#F6F8D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Popular Destinations</h1>
          <p className="mt-2 text-lg text-gray-600">Explore the beauty of Indonesia</p>
        </div>

        <div className="flex flex-wrap gap-6 justify-center">
          {/* Card Destination */}
          {cityDestinations.map((destination, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={destination.image}
                  alt={`${destination.name} destination`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>

              <div className="absolute bottom-0 w-full p-4 text-white">
                <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                <div className="flex items-center space-x-2 transition-opacity duration-300">
                  <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm hover:bg-white/30 transition-colors">
                    Explore More
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

export default Destination;
