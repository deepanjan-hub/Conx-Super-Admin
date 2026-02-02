import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              {title && (
                <div>
                  <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                  {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search clients, analytics..."
                  className="w-[280px] pl-9 bg-secondary/50 border-0 focus-visible:ring-1"
                />
              </div>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  3
                </Badge>
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-6 bg-background">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}