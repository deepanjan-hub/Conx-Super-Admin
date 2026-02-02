import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GitBranch,
  Play,
  Save,
  Plus,
  MoreHorizontal,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  Bot,
  User,
  Webhook,
  Keyboard,
  ArrowRight,
  Copy,
  Trash2,
  Eye,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Layers,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FlowNode {
  id: string;
  type: "start" | "message" | "condition" | "api" | "dtmf" | "transfer" | "end";
  label: string;
  x: number;
  y: number;
  connected: string[];
}

interface Flow {
  id: string;
  name: string;
  status: "draft" | "published" | "testing";
  version: string;
  lastModified: string;
  client: string;
  nodeCount: number;
}

const flows: Flow[] = [
  {
    id: "1",
    name: "Customer Support Flow",
    status: "published",
    version: "v2.3",
    lastModified: "2 hours ago",
    client: "Acme Corporation",
    nodeCount: 24,
  },
  {
    id: "2",
    name: "Sales Inquiry Handler",
    status: "draft",
    version: "v1.0",
    lastModified: "1 day ago",
    client: "TechFlow Inc",
    nodeCount: 12,
  },
  {
    id: "3",
    name: "Appointment Booking",
    status: "testing",
    version: "v1.2",
    lastModified: "3 hours ago",
    client: "HealthTech",
    nodeCount: 18,
  },
];

const nodeTypes = [
  { type: "message", label: "AI Message", icon: Bot, color: "bg-primary/10 text-primary" },
  { type: "condition", label: "Condition", icon: GitBranch, color: "bg-warning/10 text-warning" },
  { type: "api", label: "API Call", icon: Webhook, color: "bg-success/10 text-success" },
  { type: "dtmf", label: "DTMF Input", icon: Keyboard, color: "bg-secondary text-foreground" },
  { type: "transfer", label: "Human Transfer", icon: User, color: "bg-destructive/10 text-destructive" },
];

const mockNodes: FlowNode[] = [
  { id: "1", type: "start", label: "Start", x: 50, y: 150, connected: ["2"] },
  { id: "2", type: "message", label: "Welcome Message", x: 200, y: 150, connected: ["3"] },
  { id: "3", type: "condition", label: "Intent Check", x: 400, y: 150, connected: ["4", "5"] },
  { id: "4", type: "message", label: "Support Response", x: 600, y: 80, connected: ["6"] },
  { id: "5", type: "message", label: "Sales Response", x: 600, y: 220, connected: ["6"] },
  { id: "6", type: "end", label: "End", x: 800, y: 150, connected: [] },
];

const statusStyles = {
  draft: "bg-secondary text-secondary-foreground",
  published: "bg-success/10 text-success",
  testing: "bg-warning/10 text-warning",
};

const statusIcons = {
  draft: Clock,
  published: CheckCircle,
  testing: AlertCircle,
};

const FlowBuilder = () => {
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [nodes, setNodes] = useState<FlowNode[]>(mockNodes);
  const [zoom, setZoom] = useState(100);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleCreateFlow = () => {
    toast.success("New flow created", {
      description: "Start adding nodes to build your conversation flow",
    });
  };

  const handleSaveFlow = () => {
    toast.success("Flow saved", {
      description: "All changes have been saved",
    });
  };

  const handlePublishFlow = () => {
    toast.success("Flow published", {
      description: "The flow is now live and active",
    });
  };

  const handleTestFlow = () => {
    toast.info("Testing flow...", {
      description: "Opening preview in test mode",
    });
  };

  const handleAddNode = (type: string) => {
    toast.success(`Added ${type} node`, {
      description: "Drag to position and connect to other nodes",
    });
  };

  return (
    <DashboardLayout title="Flow Builder" subtitle="Visual workflow designer for conversations">
      <div className="space-y-6 animate-fade-in">
        <Tabs defaultValue="flows" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="flows">My Flows</TabsTrigger>
              <TabsTrigger value="editor">Flow Editor</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <Button className="gap-2" onClick={handleCreateFlow}>
              <Plus className="h-4 w-4" />
              New Flow
            </Button>
          </div>

          <TabsContent value="flows" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {flows.map((flow) => {
                const StatusIcon = statusIcons[flow.status];
                return (
                  <Card
                    key={flow.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg",
                      selectedFlow?.id === flow.id && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedFlow(flow)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{flow.name}</CardTitle>
                          <CardDescription>{flow.client}</CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge className={cn(statusStyles[flow.status], "gap-1")}>
                          <StatusIcon className="h-3 w-3" />
                          {flow.status}
                        </Badge>
                        <span className="text-muted-foreground">{flow.version}</span>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                        <span>{flow.nodeCount} nodes</span>
                        <span>Modified {flow.lastModified}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Select defaultValue="flow1">
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Select flow" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flow1">Customer Support Flow</SelectItem>
                        <SelectItem value="flow2">Sales Inquiry Handler</SelectItem>
                        <SelectItem value="flow3">Appointment Booking</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant="secondary">v2.3 - Draft</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" title="Undo">
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Redo">
                      <Redo className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button variant="ghost" size="icon" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm w-12 text-center">{zoom}%</span>
                    <Button variant="ghost" size="icon" onClick={() => setZoom(Math.min(150, zoom + 10))}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button variant="outline" className="gap-2" onClick={handleTestFlow}>
                      <Play className="h-4 w-4" />
                      Test
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={handleSaveFlow}>
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button className="gap-2" onClick={handlePublishFlow}>
                      <CheckCircle className="h-4 w-4" />
                      Publish
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex">
                  {/* Node Palette */}
                  <div className="w-64 border-r p-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Add Nodes</h4>
                      <div className="space-y-2">
                        {nodeTypes.map((node) => (
                          <div
                            key={node.type}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg cursor-move transition-colors",
                              "hover:bg-secondary/50 border border-transparent hover:border-border",
                              node.color
                            )}
                            onClick={() => handleAddNode(node.label)}
                            draggable
                          >
                            <node.icon className="h-5 w-5" />
                            <span className="text-sm font-medium">{node.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Canvas */}
                  <div
                    className="flex-1 bg-muted/30 overflow-auto"
                    style={{ height: "500px" }}
                  >
                    <div
                      className="relative min-w-[900px] min-h-[400px] p-8"
                      style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
                    >
                      {/* Connection Lines */}
                      <svg className="absolute inset-0 pointer-events-none" style={{ overflow: "visible" }}>
                        {nodes.map((node) =>
                          node.connected.map((targetId) => {
                            const target = nodes.find((n) => n.id === targetId);
                            if (!target) return null;
                            return (
                              <path
                                key={`${node.id}-${targetId}`}
                                d={`M ${node.x + 80} ${node.y + 25} C ${node.x + 150} ${node.y + 25}, ${target.x - 50} ${target.y + 25}, ${target.x} ${target.y + 25}`}
                                fill="none"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                                strokeDasharray={node.type === "condition" ? "5,5" : "none"}
                              />
                            );
                          })
                        )}
                      </svg>

                      {/* Nodes */}
                      {nodes.map((node) => {
                        const nodeConfig = nodeTypes.find((n) => n.type === node.type);
                        const Icon = nodeConfig?.icon || MessageSquare;
                        const isStart = node.type === "start";
                        const isEnd = node.type === "end";

                        return (
                          <div
                            key={node.id}
                            className={cn(
                              "absolute flex items-center gap-2 px-4 py-2 rounded-lg border-2 bg-card shadow-sm cursor-move transition-all",
                              selectedNode === node.id && "ring-2 ring-primary ring-offset-2",
                              isStart && "bg-success/10 border-success",
                              isEnd && "bg-destructive/10 border-destructive",
                              !isStart && !isEnd && "border-border hover:border-primary"
                            )}
                            style={{ left: node.x, top: node.y }}
                            onClick={() => setSelectedNode(node.id)}
                          >
                            <Icon className={cn("h-5 w-5", nodeConfig?.color.split(" ")[1])} />
                            <span className="text-sm font-medium whitespace-nowrap">{node.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Properties Panel */}
                  <div className="w-72 border-l p-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Node Properties</h4>
                      {selectedNode ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Node Label</label>
                            <Input
                              value={nodes.find((n) => n.id === selectedNode)?.label || ""}
                              onChange={() => {}}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">Node Type</label>
                            <Select value={nodes.find((n) => n.id === selectedNode)?.type}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {nodeTypes.map((type) => (
                                  <SelectItem key={type.type} value={type.type}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button variant="destructive" size="sm" className="w-full gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete Node
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Select a node to view and edit its properties
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Customer Support",
                  description: "Handle common support queries with AI",
                  nodes: 15,
                  category: "Support",
                },
                {
                  name: "Lead Qualification",
                  description: "Qualify sales leads automatically",
                  nodes: 12,
                  category: "Sales",
                },
                {
                  name: "Appointment Scheduler",
                  description: "Book and manage appointments",
                  nodes: 18,
                  category: "Scheduling",
                },
                {
                  name: "FAQ Bot",
                  description: "Answer frequently asked questions",
                  nodes: 8,
                  category: "Support",
                },
                {
                  name: "Order Status",
                  description: "Check and track order status",
                  nodes: 10,
                  category: "E-commerce",
                },
                {
                  name: "Feedback Collection",
                  description: "Gather customer feedback and ratings",
                  nodes: 7,
                  category: "Survey",
                },
              ].map((template) => (
                <Card key={template.name} className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {template.nodes} nodes
                      </span>
                      <Button size="sm" className="gap-1">
                        <Plus className="h-3 w-3" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FlowBuilder;