import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DollarSign } from "lucide-react"

export function Invoices() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Invoices</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem key="open">
          <SidebarMenuButton render={<a href="/open-invoices" />}>
            <DollarSign />
            <span>Open Invoices</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem key="all">
          <SidebarMenuButton render={<a href="/all-invoices" />}>
            <DollarSign />
            <span>All Invoices</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}