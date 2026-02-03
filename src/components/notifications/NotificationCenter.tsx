import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, AlertTriangle, Shield, UserPlus, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STORAGE_KEY = "notification_read_status";
interface Notification {
  id: string;
  type: "sla_breach" | "fraud_alert" | "new_client" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  severity: "info" | "warning" | "critical";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "sla_breach",
    title: "SLA Breach Alert",
    message: "TechFlow Inc exceeded 95% response time threshold",
    time: "2 min ago",
    read: false,
    severity: "critical",
  },
  {
    id: "3",
    type: "fraud_alert",
    title: "Fraud Detection Alert",
    message: "Suspicious activity detected from IP 192.168.1.45",
    time: "32 min ago",
    read: false,
    severity: "critical",
  },
  {
    id: "4",
    type: "new_client",
    title: "New Client Signup",
    message: "RetailMax has completed onboarding",
    time: "1 hour ago",
    read: true,
    severity: "info",
  },
  {
    id: "5",
    type: "system",
    title: "System Health Warning",
    message: "API latency increased to 450ms",
    time: "2 hours ago",
    read: true,
    severity: "warning",
  },
];

const notificationIcons = {
  sla_breach: AlertTriangle,
  fraud_alert: Shield,
  new_client: UserPlus,
  system: Bell,
};

const severityColors = {
  info: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
};

// Route mapping for notification types
const notificationRoutes: Record<Notification["type"], string> = {
  sla_breach: "/security",
  fraud_alert: "/security",
  new_client: "/clients",
  system: "/config",
};

// Load read status from localStorage
const loadReadStatus = (): Record<string, boolean> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save read status to localStorage
const saveReadStatus = (readStatus: Record<string, boolean>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readStatus));
  } catch {
    // Ignore storage errors
  }
};

export function NotificationCenter() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const readStatus = loadReadStatus();
    return mockNotifications.map((n) => ({
      ...n,
      read: readStatus[n.id] !== undefined ? readStatus[n.id] : n.read,
    }));
  });
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Persist read status whenever notifications change
  useEffect(() => {
    const readStatus: Record<string, boolean> = {};
    notifications.forEach((n) => {
      readStatus[n.id] = n.read;
    });
    saveReadStatus(readStatus);
  }, [notifications]);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvents = [
        {
          type: "sla_breach" as const,
          title: "SLA Breach Alert",
          message: "Response time exceeded for GlobalServices",
          severity: "critical" as const,
        },
        {
          type: "fraud_alert" as const,
          title: "Fraud Detection Alert",
          message: "Unusual login pattern detected",
          severity: "critical" as const,
        },
        {
          type: "new_client" as const,
          title: "New Client Signup",
          message: "HealthTech Solutions started trial",
          severity: "info" as const,
        },
      ];

      const shouldNotify = Math.random() > 0.7; // 30% chance every 30 seconds
      if (shouldNotify) {
        const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        const newNotification: Notification = {
          id: Date.now().toString(),
          ...event,
          time: "Just now",
          read: false,
        };

        setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]);

        // Show toast for critical notifications
        if (event.severity === "critical") {
          toast.error(event.title, {
            description: event.message,
          });
        } else {
          toast.success(event.title, {
            description: event.message,
          });
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    const route = notificationRoutes[notification.type];
    navigate(route);
    toast.info(`Navigating to ${notification.title.replace(" Alert", "").replace(" Detected", "")}`);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-secondary/50 transition-colors cursor-pointer relative group",
                      !notification.read && "bg-primary/5"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                          severityColors[notification.severity]
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm">{notification.title}</p>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <Separator />
        <div className="p-2">
          <Button variant="ghost" className="w-full justify-center text-sm">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}