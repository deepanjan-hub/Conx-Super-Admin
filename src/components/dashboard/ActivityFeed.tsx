import { UserPlus, AlertTriangle, CreditCard, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "client_onboarded",
    message: "Acme Corporation completed onboarding",
    time: "2 minutes ago",
    icon: UserPlus,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    id: 2,
    type: "alert",
    message: "High API usage detected for TechFlow Inc",
    time: "15 minutes ago",
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    id: 3,
    type: "payment",
    message: "Payment received from Global Services ($24,000)",
    time: "1 hour ago",
    icon: CreditCard,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: 4,
    type: "config",
    message: "LLM configuration updated for Enterprise tier",
    time: "3 hours ago",
    icon: Settings,
    color: "text-muted-foreground",
    bg: "bg-secondary",
  },
  {
    id: 5,
    type: "security",
    message: "Security audit completed - no issues found",
    time: "5 hours ago",
    icon: Shield,
    color: "text-success",
    bg: "bg-success/10",
  },
];

export function ActivityFeed() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Latest platform events</p>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className={cn(
                "flex items-start gap-4 pb-4",
                index !== activities.length - 1 && "border-b border-border"
              )}
            >
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", activity.bg)}>
                <Icon className={cn("h-4 w-4", activity.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}