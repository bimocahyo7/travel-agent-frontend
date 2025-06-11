"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
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
    } finally {
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
    <form
      onSubmit={submitForm}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold">Welcome to Tripnesia</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Access your personalized travel experience
        </p>
      </div>

      <div className="grid gap-4 mt-5">
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

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                required
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
        </div>

        <Button
          type="submit"
          className="w-full bg-[#155E95] cursor-pointer"
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

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="underline underline-offset-4 hover:text-primary font-semibold"
          >
            Register
          </Link>
        </div>
      </div>
    </form>
  );
}
