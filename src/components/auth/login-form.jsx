"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
import AuthSessionStatus from "@/app/(auth)/AuthSessionStatus";
import InputError from "@/components/ui/InputError";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shouldRemember, setShouldRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validasi inputan
  const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  useEffect(() => {
    const reset = searchParams.get("reset");
    if (reset && errors.length === 0) {
      setStatus(atob(reset));
    } else {
      setStatus(null);
    }
  }, [searchParams, errors]);

  const submitForm = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = {
        email,
        password,
      };

      const validatedData = loginSchema.parse(formData);

      await login({
        email: validatedData.email,
        password: validatedData.password,
        remember: shouldRemember,
        setErrors,
        setStatus,
      });

      setValidationErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setValidationErrors(errors);
      }

      // Loading proses login
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (validationErrors.email) {
      setValidationErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (validationErrors.password) {
      setValidationErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Masukkan email kamu sebelum login ke akunmu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthSessionStatus
            className="mb-4 text-sm text-green-600"
            status={status}
          />
          <form onSubmit={submitForm} className="flex flex-col gap-6">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
                autoFocus
                className={validationErrors.email ? "border-red-500" : ""}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
              <InputError messages={errors.email} className="mt-2" />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="current-password"
                  className={validationErrors.password ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute h-full cursor-pointer right-1 top-1/2 -translate-y-1/2 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </Button>
              </div>
              {validationErrors.password && (
                <p className="text-sm text-red-500">
                  {validationErrors.password}
                </p>
              )}
              <InputError messages={errors.password} className="mt-2" />
            </div>

            {/* Remember Me */}
            {/* <div className="flex items-center space-x-2">
              <input
                id="remember_me"
                type="checkbox"
                checked={shouldRemember}
                onChange={e => setShouldRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="remember_me">Remember me</Label>
            </div> */}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Login"
              )}
            </Button>
            <Link
              href="/register"
              className="text-sm text-muted-foreground hover:underline"
            >
              Belum punya akun?
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
