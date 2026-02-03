import { FlowNode } from "./types";
import { cn } from "@/lib/utils";
import {
  Bot,
  GitBranch,
  Webhook,
  Keyboard,
  User,
  Play,
  Square,
  Clock,
  Variable,
  MessageSquare,
  GripVertical,
  Circle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FlowNodeComponentProps {
  node: FlowNode;
  isSelected: boolean;
  isConnecting: boolean;
  onSelect: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onStartConnection: () => void;
  onEndConnection: () => void;
}

const nodeConfig: Record<
  string,
  { icon: typeof Bot; color: string; bgColor: string }
> = {
  start: { icon: Play, color: "text-success", bgColor: "bg-success/10 border-success" },
  end: { icon: Square, color: "text-destructive", bgColor: "bg-destructive/10 border-destructive" },
  message: { icon: MessageSquare, color: "text-primary", bgColor: "bg-primary/10 border-primary/50" },
  assistant: { icon: Bot, color: "text-violet-500", bgColor: "bg-violet-500/10 border-violet-500/50" },
  condition: { icon: GitBranch, color: "text-warning", bgColor: "bg-warning/10 border-warning/50" },
  api: { icon: Webhook, color: "text-emerald-500", bgColor: "bg-emerald-500/10 border-emerald-500/50" },
  dtmf: { icon: Keyboard, color: "text-blue-500", bgColor: "bg-blue-500/10 border-blue-500/50" },
  transfer: { icon: User, color: "text-orange-500", bgColor: "bg-orange-500/10 border-orange-500/50" },
  wait: { icon: Clock, color: "text-gray-500", bgColor: "bg-gray-500/10 border-gray-500/50" },
  variable: { icon: Variable, color: "text-pink-500", bgColor: "bg-pink-500/10 border-pink-500/50" },
};

export function FlowNodeComponent({
  node,
  isSelected,
  isConnecting,
  onSelect,
  onDragStart,
  onStartConnection,
  onEndConnection,
}: FlowNodeComponentProps) {
  const config = nodeConfig[node.type] || nodeConfig.message;
  const Icon = config.icon;

  const handleConnectionPointClick = (e: React.MouseEvent, type: "input" | "output") => {
    e.stopPropagation();
    if (type === "output") {
      onStartConnection();
    } else if (isConnecting) {
      onEndConnection();
    }
  };

  return (
    <div
      className={cn(
        "absolute flex flex-col rounded-lg border-2 bg-card shadow-md cursor-grab transition-all duration-200",
        config.bgColor,
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg",
        isConnecting && "hover:ring-2 hover:ring-primary/50"
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: "160px",
        minHeight: "60px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseDown={onDragStart}
    >
      {/* Input connection point */}
      {node.type !== "start" && (
        <div
          className={cn(
            "absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-background transition-all",
            isConnecting ? "border-primary scale-125 cursor-pointer" : "border-muted-foreground/50"
          )}
          onClick={(e) => handleConnectionPointClick(e, "input")}
        />
      )}

      {/* Node content */}
      <div className="flex items-center gap-2 px-3 py-2">
        <div className={cn("p-1.5 rounded-md bg-background/50", config.color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{node.label}</p>
          <p className="text-xs text-muted-foreground capitalize">{node.type}</p>
        </div>
      </div>

      {/* Condition branches preview */}
      {node.type === "condition" && node.data.conditions && node.data.conditions.length > 0 && (
        <div className="px-3 pb-2 space-y-1">
          {node.data.conditions.slice(0, 2).map((branch) => (
            <Badge
              key={branch.id}
              variant="secondary"
              className="text-[10px] px-1.5 py-0 font-normal"
            >
              {branch.label}
            </Badge>
          ))}
          {node.data.conditions.length > 2 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              +{node.data.conditions.length - 2} more
            </Badge>
          )}
        </div>
      )}

      {/* DTMF options preview */}
      {node.type === "dtmf" && node.data.dtmf?.options && node.data.dtmf.options.length > 0 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {node.data.dtmf.options.slice(0, 4).map((option) => (
            <Badge
              key={option.key}
              variant="secondary"
              className="text-[10px] px-1.5 py-0 font-mono"
            >
              {option.key}
            </Badge>
          ))}
        </div>
      )}

      {/* Output connection point */}
      {node.type !== "end" && (
        <div
          className={cn(
            "absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-background cursor-pointer transition-all hover:scale-125",
            "border-primary hover:bg-primary"
          )}
          onClick={(e) => handleConnectionPointClick(e, "output")}
        />
      )}

      {/* Multiple outputs for condition/dtmf nodes */}
      {(node.type === "condition" || node.type === "dtmf") && (
        <div className="absolute right-0 top-full -translate-y-2 translate-x-1/2 flex flex-col gap-2">
          {node.type === "condition" &&
            node.data.conditions?.map((_, idx) => (
              <div
                key={idx}
                className="w-2.5 h-2.5 rounded-full border-2 border-warning bg-background cursor-pointer hover:scale-125 transition-all"
              />
            ))}
        </div>
      )}
    </div>
  );
}
