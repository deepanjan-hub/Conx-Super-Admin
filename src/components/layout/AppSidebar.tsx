import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Shield,
  Sliders,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import conxLogomark from "@/assets/conx-logomark.png";
import conxLogoDark from "@/assets/conx-logo-dark.jpg";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "AI Engine Fallback", url: "/ai-fallback", icon: RefreshCw },
  { title: "Billing", url: "/billing", icon: CreditCard },
  { title: "Platform Config", url: "/config", icon: Sliders },
  { title: "Security", url: "/security", icon: Shield },
];

const bottomNavItems = [
  { title: "Help Center", url: "/help", icon: HelpCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, signOut, userRole } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/auth');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'SA';
  };

  // Get display name
  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return 'Super Admin';
  };

  // Get role display
  const getRoleDisplay = () => {
    if (userRole) {
      return userRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'User';
  };

  return (
    <Sidebar
      className={cn(
        "border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
            <img 
              src={conxLogomark} 
              alt="CONX Logo" 
              className="h-9 w-9 object-contain"
            />
            {!collapsed && (
              <img 
                src={conxLogoDark} 
                alt="CONX" 
                className="h-6 object-contain"
              />
            )}
          </div>
          {!collapsed && (
            <button
              onClick={toggleSidebar}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={toggleSidebar}
            className="mt-2 flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent transition-colors mx-auto"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </SidebarHeader>
      <Separator className="mx-4 w-auto" />

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive(item.url) && "bg-sidebar-accent text-sidebar-primary"
                      )}
                      activeClassName="bg-sidebar-accent text-sidebar-primary"
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0", isActive(item.url) && "text-sidebar-primary")} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto px-3 pb-4">
        <Separator className="mb-4" />
        <SidebarMenu className="space-y-1">
          {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                tooltip={collapsed ? item.title : undefined}
              >
                <NavLink
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive(item.url) && "bg-sidebar-accent text-sidebar-primary"
                  )}
                  activeClassName="bg-sidebar-accent text-sidebar-primary"
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <Separator className="my-4" />

        <div className={cn("flex items-center gap-3 px-3 py-2", collapsed && "justify-center")}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={getDisplayName()} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="text-sm font-medium text-foreground truncate">{getDisplayName()}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
            </div>
          )}
          {!collapsed && (
            <button 
              onClick={handleLogout}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
        {collapsed && (
          <button 
            onClick={handleLogout}
            className="mt-2 flex h-7 w-7 items-center justify-center rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors mx-auto"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
