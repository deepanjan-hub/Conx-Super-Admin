import { Activity, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const services = [
  { name: "API Gateway", status: "operational", uptime: 99.99, latency: "23ms" },
  { name: "LLM Engine", status: "operational", uptime: 99.95, latency: "145ms" },
  { name: "Voice Processing", status: "operational", uptime: 99.97, latency: "67ms" },
  { name: "Database", status: "operational", uptime: 99.99, latency: "12ms" },
  { name: "Storage", status: "degraded", uptime: 99.85, latency: "89ms" },
];

const statusConfig = {
  operational: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Operational" },
  degraded: { icon: AlertCircle, color: "text-warning", bg: "bg-warning/10", label: "Degraded" },
  down: { icon: Activity, color: "text-destructive", bg: "bg-destructive/10", label: "Down" },
};

export function SystemHealth() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">System Health</h3>
          <p className="text-sm text-muted-foreground">Real-time infrastructure status</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-success">All Systems Nominal</span>
        </div>
      </div>
      <div className="space-y-4">
        {services.map((service) => {
          const config = statusConfig[service.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;
          return (
            <div key={service.name} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", config.bg)}>
                    <StatusIcon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{service.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{service.latency}</span>
                  </div>
                  <span className="font-medium text-foreground">{service.uptime}%</span>
                </div>
              </div>
              <Progress 
                value={service.uptime} 
                className="h-1.5 bg-secondary"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}