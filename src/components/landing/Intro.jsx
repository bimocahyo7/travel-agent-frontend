import Image from "next/image";
import BackgroundImage from "../../../public/images/background.webp";

function Intro() {
  return (
    <section id="intro" className="min-h-screen relative flex items-center justify-center">
      <Image src={BackgroundImage} alt="Background" fill className="object-cover z-0" priority sizes="100vw" />
      <div className="absolute inset-0 bg-black/40 z-5"></div>
      <div className="relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-6">
          Discover the Wonders of Indonesia
        </h1>
        <p className="text-lg md:text-xl text-white drop-shadow-lg max-w-2xl mb-8">
          Experience unforgettable journeys across Indonesia with personalized travel packages tailored to your
          preferences.
        </p>
        <button className="bg-[#155E95] hover:bg-[#154095] text-white font-bold py-3 px-8 rounded-lg transition duration-300">
          Explore Now
        </button>
      </div>
    </section>
  );
}

export default Intro;
