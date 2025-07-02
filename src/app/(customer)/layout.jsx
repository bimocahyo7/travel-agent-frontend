"use client";

import { useAuth } from "@/hooks/auth";
import Loading from "@/components/common/Loading";
import RoleGuard from "@/components/auth/RoleGuard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const CustomerLayout = ({ children }) => {
  const { user, error } = useAuth({ middleware: "auth" });
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (error) {
      router.push("/login");
    }
  }, [error, router]);

  if (!user && !error) {
    return <Loading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RoleGuard allowedRoles={["customer"]}>
        <div className="min-h-screen flex bg-gray-100">
          <Toaster position="top-right" reverseOrder={false} />
          <main className="flex-1">{children}</main>
        </div>
      </RoleGuard>
    </QueryClientProvider>
  );
};

export default CustomerLayout;
