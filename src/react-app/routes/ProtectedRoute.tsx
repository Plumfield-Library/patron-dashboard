// ProtectedRoute.tsx
import {Spinner} from "@/components/ui/spinner"
import {useAuth} from "@/context/AuthContext"
import {Navigate, Outlet} from "react-router-dom"
import {TooltipProvider} from "@/components/ui/tooltip.tsx"
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar.tsx"
import {AppSidebar} from "@/components/app-sidebar.tsx"

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
          <div className="typeset typeset-body p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}