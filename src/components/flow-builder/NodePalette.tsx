import { NodeType } from "./types";
import { cn } from "@/lib/utils";
import {
  Bot,
  GitBranch,
  Webhook,
  Keyboard,
  User,
  Clock,
  Variable,
  MessageSquare,
  Play,
  Square,
  GripVertical,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface NodePaletteProps {
  onAddNode: (type: NodeType) => void;
}

const nodeCategories = [
  {
    name: "Flow Control",
    nodes: [
      { type: "start" as NodeType, label: "Start", icon: Play, color: "text-success", description: "Entry point of the flow" },
      { type: "end" as NodeType, label: "End", icon: Square, color: "text-destructive", description: "Terminates the conversation" },
      { type: "condition" as NodeType, label: "Condition", icon: GitBranch, color: "text-warning", description: "Branch based on conditions" },
      { type: "wait" as NodeType, label: "Wait", icon: Clock, color: "text-gray-500", description: "Pause for specified duration" },
    ],
  },
  {
    name: "Communication",
    nodes: [
      { type: "message" as NodeType, label: "Message", icon: MessageSquare, color: "text-primary", description: "Send AI-generated message" },
      { type: "assistant" as NodeType, label: "AI Assistant", icon: Bot, color: "text-violet-500", description: "Multi-turn AI conversation" },
      { type: "dtmf" as NodeType, label: "DTMF Input", icon: Keyboard, color: "text-blue-500", description: "Keypad input handling" },
      { type: "transfer" as NodeType, label: "Transfer", icon: User, color: "text-orange-500", description: "Transfer to human agent" },
    ],
  },
  {
    name: "Data & Integration",
    nodes: [
      { type: "api" as NodeType, label: "API Call", icon: Webhook, color: "text-emerald-500", description: "Make HTTP request" },
      { type: "variable" as NodeType, label: "Set Variable", icon: Variable, color: "text-pink-500", description: "Store/modify data" },
    ],
  },
];

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const handleDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData("nodeType", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="w-64 border-r bg-card/50 flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm">Node Palette</h3>
        <p className="text-xs text-muted-foreground mt-1">Drag nodes to canvas or click to add</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {nodeCategories.map((category) => (
            <div key={category.name}>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {category.name}
              </h4>
              <div className="space-y-1">
                {category.nodes.map((node) => (
                  <div
                    key={node.type}
                    className={cn(
                      "flex items-center gap-3 p-2.5 rounded-lg cursor-grab transition-all group",
                      "border border-transparent hover:border-border hover:bg-accent/50",
                      "active:scale-[0.98] active:cursor-grabbing"
                    )}
                    draggable
                    onDragStart={(e) => handleDragStart(e, node.type)}
                    onClick={() => onAddNode(node.type)}
                  >
                    <div className="flex items-center gap-1">
                      <GripVertical className="h-3 w-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className={cn("p-1.5 rounded-md bg-muted", node.color)}>
                        <node.icon className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{node.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{node.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {category !== nodeCategories[nodeCategories.length - 1] && (
                <Separator className="mt-3" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
