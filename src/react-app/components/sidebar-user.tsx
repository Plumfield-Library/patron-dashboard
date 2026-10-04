import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
  };
}) {
  const nav = useNavigate();
  return (
    <SidebarMenu className="cursor-pointer">
      <SidebarMenuItem onClick={() => nav("/")}>
        <div className="flex gap-2 p-4">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white">
            <User className="size-6" />
          </div>

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
