"use client";

import AppSidebar from "@/components/customer/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/customer/site-header";
import { useAuth } from "@/hooks/auth";
import RoleGuard from "@/components/auth/RoleGuard";


export default function PesananSayaLayout({ children }) {
    const { user, isLoading } = useAuth({ middleware: "auth" });

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="min-h-screen flex">
            <RoleGuard allowedRoles={["customer"]}>
                <SidebarProvider
                    style={{
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    }}
                >
                    <AppSidebar variant="inset" />
                    <SidebarInset>
                        <SiteHeader user={user} />
                        <main className="flex-1 bg-gray-50 p-6">{children}</main>
                    </SidebarInset>
                </SidebarProvider>
            </RoleGuard>
        </div>
    );
}