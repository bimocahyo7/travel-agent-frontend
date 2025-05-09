import { Mail, Phone, MapPin, Star } from "lucide-react";

function AboutUs() {
  return (
    <section id="about" className="bg-[#95BFC4] scroll-mt-12">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        <h1 className="text-4xl font-bold text-left mb-12 text-[#27445D]">About Us</h1>
        <div className="flex flex-col md:flex-row gap-14 items-start">
          <div className="flex-1 space-y-8">
            {/* Profil */}
            <div>
              <p className="text-lg text-justify">
                We are <strong>Tripnesia Travel</strong>, a professional travel agency committed to providing
                exceptional travel experiences. With over 7+ years of expertise, we have assisted thousands of travelers
                in their business trips, vacations, and various journey needs across Indonesia.
              </p>
              <p className="mt-4 text-lg text-justify">
                Supported by a friendly and experienced team, we offer a variety of travel packages, transportation
                services, and top-quality accommodations tailored to your needs.
              </p>
            </div>

            {/* Kontak */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-[#27445D] underline-offset-4 underline decoration-2">
                Contact
              </h3>
              <ul className="space-y-2 text-lg font-medium text-gray-700">
                <li className="flex items-center gap-3 hover:text-[#27445D] transition-colors">
                  <MapPin className="w-6 h-6 text-rose-700 fill-rose-100" strokeWidth={2} />
                  Jl. Tugu, Kec. Klojen, Kota Malang, Jawa Timur 65111
                </li>
                <li className="flex items-center gap-3 hover:text-[#27445D] transition-colors">
                  <Mail className="w-6 h-6 text-cyan-700 fill-cyan-100" strokeWidth={2} />
                  info@tripnesia.com
                </li>
                <li className="flex items-center gap-3 hover:text-[#27445D] transition-colors">
                  <Phone className="w-6 h-6 text-emerald-700 fill-emerald-100" strokeWidth={2} />
                  +62 123 456 789
                </li>
              </ul>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 w-full h-52 md:h-[350px] rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4101.924243567366!2d112.61814760255608!3d-7.972063190078117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62822063dc2fb%3A0x78879446481a4da2!2sMalang%2C%20Malang%20City%2C%20East%20Java!5e1!3m2!1sen!2sid!4v1746733634302!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Stat Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 text-[#27445D]">
          <div className="bg-[#EEF7FF] rounded-lg shadow-md p-4 md:p-6 text-center">
            <h4 className="text-xl md:text-3xl font-bold">10.000+</h4>
            <p className="mt-1 text-base md:text-lg">Happy Customers</p>
          </div>
          <div className="bg-[#27445D] rounded-lg shadow-md p-4 md:p-6 text-center text-white">
            <h4 className="text-xl md:text-3xl font-bold">7+ Years</h4>
            <p className="mt-1 text-base md:text-lg">of Experience</p>
          </div>
          <div className="bg-[#EEF7FF] rounded-lg shadow-md p-4 md:p-6 text-center">
            <h4 className="text-xl md:text-3xl font-bold">50+</h4>
            <p className="mt-1 text-base md:text-lg">Travel Destinations</p>
          </div>
          <div className="bg-[#27445D] rounded-lg shadow-md p-4 md:p-6 text-center flex flex-col items-center">
            <div className="flex items-center gap-1 md:gap-2">
              <h4 className="text-xl md:text-3xl font-bold text-white">4.9</h4>
              <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="mt-1 text-base md:text-lg text-white">Customer Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
