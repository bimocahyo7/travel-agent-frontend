"use client";

import { useState } from "react";

import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item, idx) => (
            <SidebarMenuItem key={idx}>
              {item.children ? (
                <>
                  <SidebarMenuButton onClick={() => handleToggle(idx)}>
                    {item.icon && <item.icon className="mr-3" />}
                    {item.title}
                    <span className="ml-auto">
                      {openIndex === idx ? "▲" : "▼"}
                    </span>
                  </SidebarMenuButton>
                  {openIndex === idx && (
                    <SidebarMenu className="ml-4">
                      {item.children.map((child, cidx) => (
                        <SidebarMenuItem key={cidx}>
                          <SidebarMenuButton asChild>
                            <Link href={child.url}>
                              {child.icon && <child.icon className="mr-3" />}
                              {child.title}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  )}
                </>
              ) : (
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    {item.icon && <item.icon className="mr-3" />}
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
