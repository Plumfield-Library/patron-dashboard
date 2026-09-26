"use client"

import * as React from "react"

import {Branches} from "@/components/sidebar-branches.tsx"
import {NavUser} from "@/components/sidebar-user.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import {Calendar, LogOut} from "lucide-react"
import {logout, useAuth} from "@/context/AuthContext.tsx"
import {Classes} from "@/components/sidebar-classes.tsx"
import {Invoices} from "@/components/sidebar-invoices.tsx"

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const data = {
    user: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
    branches: [
      {
        name: "Main Appointment",
        url: "/appointments",
        icon: <Calendar />,
      },
      {
        name: "Shire Appointment",
        url: "mailto:shirebranch@gmail.com", //TODO replace with phone if needed
        icon: <Calendar />,
      },
    ]
  }
  return (
    <Sidebar collapsible="offcanvas" {...props} variant="inset">
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <Branches items={data.branches} />
        <Classes />
        <Invoices />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton onClick={()=>logout()}><LogOut/>Logout</SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}