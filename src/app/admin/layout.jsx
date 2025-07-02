"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/hooks/auth";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import RoleGuard from "@/components/auth/RoleGuard";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  const { user, isLoading } = useAuth({ middleware: "auth" });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RoleGuard allowedRoles={["admin"]}>
        <SidebarProvider
          style={{
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          }}
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader user={user} />
            <div className="flex flex-1 flex-col">{children}</div>
            <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
          </SidebarInset>
        </SidebarProvider>
      </RoleGuard>
    </QueryClientProvider>
  );
}
