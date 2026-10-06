import { FilloutSliderEmbed } from "@fillout/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { List, ShoppingCartPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext.tsx";

export function SidebarIll() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const nav = useNavigate();
  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Interlibrary Loan</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem key="classes">
            <SidebarMenuButton onClick={() => nav("/interlibrary-loan")}>
              <List />
              <span>My Loan Requests</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setOpen(true)}>
              <ShoppingCartPlus />
              Request a Book
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <FilloutSliderEmbed
        isOpen={open}
        onClose={() => setOpen(false)}
        filloutId={"ugpB1EGK5Bus"}
        parameters={{ email: user?.email, name: user?.name }}
      />
    </>
  );
}
