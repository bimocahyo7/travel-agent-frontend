"use client";

import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/admin/nav-main";
import { NavUser } from "@/components/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BookText,
  CalendarCheck2,
  Car,
  Map,
  Star,
  TicketsPlane,
} from "lucide-react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Destination",
      url: "/admin/destination",
      icon: Map,
    },
    {
      title: "Booking Destination",
      url: "/admin/bookingdes",
      icon: Map,
    },
    {
      title: "Vehicle",
      url: "/admin/vehicle",
      icon: Car,
    },
    {
      title: "Package",
      url: "/admin/package",
      icon: IconFolder,
    },
    {
      title: "Booking",
      url: "/admin/booking",
      icon: CalendarCheck2,
    },
    {
      title: "Payment",
      url: "/admin/payment",
      icon: IconChartBar,
    },
    {
      title: "History",
      url: "/admin/transaction",
      icon: BookText,
    },
    {
      title: "Review",
      url: "/admin/review",
      icon: Star,
    },
    {
      title: "Pengajuan",
      url: "/admin/pengajuan",
      icon: IconFileDescription,
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
