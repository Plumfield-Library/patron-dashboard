import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Form, GraduationCap } from "lucide-react";
import { FilloutPopupEmbed } from "@fillout/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Classes() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Classes</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem key="classes">
            <SidebarMenuButton onClick={() => nav("/my-classes")}>
              <GraduationCap />
              <span>My Classes</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => nav("/register")}>
              <Form />
              Register
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <FilloutPopupEmbed
        filloutId="5ctZJVHKLAus"
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
