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
import React from "react";
import Link from "next/link";

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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

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
      url: "#",
      items: [
        { title: "Data Destinasi", url: "/admin/destination" },
        { title: "Booking", url: "/admin/bookingdes" },
        { title: "Payment", url: "/admin/destination/payment" },
      ],
    },
    {
      title: "Menu Package",
      icon: IconFolder,
      url: "#",
      items: [
        { title: "Data Package", url: "/admin/package" },
        { title: "Booking", url: "/admin/package/booking" },
        { title: "Payment", url: "/admin/package/payment" },
      ],
    },
    {
      title: "Menu Pengajuan",
      icon: IconFileDescription,
      url: "#",
      items: [
        { title: "Pengajuan", url: "/admin/pengajuan" },
        { title: "Invoice", url: "/admin/pengajuan/invoice" },
        { title: "Payment Submission", url: "/admin/pengajuan/paymentsub" },
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
  const isItemActive = (item) => {
    if (item.url === pathname) return true;
    if (item.items) {
      return item.items.some((subItem) => subItem.url === pathname);
    }
    return false;
  };

  return (
    <SidebarMenu className="w-full">
      {items.map((item) =>
        item.items ? (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={isItemActive(item)}
            className="group/collapsible w-full"
          >
            <SidebarMenuItem className="w-full">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className={`flex items-center gap-2 w-full px-3 py-2 hover:bg-slate-50 cursor-pointer`}
                >
                  {item.icon && <item.icon className="size-5" />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="w-full">
                <SidebarMenu
                  className="relative w-full border-l-2 border-slate-300"
                  style={{ marginLeft: "1.5rem" }}
                >
                  {item.items.map((subItem) => (
                    <SidebarMenuItem
                      key={subItem.title}
                      className="w-full pr-2"
                    >
                      <SidebarMenuButton asChild className="w-full">
                        <Link
                          href={subItem.url}
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-slate-50 cursor-pointer rounded-sm"
                        >
                          {subItem.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ) : (
          <SidebarMenuItem key={item.title} className="w-full">
            <SidebarMenuButton asChild className="w-full">
              <Link
                href={item.url}
                className={`flex items-center gap-2 w-full px-3 py-2 hover:bg-slate-50 cursor-pointer`}
              >
                {item.icon && <item.icon className="size-5" />}
                {item.title}
              </Link>
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
