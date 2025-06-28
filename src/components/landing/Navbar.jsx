"use client";

import Link from "next/link";
import {
  Menu,
  X,
  TicketsPlane,
  TicketIcon,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileModal from "@/components/auth/ProfileModal";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/auth";

function Navbar() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigateLogin = () => {
    router.push("/login");
  };

  const handleNavigateRegister = () => {
    router.push("/register");
  };

  return (
    <nav className="fixed w-full bg-[#EEF7FF] backdrop-blur-md border-b border-slate-300 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <p className="text-2xl font-bold text-[#205781] flex items-center">
                <TicketsPlane className="pr-1 size-9" />
                Trip
                <span className="text-[#f3bb66]">nesia</span>
              </p>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* <Link
              href="/#destinations"
              className="text-gray-600 hover:text-primary"
            >
              Destinations
            </Link>
            <Link
              href="/#packages"
              className="text-gray-600 hover:text-primary"
            >
              Packages
            </Link>
            <Link href="/#about" className="text-gray-600 hover:text-primary">
              About Us
            </Link> */}
            {/* <Link href="/#contact" className="text-gray-600 hover:text-primary">
              Contact
            </Link> */}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-cyan-50 via-cyan-100/70 to-cyan-50 border border-cyan-200/60 shadow-sm rounded-3xl px-3 py-1.5">
                      <Avatar className="h-8 w-8 border-2 border-cyan-200/80 shadow-sm">
                        <AvatarImage
                          src={user.profilePhotoUrl}
                          alt={user.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block">
                        <p className="text-sm font-medium bg-gradient-to-r from-cyan-800 to-cyan-600 bg-clip-text text-transparent">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2" align="end">
                    <div className="px-2 py-1.5 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuItem
                      className="flex items-center gap-2 py-2 cursor-pointer"
                      onClick={() => router.push("/pesanan-saya")}
                    >
                      <TicketIcon className="w-4 h-4" />
                      <span>Pesanan Saya</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 py-2 cursor-pointer"
                      onClick={() => setIsProfileModalOpen(true)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 py-2 text-red-600 cursor-pointer"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-red-600">Keluar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleNavigateLogin}
                  className="px-4 py-2 text-base font-medium text-cyan-800 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={handleNavigateRegister}
                  className="px-4 py-2 text-base font-medium text-white bg-cyan-700 hover:bg-cyan-600/90 rounded-full cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4 bg-[#4F959D] rounded-sm">
            <button
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className="p-2 rounded-full"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 w-full md:hidden">
            <div className="bg-white shadow-lg">
              <div className="divide-y divide-gray-100">
                <div className="py-3">
                  <Link
                    href="/#destinations"
                    className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-100"
                  >
                    Destinations
                  </Link>
                  <Link
                    href="/#packages"
                    className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-100"
                  >
                    Packages
                  </Link>
                  <Link
                    href="/#about"
                    className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-100"
                  >
                    About Us
                  </Link>
                  {/* <Link
                    href="/#contact"
                    className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-100">
                    Contact
                  </Link> */}
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  {user ? (
                    <DropdownProfile user={user} />
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="px-4 py-2 text-sm font-medium text-cyan-800 hover:text-cyan-600"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="px-4 py-2 text-sm font-medium text-white bg-cyan-700 hover:bg-cyan-600/90 rounded-full"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </nav>
  );
}

export default Navbar;
