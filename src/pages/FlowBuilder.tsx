import { useState, useCallback } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  GitBranch,
  Play,
  Plus,
  MoreHorizontal,
  Copy,
  Trash2,
  Eye,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  CheckCircle,
  AlertCircle,
  Clock,
  Phone,
  Layers,
  FileText,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Flow, FlowNode, NodeType } from "@/components/flow-builder/types";
import { FlowCanvas } from "@/components/flow-builder/FlowCanvas";
import { NodePalette } from "@/components/flow-builder/NodePalette";
import { NodePropertiesPanel } from "@/components/flow-builder/NodePropertiesPanel";
import { FlowVersionControl } from "@/components/flow-builder/FlowVersionControl";
import { FlowTestPanel } from "@/components/flow-builder/FlowTestPanel";

// Sample flows data
const sampleFlows: Flow[] = [
  {
    id: "1",
    name: "Customer Support Flow",
    description: "Handle incoming customer support requests with AI triage",
    status: "published",
    currentVersion: "v2.3",
    versions: [
      { id: "v1", version: "v2.3", createdAt: new Date().toISOString(), createdBy: "Admin", nodeCount: 24, notes: "Added escalation logic" },
      { id: "v2", version: "v2.2", createdAt: new Date(Date.now() - 86400000).toISOString(), createdBy: "Admin", nodeCount: 22 },
      { id: "v3", version: "v2.1", createdAt: new Date(Date.now() - 172800000).toISOString(), createdBy: "Admin", nodeCount: 20 },
    ],
    nodes: [],
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date().toISOString(),
    clientName: "Acme Corporation",
    tags: ["support", "ai-triage"],
  },
  {
    id: "2",
    name: "Sales Inquiry Handler",
    description: "Qualify leads and route to appropriate sales team",
    status: "draft",
    currentVersion: "v1.0",
    versions: [
      { id: "v1", version: "v1.0", createdAt: new Date().toISOString(), createdBy: "Admin", nodeCount: 12 },
    ],
    nodes: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    clientName: "TechFlow Inc",
    tags: ["sales", "lead-qualification"],
  },
  {
    id: "3",
    name: "Appointment Booking",
    description: "Voice-driven appointment scheduling with calendar integration",
    status: "testing",
    currentVersion: "v1.2",
    versions: [
      { id: "v1", version: "v1.2", createdAt: new Date().toISOString(), createdBy: "Admin", nodeCount: 18 },
      { id: "v2", version: "v1.1", createdAt: new Date(Date.now() - 86400000).toISOString(), createdBy: "Admin", nodeCount: 15 },
    ],
    nodes: [],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
    clientName: "HealthTech",
    tags: ["scheduling", "voice"],
  },
];

// Initial nodes for the editor
const initialNodes: FlowNode[] = [
  {
    id: "start-1",
    type: "start",
    label: "Start",
    position: { x: 50, y: 200 },
    data: {},
    connections: [{ id: "c1", targetNodeId: "msg-1" }],
  },
  {
    id: "msg-1",
    type: "message",
    label: "Welcome Message",
    position: { x: 250, y: 200 },
    data: {
      message: {
        content: "Hello! Thank you for calling. How can I help you today?",
        voice: "nova",
        language: "en-US",
      },
    },
    connections: [{ id: "c2", targetNodeId: "dtmf-1" }],
  },
  {
    id: "dtmf-1",
    type: "dtmf",
    label: "Menu Selection",
    position: { x: 480, y: 200 },
    data: {
      dtmf: {
        prompt: "Press 1 for Sales, 2 for Support, or 3 to speak with an agent.",
        options: [
          { key: "1", label: "Sales" },
          { key: "2", label: "Support" },
          { key: "3", label: "Agent" },
        ],
        timeout: 10,
        retries: 3,
      },
    },
    connections: [
      { id: "c3", targetNodeId: "cond-1", label: "Any key" },
    ],
  },
  {
    id: "cond-1",
    type: "condition",
    label: "Route by Selection",
    position: { x: 720, y: 200 },
    data: {
      conditions: [
        { id: "branch-1", label: "Sales", expression: 'dtmf === "1"' },
        { id: "branch-2", label: "Support", expression: 'dtmf === "2"' },
        { id: "branch-3", label: "Agent", expression: 'dtmf === "3"' },
      ],
    },
    connections: [
      { id: "c4", targetNodeId: "assist-1", label: "Sales" },
    ],
  },
  {
    id: "assist-1",
    type: "assistant",
    label: "Sales AI",
    position: { x: 980, y: 120 },
    data: {
      assistant: {
        assistantId: "sales-agent",
        systemPrompt: "You are a helpful sales assistant.",
        maxTurns: 10,
        temperature: 0.7,
      },
    },
    connections: [{ id: "c5", targetNodeId: "api-1" }],
  },
  {
    id: "api-1",
    type: "api",
    label: "Log to CRM",
    position: { x: 1220, y: 120 },
    data: {
      api: {
        method: "POST",
        url: "https://api.crm.example.com/leads",
        headers: { "Content-Type": "application/json" },
        responseVariable: "crmResponse",
        timeout: 5000,
      },
    },
    connections: [{ id: "c6", targetNodeId: "end-1" }],
  },
  {
    id: "end-1",
    type: "end",
    label: "End Call",
    position: { x: 1460, y: 200 },
    data: {},
    connections: [],
  },
];

const statusStyles = {
  draft: "bg-warning/10 text-warning border-warning/30",
  published: "bg-success/10 text-success border-success/30",
  testing: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  archived: "bg-muted text-muted-foreground border-muted",
};

const statusIcons = {
  draft: Clock,
  published: CheckCircle,
  testing: AlertCircle,
  archived: FileText,
};

const FlowBuilder = () => {
  const [activeTab, setActiveTab] = useState("flows");
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [nodes, setNodes] = useState<FlowNode[]>(initialNodes);
  const [zoom, setZoom] = useState(100);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [history, setHistory] = useState<FlowNode[][]>([initialNodes]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [showNewFlowDialog, setShowNewFlowDialog] = useState(false);
  const [newFlowName, setNewFlowName] = useState("");
  const [newFlowDescription, setNewFlowDescription] = useState("");
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  // Current flow for the editor
  const currentFlow: Flow = selectedFlow || {
    id: "current",
    name: "Customer Support Flow",
    status: "draft",
    currentVersion: "v2.3",
    versions: [
      { id: "v1", version: "v2.3", createdAt: new Date().toISOString(), createdBy: "Admin", nodeCount: nodes.length },
    ],
    nodes: nodes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleNodesChange = useCallback((newNodes: FlowNode[]) => {
    setNodes(newNodes);
    setIsDirty(true);
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newNodes);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setNodes(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setNodes(history[historyIndex + 1]);
    }
  };

  const handleAddNode = (type: NodeType) => {
    const newNode: FlowNode = {
      id: `${type}-${Date.now()}`,
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      position: { x: 400 + Math.random() * 100, y: 200 + Math.random() * 100 },
      data: {},
      connections: [],
    };
    handleNodesChange([...nodes, newNode]);
    setSelectedNodeId(newNode.id);
    toast.success(`Added ${type} node`);
  };

  const handleConnect = (sourceId: string, targetId: string) => {
    const newNodes = nodes.map((node) => {
      if (node.id === sourceId) {
        // Check if connection already exists
        if (node.connections.some((c) => c.targetNodeId === targetId)) {
          return node;
        }
        return {
          ...node,
          connections: [
            ...node.connections,
            { id: `conn-${Date.now()}`, targetNodeId: targetId },
          ],
        };
      }
      return node;
    });
    handleNodesChange(newNodes);
    toast.success("Connection created");
  };

  const handleUpdateNode = (updatedNode: FlowNode) => {
    handleNodesChange(nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  const handleDeleteNode = (nodeId: string) => {
    // Remove node and all connections to it
    const newNodes = nodes
      .filter((n) => n.id !== nodeId)
      .map((n) => ({
        ...n,
        connections: n.connections.filter((c) => c.targetNodeId !== nodeId),
      }));
    handleNodesChange(newNodes);
    setSelectedNodeId(null);
    toast.success("Node deleted");
  };

  const handleDuplicateNode = (nodeId: string) => {
    const nodeToDuplicate = nodes.find((n) => n.id === nodeId);
    if (!nodeToDuplicate) return;

    const newNode: FlowNode = {
      ...nodeToDuplicate,
      id: `${nodeToDuplicate.type}-${Date.now()}`,
      label: `${nodeToDuplicate.label} (Copy)`,
      position: {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50,
      },
      connections: [],
    };
    handleNodesChange([...nodes, newNode]);
    setSelectedNodeId(newNode.id);
    toast.success("Node duplicated");
  };

  const handleSaveFlow = (notes?: string) => {
    setIsDirty(false);
    toast.success("Flow saved as draft");
  };

  const handlePublishFlow = () => {
    setIsDirty(false);
    toast.success("Flow published successfully!");
  };

  const handleRollbackFlow = (versionId: string) => {
    toast.info(`Rolled back to version ${versionId}`);
  };

  const handleCreateFlow = () => {
    if (!newFlowName.trim()) {
      toast.error("Please enter a flow name");
      return;
    }

    const newFlow: Flow = {
      id: `flow-${Date.now()}`,
      name: newFlowName,
      description: newFlowDescription,
      status: "draft",
      currentVersion: "v1.0",
      versions: [
        { id: "v1", version: "v1.0", createdAt: new Date().toISOString(), createdBy: "Admin", nodeCount: 2 },
      ],
      nodes: [
        {
          id: "start-1",
          type: "start",
          label: "Start",
          position: { x: 100, y: 200 },
          data: {},
          connections: [{ id: "c1", targetNodeId: "end-1" }],
        },
        {
          id: "end-1",
          type: "end",
          label: "End",
          position: { x: 400, y: 200 },
          data: {},
          connections: [],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    sampleFlows.unshift(newFlow);
    setSelectedFlow(newFlow);
    setNodes(newFlow.nodes);
    setActiveTab("editor");
    setShowNewFlowDialog(false);
    setNewFlowName("");
    setNewFlowDescription("");
    toast.success("Flow created! Add nodes to build your conversation.");
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <DashboardLayout 
      title="Flow Builder" 
      subtitle="Visual no-code workflow designer for AI conversations"
    >
      <div className="space-y-6 animate-fade-in">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="flows" className="gap-2">
                <Layers className="h-4 w-4" />
                My Flows
              </TabsTrigger>
              <TabsTrigger value="editor" className="gap-2">
                <GitBranch className="h-4 w-4" />
                Flow Editor
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Templates
              </TabsTrigger>
            </TabsList>

            <Dialog open={showNewFlowDialog} onOpenChange={setShowNewFlowDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Flow
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Flow</DialogTitle>
                  <DialogDescription>
                    Start building a new conversational workflow
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Flow Name</Label>
                    <Input
                      value={newFlowName}
                      onChange={(e) => setNewFlowName(e.target.value)}
                      placeholder="e.g., Customer Support Flow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Textarea
                      value={newFlowDescription}
                      onChange={(e) => setNewFlowDescription(e.target.value)}
                      placeholder="Describe what this flow does..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewFlowDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFlow}>Create Flow</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Flows List Tab */}
          <TabsContent value="flows" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sampleFlows.map((flow) => {
                const StatusIcon = statusIcons[flow.status];
                return (
                  <Card
                    key={flow.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg hover:border-primary/50",
                      selectedFlow?.id === flow.id && "ring-2 ring-primary"
                    )}
                    onClick={() => {
                      setSelectedFlow(flow);
                      setNodes(flow.nodes.length > 0 ? flow.nodes : initialNodes);
                      setActiveTab("editor");
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{flow.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {flow.description || flow.clientName}
                          </CardDescription>
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn("gap-1", statusStyles[flow.status])}>
                          <StatusIcon className="h-3 w-3" />
                          {flow.status}
                        </Badge>
                        <Badge variant="outline">{flow.currentVersion}</Badge>
                        {flow.tags?.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                        <span>{flow.versions[0]?.nodeCount || 0} nodes</span>
                        <span>Updated {new Date(flow.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Flow Editor Tab */}
          <TabsContent value="editor" className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <Select defaultValue="current">
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select flow" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">{currentFlow.name}</SelectItem>
                        {sampleFlows.map((flow) => (
                          <SelectItem key={flow.id} value={flow.id}>
                            {flow.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FlowVersionControl
                      flow={currentFlow}
                      onSave={handleSaveFlow}
                      onPublish={handlePublishFlow}
                      onRollback={handleRollbackFlow}
                      isDirty={isDirty}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Undo"
                      onClick={handleUndo}
                      disabled={historyIndex === 0}
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Redo"
                      onClick={handleRedo}
                      disabled={historyIndex === history.length - 1}
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setZoom(Math.max(50, zoom - 10))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm w-12 text-center">{zoom}%</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setZoom(Math.min(150, zoom + 10))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setShowTestPanel(!showTestPanel)}
                    >
                      <Phone className="h-4 w-4" />
                      {showTestPanel ? "Hide" : "Live"} Test
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex h-[600px]">
                  <NodePalette onAddNode={handleAddNode} />
                  <FlowCanvas
                    nodes={nodes}
                    onNodesChange={handleNodesChange}
                    selectedNodeId={selectedNodeId}
                    onSelectNode={setSelectedNodeId}
                    zoom={zoom}
                    onConnect={handleConnect}
                  />
                  <NodePropertiesPanel
                    node={selectedNode}
                    onUpdateNode={handleUpdateNode}
                    onDeleteNode={handleDeleteNode}
                    onDuplicateNode={handleDuplicateNode}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Customer Support",
                  description: "Handle common support queries with AI triage and escalation",
                  nodes: 15,
                  category: "Support",
                  icon: "🎧",
                },
                {
                  name: "Lead Qualification",
                  description: "Qualify sales leads automatically with intelligent questioning",
                  nodes: 12,
                  category: "Sales",
                  icon: "📊",
                },
                {
                  name: "Appointment Scheduler",
                  description: "Book and manage appointments with calendar integration",
                  nodes: 18,
                  category: "Scheduling",
                  icon: "📅",
                },
                {
                  name: "Order Status",
                  description: "Check order status with API integration to your backend",
                  nodes: 10,
                  category: "E-commerce",
                  icon: "📦",
                },
                {
                  name: "FAQ Bot",
                  description: "Answer frequently asked questions using your knowledge base",
                  nodes: 8,
                  category: "Support",
                  icon: "❓",
                },
                {
                  name: "Survey Collection",
                  description: "Collect customer feedback with voice-driven surveys",
                  nodes: 14,
                  category: "Feedback",
                  icon: "📝",
                },
              ].map((template) => (
                <Card
                  key={template.name}
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                  onClick={() => {
                    toast.success(`Template "${template.name}" loaded`, {
                      description: "You can customize it for your needs",
                    });
                    setActiveTab("editor");
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{template.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="secondary">{template.category}</Badge>
                      <span className="text-muted-foreground">{template.nodes} nodes</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Test Panel */}
        <FlowTestPanel
          nodes={nodes}
          isOpen={showTestPanel}
          onClose={() => setShowTestPanel(false)}
          onHighlightNode={setHighlightedNodeId}
        />
      </div>
    </DashboardLayout>
  );
};

export default FlowBuilder;
