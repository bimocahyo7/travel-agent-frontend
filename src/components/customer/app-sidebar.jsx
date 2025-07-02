"use client";

import {
  IconDashboard,
} from "@tabler/icons-react";

import { NavMain } from "@/components/customer/nav-main";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BookText,
  CalendarCheck2,
  Map,
  TicketsPlane,
  Send,
  FileText,
  ClipboardList,
} from "lucide-react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/pesanan-saya",
      icon: IconDashboard,
    },
    {
      title: "Booking",
      icon: BookText,
      children: [
        {
          title: "Booking Destination",
          url: "/pesanan-saya/booking-destination",
          icon: Map,
        },
        {
          title: "Booking Package",
          url: "/pesanan-saya/booking-package",
          icon: CalendarCheck2,
        },
      ],
    },
    {
      title: "Pengajuan",
      url: "/pesanan-saya/pengajuan",
      icon: ClipboardList,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <p className="text-xl font-bold text-[#205781] flex items-center">
                  <TicketsPlane className="pr-1 size-8" />
                  Trip
                  <span className="text-[#f3bb66]">nesia</span>
                </p>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
      <div className="mt-auto p-4">
        <Link
          href="/dashboard"
          className="block w-full text-center px-4 py-2 bg-cyan-800 text-white rounded hover:bg-cyan-700 transition"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>
      </SidebarFooter>
    </Sidebar>
  );
}
export default AppSidebar;