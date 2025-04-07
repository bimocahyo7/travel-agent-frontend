import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#ffffff] border-t">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center">
              <p className="text-2xl font-bold text-[#205781] flex items-center">
                Trip
                <span className="text-[#f3bb66]">nesia</span>
              </p>
            </Link>
            <p className="mt-4 text-gray-600">
              Discover your next adventure with Tripnesia. Your trusted travel companion.
            </p>
            {/* Social Media */}
            <div className="flex space-x-4 mt-4">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram page"
                className="text-gray-600 hover:text-primary">
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
                className="text-gray-600 hover:text-primary">
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Twitter page"
                className="text-gray-600 hover:text-primary">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-4">Quick Links</h2>
            <div className="flex flex-col space-y-2">
              <Link
                href="/#destinations"
                className="text-gray-600 hover:text-primary hover:underline inline-block w-fit">
                Destinations
              </Link>
              <Link href="/#packages" className="text-gray-600 hover:text-primary hover:underline inline-block w-fit">
                Packages
              </Link>
              <Link href="/#about" className="text-gray-600 hover:text-primary hover:underline inline-block w-fit">
                About Us
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-4">Contact</h2>
            <div className="flex flex-col space-y-2">
              <p className="text-gray-600 flex gap-2">
                <Mail />
                info@tripnesia.com
              </p>
              <p className="text-gray-600 flex gap-2">
                <Phone />
                +62 123 456 789
              </p>
            </div>
          </div>
        </div>

        <div className="border-t mt-6 pt-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Tripnesia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
