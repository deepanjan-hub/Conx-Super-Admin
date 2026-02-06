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
  MoreHorizontal,
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
  { icon: typeof Bot; color: string; bgColor: string; iconBg: string }
> = {
  start: { icon: Play, color: "text-success", bgColor: "bg-card border-success/50", iconBg: "bg-success/20" },
  end: { icon: Square, color: "text-destructive", bgColor: "bg-card border-destructive/50", iconBg: "bg-destructive/20" },
  message: { icon: MessageSquare, color: "text-primary", bgColor: "bg-card border-primary/50", iconBg: "bg-primary/20" },
  assistant: { icon: Bot, color: "text-violet-500", bgColor: "bg-card border-violet-500/50", iconBg: "bg-violet-500/20" },
  condition: { icon: GitBranch, color: "text-warning", bgColor: "bg-card border-warning/50", iconBg: "bg-warning/20" },
  api: { icon: Webhook, color: "text-emerald-500", bgColor: "bg-card border-emerald-500/50", iconBg: "bg-emerald-500/20" },
  dtmf: { icon: Keyboard, color: "text-blue-500", bgColor: "bg-card border-blue-500/50", iconBg: "bg-blue-500/20" },
  transfer: { icon: User, color: "text-orange-500", bgColor: "bg-card border-orange-500/50", iconBg: "bg-orange-500/20" },
  wait: { icon: Clock, color: "text-gray-500", bgColor: "bg-card border-gray-500/50", iconBg: "bg-gray-500/20" },
  variable: { icon: Variable, color: "text-pink-500", bgColor: "bg-card border-pink-500/50", iconBg: "bg-pink-500/20" },
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

  // Get message preview text
  const getPreviewText = () => {
    if (node.type === "message" && node.data.message?.content) {
      const content = node.data.message.content;
      return content.length > 30 ? content.substring(0, 30) + "..." : content;
    }
    if (node.type === "condition" && node.data.conditions?.[0]) {
      return node.data.conditions[0].expression;
    }
    if (node.type === "dtmf" && node.data.dtmf?.prompt) {
      const prompt = node.data.dtmf.prompt;
      return prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt;
    }
    return null;
  };

  const previewText = getPreviewText();

  return (
    <div
      className={cn(
        "absolute flex flex-col rounded-lg border-2 bg-card shadow-lg cursor-grab transition-all duration-200",
        config.bgColor,
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-xl",
        isConnecting && "hover:ring-2 hover:ring-primary/50"
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: "180px",
        minHeight: "70px",
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
            isConnecting ? "border-primary scale-125 cursor-pointer bg-primary/20" : "border-muted-foreground/50"
          )}
          onClick={(e) => handleConnectionPointClick(e, "input")}
        />
      )}

      {/* Node Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
        <div className={cn("p-1.5 rounded-md", config.iconBg, config.color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground capitalize">{node.type}</p>
        </div>
        <GripVertical className="h-4 w-4 text-muted-foreground/50" />
        <MoreHorizontal className="h-4 w-4 text-muted-foreground/50" />
      </div>

      {/* Node Body */}
      <div className="px-3 py-2">
        <p className="text-sm font-semibold truncate">{node.label}</p>
        {previewText && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{previewText}</p>
        )}
      </div>

      {/* Condition branches badges */}
      {node.type === "condition" && node.data.conditions && node.data.conditions.length > 0 && (
        <div className="px-3 pb-2 flex gap-1">
          {node.data.conditions.map((branch, idx) => (
            <Badge
              key={branch.id}
              className={cn(
                "text-[10px] px-1.5 py-0 font-medium rounded-full",
                idx === 0 ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
              )}
            >
              {idx === 0 ? "Y" : "N"}
            </Badge>
          ))}
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
            "absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-primary cursor-pointer transition-all hover:scale-125",
            "border-primary"
          )}
          onClick={(e) => handleConnectionPointClick(e, "output")}
        />
      )}

      {/* Multiple output indicators for condition nodes */}
      {node.type === "condition" && node.data.conditions && node.data.conditions.length >= 2 && (
        <>
          <div
            className="absolute right-0 top-[30%] translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-success border-2 border-success cursor-pointer hover:scale-125 transition-all"
            onClick={(e) => handleConnectionPointClick(e, "output")}
          />
          <div
            className="absolute right-0 top-[70%] translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-destructive border-2 border-destructive cursor-pointer hover:scale-125 transition-all"
            onClick={(e) => handleConnectionPointClick(e, "output")}
          />
        </>
      )}
    </div>
  );
}
