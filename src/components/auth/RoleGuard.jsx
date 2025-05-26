"use client";

import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/ui/Loading";

const RoleGuard = ({ children, allowedRoles }) => {
  const { user, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.push("/login");
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      if (user.role === "customer") {
        router.push("/dashboard");
      } else if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [user, error, allowedRoles]);

  // Render nothing while checking auth
  if (!user || error) {
    return null;
  }

  // Only render if user has correct role
  return allowedRoles.includes(user.role) ? children : null;
};

export default RoleGuard;
