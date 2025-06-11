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
import { usePathname } from "next/navigation"; // atau react-router-dom: useLocation
import React from "react";

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
      title: "Menu Destinasi",
      icon: Map,
      children: [
        { title: "Data Destinasi", url: "/admin/destination" },
        { title: "Booking", url: "/admin/bookingdes" },
        { title: "Payment", url: "/admin/destination/payment" },
      ],
    },
    {
      title: "Menu Package",
      icon: IconFolder,
      children: [
        { title: "Data Package", url: "/admin/package" },
        { title: "Booking", url: "/admin/package/booking" },
        { title: "Payment", url: "/admin/package/payment" },
      ],
    },
    {
      title: "Menu Pengajuan",
      icon: IconFileDescription,
      children: [
        { title: "Pengajuan", url: "/admin/pengajuan" },
        { title: "Invoice", url: "/admin/pengajuan/invoice" },
        { title: "Payment", url: "/admin/pengajuan/paymentsub" },
      ],
    },
    {
      title: "Vehicle",
      url: "/admin/vehicle",
      icon: Car,
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
  ],
};

function SidebarMenuRecursive({ items, pathname }) {
  const [openMenus, setOpenMenus] = React.useState(() =>
    items
      .map((item, idx) =>
        item.children && item.children.some((c) => pathname.startsWith(c.url))
          ? idx
          : null,
      )
      .filter((v) => v !== null),
  );

  const toggleMenu = (idx) => {
    setOpenMenus((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  return (
    <SidebarMenu>
      {items.map((item, idx) =>
        item.children ? (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <div
                onClick={() => toggleMenu(idx)}
                className={`flex items-center gap-2 font-semibold cursor-pointer select-none ${
                  item.children.some((c) => pathname.startsWith(c.url))
                    ? "bg-slate-100 text-blue-700"
                    : ""
                }`}
              >
                {item.icon && <item.icon className="size-5" />}
                {item.title}
                <span className="ml-auto">
                  {openMenus.includes(idx) ? "▼" : "►"}
                </span>
              </div>
            </SidebarMenuButton>
            {openMenus.includes(idx) && (
              <SidebarMenu className="ml-4">
                {item.children.map((child) => (
                  <SidebarMenuItem key={child.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={child.url}
                        className={`flex items-center gap-2 pl-6 py-1 rounded ${
                          pathname.startsWith(child.url)
                            ? "bg-blue-100 text-blue-700 font-bold"
                            : ""
                        }`}
                      >
                        {child.title}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarMenuItem>
        ) : (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <a
                href={item.url}
                className={`flex items-center gap-2 ${
                  pathname.startsWith(item.url)
                    ? "bg-blue-100 text-blue-700 font-bold"
                    : ""
                }`}
              >
                {item.icon && <item.icon className="size-5" />}
                {item.title}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ),
      )}
    </SidebarMenu>
  );
}

export function AppSidebar({ ...props }) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  // Jika pakai next/navigation: const pathname = usePathname();

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
        <SidebarMenuRecursive items={data.navMain} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
