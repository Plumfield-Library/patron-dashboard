"use client";

import * as React from "react";

import { Branches } from "@/components/sidebar-appointments.tsx";
import { NavUser } from "@/components/sidebar-user.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Calendar, Home, LogOut } from "lucide-react";
import { logout, useAuth } from "@/context/AuthContext.tsx";
import { Classes } from "@/components/sidebar-classes.tsx";
import { Invoices } from "@/components/sidebar-invoices.tsx";
import { SidebarIll } from "@/components/sidebar-ill.tsx";
import { useNavigate } from "react-router-dom";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user, isPending, error } = useAuth();
  const nav = useNavigate();
  if (error) {
    throw new Error("User is not authenticated: " + error.message);
  }
  if (isPending) {
    return <></>;
  }

  const data = {
    user: {
      name: user.name,
      email: user.email,
    },
    branches: [
      {
        name: "Main Appointment",
        url: "/appointments",
        icon: <Calendar />,
      },
      {
        name: "Shire Appointment",
        url: "sms:+19206640805",
        icon: <Calendar />,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props} variant="inset">
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <Branches />
        <Classes />
        <Invoices />
        <SidebarIll />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton onClick={() => nav("/")}>
            <Home />
            <span>Home</span>
          </SidebarMenuButton>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuButton onClick={async () => await logout()}>
            <LogOut />
            Logout
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
