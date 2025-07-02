import { LoginForm } from "@/components/auth/login-form";
import { TicketsPlane } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex justify-center gap-2 md:justify-start">
          {/* Logo Tripnesia */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <p className="text-2xl font-bold text-[#205781] flex items-center">
                <TicketsPlane className="pr-1 size-9" />
                Trip
                <span className="text-[#f3bb66]">nesia</span>
              </p>
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm className="gap-4" />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/images/bg-login-page.jpg"
          alt="Login background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute bottom-8 left-6 max-w-sm text-white">
          <blockquote className="space-y-2">
            <p className="text-lg font-semibold italic">
              "Welcome back to your travel journey"
            </p>
            <footer className="text-base">- Travel Agent Tripnesia -</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
