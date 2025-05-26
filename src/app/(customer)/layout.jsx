"use client";

import { useAuth } from "@/hooks/auth";
// import Navigation from "@/app/(customer)/Navigation";
import Loading from "@/app/(customer)/Loading";
import RoleGuard from "@/components/auth/RoleGuard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CustomerLayout = ({ children }) => {
  const { user, error } = useAuth({ middleware: "auth" });
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.push("/login");
    }
  }, [error, router]);

  if (!user && !error) {
    return <Loading />;
  }

  return (
    // <RoleGuard allowedRoles={["customer"]}>
      <div className="min-h-screen flex bg-gray-100">
        <div user={user} />
        <main className="flex-1 p-4">{children}</main>
      </div>
    // </RoleGuard>
  );
};

export default CustomerLayout;
