"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/ui/InputError";
import Link from "next/link";

export function RegisterForm({ className, ...props }) {
  const { register } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: (user) => {
      if (!user.email_verified_at) return "/verify-email";
      return user.role === "admin" ? "/admin/dashboard" : "/dashboard";
    },
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const registerSchema = z
    .object({
      name: z
        .string()
        .min(5, "Name must be at least 5 characters")
        .max(75, "Name cannot exceed 75 characters")
        .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
      email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format")
        .max(50, "Email cannot exceed 50 characters"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      passwordConfirmation: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwords don't match",
      path: ["passwordConfirmation"],
    });

  const submitForm = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = { name, email, password, passwordConfirmation };
      const validatedData = registerSchema.parse(formData);

      await register({
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
        password_confirmation: validatedData.passwordConfirmation,
        setErrors,
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
      setIsLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    const setValue = {
      name: setName,
      email: setEmail,
      password: setPassword,
      passwordConfirmation: setPasswordConfirmation,
    }[field];

    setValue(e.target.value);
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form
      onSubmit={submitForm}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold">Create Your Travel Account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your information below to create your account
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={handleInputChange("name")}
            className={validationErrors.name ? "border-red-500" : ""}
            required
            autoFocus
          />
          {validationErrors.name && (
            <p className="text-sm text-red-500">{validationErrors.name}</p>
          )}
          <InputError messages={errors.name} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleInputChange("email")}
            className={validationErrors.email ? "border-red-500" : ""}
            required
          />
          {validationErrors.email && (
            <p className="text-sm text-red-500">{validationErrors.email}</p>
          )}
          <InputError messages={errors.email} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={handleInputChange("password")}
              className={validationErrors.password ? "border-red-500" : ""}
              required
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-2 hover:bg-transparent cursor-pointer"
            >
              {showPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </Button>
          </div>
          {validationErrors.password && (
            <p className="text-sm text-red-500">{validationErrors.password}</p>
          )}
          <InputError messages={errors.password} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="passwordConfirmation">Confirm Password</Label>
          <div className="relative">
            <Input
              id="passwordConfirmation"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={passwordConfirmation}
              onChange={handleInputChange("passwordConfirmation")}
              className={
                validationErrors.passwordConfirmation ? "border-red-500" : ""
              }
              required
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-2 hover:bg-transparent cursor-pointer"
            >
              {showConfirmPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </Button>
          </div>
          {validationErrors.passwordConfirmation && (
            <p className="text-sm text-red-500">
              {validationErrors.passwordConfirmation}
            </p>
          )}
          <InputError messages={errors.password_confirmation} />
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
            "Register"
          )}
        </Button>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    </form>
  );
}
