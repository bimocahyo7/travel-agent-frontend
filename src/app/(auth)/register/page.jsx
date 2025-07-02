import { GalleryVerticalEnd } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="grid h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex justify-center gap-2 md:justify-start">
          {/* <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Travel Agent
          </a> */}
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <RegisterForm className="gap-4" />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/images/bg-register-page.jpg"
          alt="Register background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute bottom-8 left-6 max-w-sm text-white">
          <blockquote className="space-y-2">
            <p className="text-lg font-semibold italic">
              "Discover the world with us - Your journey begins here."
            </p>
            <footer className="text-base">- Travel Agent Tripnesia -</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
