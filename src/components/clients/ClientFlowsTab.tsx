import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GitBranch,
  Plus,
  MoreHorizontal,
  Copy,
  Trash2,
  Edit,
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Search,
  ArrowLeft,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Eye,
  History,
  RotateCcw,
  ChevronDown,
  MessageSquare,
  Bot,
  Keyboard,
  Webhook,
  Variable,
  User,
  Square,
  Maximize2,
  Grid3X3,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Flow, FlowNode, FlowVersion, NodeType } from "@/components/flow-builder/types";
import { FlowCanvas } from "@/components/flow-builder/FlowCanvas";
import { NodePropertiesPanel } from "@/components/flow-builder/NodePropertiesPanel";
import { FlowLivePreview } from "@/components/flow-builder/FlowLivePreview";
import { format } from "date-fns";

interface ClientFlowsTabProps {
  clientId: string;
  clientName: string;
}

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

const nodeTypeConfig = [
  { type: "start" as NodeType, label: "Start", icon: Play, color: "text-success" },
  { type: "message" as NodeType, label: "Message", icon: MessageSquare, color: "text-primary" },
  { type: "condition" as NodeType, label: "Condition", icon: GitBranch, color: "text-warning" },
  { type: "dtmf" as NodeType, label: "DTMF Input", icon: Keyboard, color: "text-blue-500" },
  { type: "api" as NodeType, label: "API Call", icon: Webhook, color: "text-emerald-500" },
  { type: "assistant" as NodeType, label: "AI Assistant", icon: Bot, color: "text-violet-500" },
  { type: "variable" as NodeType, label: "Set Variable", icon: Variable, color: "text-pink-500" },
  { type: "transfer" as NodeType, label: "Transfer", icon: User, color: "text-orange-500" },
  { type: "wait" as NodeType, label: "Wait", icon: Clock, color: "text-gray-500" },
  { type: "end" as NodeType, label: "End", icon: Square, color: "text-destructive" },
];

// Initial nodes for new flows
const createInitialNodes = (): FlowNode[] => [
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
];

// Sample flow with nodes for demo
const createSampleFlowNodes = (): FlowNode[] => [
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
        content: "Hello! How can I help you today?",
        voice: "nova",
        language: "en-US",
      },
    },
    connections: [{ id: "c2", targetNodeId: "cond-1" }],
  },
  {
    id: "cond-1",
    type: "condition",
    label: "Check Intent",
    position: { x: 480, y: 200 },
    data: {
      conditions: [
        { id: "branch-1", label: "Sales", expression: 'intent equals "sales"', nextNodeId: "msg-sales" },
        { id: "branch-2", label: "Support", expression: 'intent equals "support"', nextNodeId: "msg-support" },
      ],
    },
    connections: [
      { id: "c3", targetNodeId: "msg-sales", label: "Y" },
      { id: "c4", targetNodeId: "msg-support", label: "N" },
    ],
  },
  {
    id: "msg-sales",
    type: "message",
    label: "Sales Response",
    position: { x: 750, y: 100 },
    data: {
      message: {
        content: "Let me connect you with our sales team...",
        voice: "nova",
        language: "en-US",
      },
    },
    connections: [{ id: "c5", targetNodeId: "end-1" }],
  },
  {
    id: "msg-support",
    type: "message",
    label: "Support Response",
    position: { x: 750, y: 320 },
    data: {
      message: {
        content: "I'll help you with support. What seems to be the issue?",
        voice: "nova",
        language: "en-US",
      },
    },
    connections: [{ id: "c6", targetNodeId: "end-1" }],
  },
  {
    id: "end-1",
    type: "end",
    label: "End Call",
    position: { x: 1000, y: 200 },
    data: {},
    connections: [],
  },
];

export function ClientFlowsTab({ clientId, clientName }: ClientFlowsTabProps) {
  // Generate client-specific flows
  const [flows, setFlows] = useState<Flow[]>([
    {
      id: `${clientId}-flow-1`,
      name: "Customer Support Flow",
      description: "Main customer support conversation flow",
      status: "draft",
      currentVersion: "v2.1",
      versions: [
        { id: "v3", version: "v2.1", createdAt: "2024-05-01", createdBy: "John Anderson", nodeCount: 6, notes: "Added API call node for user lookup" },
        { id: "v2", version: "v2.0", createdAt: "2024-04-15", createdBy: "Sarah Mitchell", nodeCount: 5, notes: "Added conditional branching for sales vs support" },
        { id: "v1", version: "v1.0", createdAt: "2024-04-01", createdBy: "John Anderson", nodeCount: 3, notes: "Initial flow creation" },
      ],
      nodes: createSampleFlowNodes(),
      createdAt: new Date(Date.now() - 604800000).toISOString(),
      updatedAt: new Date().toISOString(),
      clientId,
      clientName,
      tags: ["support", "ai-triage"],
    },
    {
      id: `${clientId}-flow-2`,
      name: "Sales Inquiry Handler",
      description: "Qualify leads and route to appropriate sales team",
      status: "published",
      currentVersion: "v1.0",
      versions: [
        { id: "v1", version: "v1.0", createdAt: new Date().toISOString(), createdBy: "Admin", nodeCount: 2 },
      ],
      nodes: createInitialNodes(),
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      clientId,
      clientName,
      tags: ["sales", "lead-qualification"],
    },
    {
      id: `${clientId}-flow-3`,
      name: "Appointment Booking",
      description: "Voice-driven appointment scheduling with calendar integration",
      status: "testing",
      currentVersion: "v1.2",
      versions: [
        { id: "v1", version: "v1.2", createdAt: new Date().toISOString(), createdBy: "Admin", nodeCount: 2 },
      ],
      nodes: createInitialNodes(),
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 10800000).toISOString(),
      clientId,
      clientName,
      tags: ["scheduling", "voice"],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isDirty, setIsDirty] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [showNewFlowDialog, setShowNewFlowDialog] = useState(false);
  const [showVersionsDialog, setShowVersionsDialog] = useState(false);
  const [newFlowName, setNewFlowName] = useState("");
  const [newFlowDescription, setNewFlowDescription] = useState("");
  const [history, setHistory] = useState<FlowNode[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const filteredFlows = flows.filter(flow =>
    flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flow.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flow.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenEditor = (flow: Flow) => {
    setSelectedFlow(flow);
    setNodes(flow.nodes);
    setHistory([flow.nodes]);
    setHistoryIndex(0);
    setIsEditorMode(true);
    setIsDirty(false);
  };

  const handleCloseEditor = () => {
    if (isDirty) {
      if (!confirm("You have unsaved changes. Are you sure you want to close?")) {
        return;
      }
    }
    setIsEditorMode(false);
    setSelectedFlow(null);
    setNodes([]);
    setSelectedNodeId(null);
    setShowLivePreview(true);
  };

  const handleNodesChange = useCallback((newNodes: FlowNode[]) => {
    setNodes(newNodes);
    setIsDirty(true);
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

  const handleSaveFlow = () => {
    if (!selectedFlow) return;
    
    const updatedFlow: Flow = {
      ...selectedFlow,
      nodes,
      updatedAt: new Date().toISOString(),
    };
    
    setFlows(flows.map(f => f.id === selectedFlow.id ? updatedFlow : f));
    setSelectedFlow(updatedFlow);
    setIsDirty(false);
    toast.success("Flow saved successfully");
  };

  const handlePublishFlow = () => {
    if (!selectedFlow) return;
    
    const versionNumber = parseFloat(selectedFlow.currentVersion.replace('v', ''));
    const newVersion = `v${(Math.floor(versionNumber) + 1)}.0`;
    const updatedFlow: Flow = {
      ...selectedFlow,
      nodes,
      status: "published",
      currentVersion: newVersion,
      versions: [
        { id: `v-${Date.now()}`, version: newVersion, createdAt: new Date().toISOString(), createdBy: "Admin", nodeCount: nodes.length, notes: "Published version" },
        ...selectedFlow.versions,
      ],
      updatedAt: new Date().toISOString(),
    };
    
    setFlows(flows.map(f => f.id === selectedFlow.id ? updatedFlow : f));
    setSelectedFlow(updatedFlow);
    setIsDirty(false);
    toast.success("Flow published successfully!");
  };

  const handleRollback = (version: FlowVersion) => {
    if (!selectedFlow) return;
    
    toast.success(`Rolled back to ${version.version}. Current changes saved as draft.`);
    setShowVersionsDialog(false);
  };

  const handleCreateFlow = () => {
    if (!newFlowName.trim()) {
      toast.error("Please enter a flow name");
      return;
    }

    const initialNodes = createInitialNodes();
    const newFlow: Flow = {
      id: `${clientId}-flow-${Date.now()}`,
      name: newFlowName,
      description: newFlowDescription,
      status: "draft",
      currentVersion: "v1.0",
      versions: [
        { id: "v1", version: "v1.0", createdAt: new Date().toISOString(), createdBy: "Admin", nodeCount: 2 },
      ],
      nodes: initialNodes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clientId,
      clientName,
    };

    setFlows([newFlow, ...flows]);
    setShowNewFlowDialog(false);
    setNewFlowName("");
    setNewFlowDescription("");
    toast.success("Flow created! Click to open the editor.");
  };

  const handleDeleteFlow = (flowId: string) => {
    setFlows(flows.filter(f => f.id !== flowId));
    toast.success("Flow deleted");
  };

  const handleDuplicateFlow = (flow: Flow) => {
    const newFlow: Flow = {
      ...flow,
      id: `${clientId}-flow-${Date.now()}`,
      name: `${flow.name} (Copy)`,
      status: "draft",
      currentVersion: "v1.0",
      versions: [
        { id: "v1", version: "v1.0", createdAt: new Date().toISOString(), createdBy: "Admin", nodeCount: flow.nodes.length },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFlows([newFlow, ...flows]);
    toast.success("Flow duplicated");
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  // Editor Mode
  if (isEditorMode && selectedFlow) {
    const StatusIcon = statusIcons[selectedFlow.status];
    
    return (
      <div className="space-y-0 -mx-6 -mt-6">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-card border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleCloseEditor} className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{selectedFlow.name}</h2>
                <Badge variant="outline" className={cn("gap-1", statusStyles[selectedFlow.status])}>
                  {selectedFlow.status}
                </Badge>
                <Badge variant="secondary">{selectedFlow.currentVersion}</Badge>
                {isDirty && <span className="text-warning text-lg">•</span>}
              </div>
              <p className="text-sm text-muted-foreground">{selectedFlow.description}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Add Node Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Node
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Flow Control</DropdownMenuLabel>
                {nodeTypeConfig.filter(n => ["start", "end", "condition", "wait"].includes(n.type)).map((node) => (
                  <DropdownMenuItem key={node.type} onClick={() => handleAddNode(node.type)} className="gap-2">
                    <node.icon className={cn("h-4 w-4", node.color)} />
                    {node.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Communication</DropdownMenuLabel>
                {nodeTypeConfig.filter(n => ["message", "assistant", "dtmf", "transfer"].includes(n.type)).map((node) => (
                  <DropdownMenuItem key={node.type} onClick={() => handleAddNode(node.type)} className="gap-2">
                    <node.icon className={cn("h-4 w-4", node.color)} />
                    {node.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Data & Integration</DropdownMenuLabel>
                {nodeTypeConfig.filter(n => ["api", "variable"].includes(n.type)).map((node) => (
                  <DropdownMenuItem key={node.type} onClick={() => handleAddNode(node.type)} className="gap-2">
                    <node.icon className={cn("h-4 w-4", node.color)} />
                    {node.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Preview Toggle */}
            <Button 
              variant={showLivePreview ? "default" : "outline"} 
              className="gap-2"
              onClick={() => setShowLivePreview(!showLivePreview)}
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>

            {/* Versions Dialog */}
            <Dialog open={showVersionsDialog} onOpenChange={setShowVersionsDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <History className="h-4 w-4" />
                  Versions
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    Rollback to Previous Version
                  </DialogTitle>
                  <DialogDescription>
                    Select a previous version to restore. Current changes will be saved as draft.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[400px] pr-4">
                  <div className="space-y-3">
                    {selectedFlow.versions.map((version, index) => {
                      const isCurrentVersion = version.version === selectedFlow.currentVersion;
                      const isPublished = index === 0 && selectedFlow.status === "published";
                      
                      return (
                        <div
                          key={version.id}
                          className={cn(
                            "p-4 rounded-lg border transition-colors",
                            isCurrentVersion ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-lg">{version.version}</span>
                                {isCurrentVersion && (
                                  <Badge variant="secondary" className="text-xs">Current</Badge>
                                )}
                                {isPublished && (
                                  <Badge className="bg-success/10 text-success text-xs border-0">published</Badge>
                                )}
                                {!isCurrentVersion && !isPublished && selectedFlow.status === "draft" && index === 0 && (
                                  <Badge variant="secondary" className="text-xs">draft</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{version.notes}</p>
                              <p className="text-xs text-muted-foreground">
                                {version.createdBy} • {version.createdAt.includes("T") 
                                  ? format(new Date(version.createdAt), "yyyy-MM-dd")
                                  : version.createdAt}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setShowVersionsDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleRollback(selectedFlow.versions[1])}
                    disabled={selectedFlow.versions.length <= 1}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Rollback to v...
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Save Button */}
            <Button variant="outline" onClick={handleSaveFlow} disabled={!isDirty} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>

            {/* Publish Button */}
            <Button onClick={handlePublishFlow} className="gap-2 bg-primary">
              <Upload className="h-4 w-4" />
              Publish
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex h-[calc(100vh-200px)] min-h-[600px]">
          {/* Canvas */}
          <div className="flex-1 relative">
            <FlowCanvas
              nodes={nodes}
              onNodesChange={handleNodesChange}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              zoom={zoom}
              onConnect={handleConnect}
            />
            
            {/* Canvas Controls - Bottom Left */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-lg border p-1 shadow-lg">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm w-12 text-center font-medium">{zoom}%</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(150, zoom + 10))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-border" />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(100)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>

            {/* Canvas Hint */}
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded">
              Alt + Drag or Middle-click to pan • Ctrl + Scroll to zoom
            </div>
          </div>

          {/* Properties Panel */}
          {selectedNode && (
            <NodePropertiesPanel
              node={selectedNode}
              onUpdateNode={handleUpdateNode}
              onDeleteNode={handleDeleteNode}
              onDuplicateNode={handleDuplicateNode}
            />
          )}

          {/* Live Preview Panel */}
          {showLivePreview && (
            <FlowLivePreview
              nodes={nodes}
              onClose={() => setShowLivePreview(false)}
            />
          )}
        </div>
      </div>
    );
  }

  // Flow List Mode
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Conversation Flows</h3>
          <p className="text-sm text-muted-foreground">
            Manage AI conversation workflows for {clientName}
          </p>
        </div>
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
                Start building a new conversational workflow for {clientName}
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

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search flows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Flows Table */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flow Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Nodes</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <GitBranch className="h-8 w-8" />
                      <p>No flows found</p>
                      <Button size="sm" variant="outline" onClick={() => setShowNewFlowDialog(true)}>
                        Create your first flow
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredFlows.map((flow) => {
                  const StatusIcon = statusIcons[flow.status];
                  return (
                    <TableRow
                      key={flow.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleOpenEditor(flow)}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{flow.name}</span>
                          <span className="text-sm text-muted-foreground line-clamp-1">
                            {flow.description}
                          </span>
                          {flow.tags && flow.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {flow.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("gap-1", statusStyles[flow.status])}>
                          <StatusIcon className="h-3 w-3" />
                          {flow.status.charAt(0).toUpperCase() + flow.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{flow.currentVersion}</TableCell>
                      <TableCell className="text-muted-foreground">{flow.nodes.length}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(flow.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenEditor(flow); }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicateFlow(flow); }}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => { e.stopPropagation(); handleDeleteFlow(flow.id); }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{flows.length}</p>
                <p className="text-sm text-muted-foreground">Total Flows</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{flows.filter(f => f.status === "published").length}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{flows.filter(f => f.status === "draft").length}</p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <AlertCircle className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{flows.filter(f => f.status === "testing").length}</p>
                <p className="text-sm text-muted-foreground">Testing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
