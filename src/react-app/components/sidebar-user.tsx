import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarMenu, SidebarMenuItem, } from "@/components/ui/sidebar"
import { User } from "lucide-react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
  }
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
<div className="flex gap-2 p-4">
            <Avatar>
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
</div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}