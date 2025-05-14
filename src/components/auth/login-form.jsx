"use client";

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

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: (user) => {
      if (user.role === "admin") return "/dashboard";
      return "/dashboard2";
    },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shouldRemember, setShouldRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

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

    login({
      email,
      password,
      remember: shouldRemember,
      setErrors,
      setStatus,
    });
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <InputError messages={errors.email} className="mt-2" />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              {/* <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link> */}
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
              className="w-full"
              variant="outline"
              size="sm"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
