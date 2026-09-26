import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Form, GraduationCap } from "lucide-react"
import { FilloutPopupEmbed } from "@fillout/react"
import { useState } from "react"

export function Classes() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Classes</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem key="classes">
            <SidebarMenuButton render={<a href="/my-classes" />}>
              <GraduationCap />
              <span>My Classes</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setOpen(true)}>
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
  )
}