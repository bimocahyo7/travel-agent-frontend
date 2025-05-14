"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/auth";
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
import InputError from "@/components/ui/InputError";
import Link from "next/link";

export function RegisterForm({ className, ...props }) {
  const { register } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: (user) => {
      // Kalau belum verif email, arahkan ke halaman verif
      if (!user.email_verified_at) return "/verify-email";
      return user.role === "admin" ? "/dashboard" : "/dashboard2";
    },
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});

  const submitForm = async (event) => {
    event.preventDefault();

    register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      setErrors,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Silahkan isi data kamu untuk membuat akun.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitForm} className="flex flex-col gap-6">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
              <InputError messages={errors.name} className="mt-2" />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <InputError messages={errors.email} className="mt-2" />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <InputError messages={errors.password} className="mt-2" />
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2">
              <Label htmlFor="passwordConfirmation">Confirm Password</Label>
              <Input
                id="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
              <InputError
                messages={errors.password_confirmation}
                className="mt-2"
              />
            </div>

            {/* Submit & Link */}
            <div className="flex items-center justify-between">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:underline"
              >
                Sudah punya akun?
              </Link>
              <Button type="submit" className="w-fit">
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
