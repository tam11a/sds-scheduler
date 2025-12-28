"use client";

import * as React from "react";
import {
  Command,
  Frame,
  LayoutDashboard,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
  org: {
    title: "Sydney Disability Support",
    subtitle: "Enterprise CRM",
    logo: null,
  },
  navMain: [
    {
      groupTitle: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Staff",
          url: "/staff",
          icon: Users,
        },
      ],
    },
    {
      groupTitle: "Analytics",
      items: [
        {
          title: "Design Engineering",
          url: "#",
          icon: Frame,
        },
        {
          title: "Sales & Marketing",
          url: "#",
          icon: PieChart,
        },
        {
          title: "Travel",
          url: "#",
          icon: Map,
        },
      ],
    },
  ],

  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                {
                  /* If you have a logo, you can replace this div with an Image component */
                  data.org.logo ? (
                    <Image
                      src={data.org.logo}
                      alt={`${data.org.title} logo`}
                      className="size-8 rounded-lg"
                    />
                  ) : (
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      <Command className="size-4" />
                    </div>
                  )
                }
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-sm">
                    {data.org.title}
                  </span>
                  <span className="truncate text-xs font-semibold text-sidebar-foreground/70">
                    {data.org.subtitle}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {
          /* You can loop over multiple NavMain groups if needed */
          data.navMain.map((group, index) => (
            <NavMain
              key={index}
              groupTitle={group.groupTitle}
              items={group.items}
            />
          ))
        }

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
