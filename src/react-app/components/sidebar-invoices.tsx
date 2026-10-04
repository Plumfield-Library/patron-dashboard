import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Invoices() {
  const nav = useNavigate();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Invoices</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem key="open">
          <SidebarMenuButton onClick={() => nav("/open-invoices")}>
            <DollarSign />
            <span>Open Invoices</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem key="all">
          <SidebarMenuButton onClick={() => nav("/all-invoices")}>
            <DollarSign />
            <span>All Invoices</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
