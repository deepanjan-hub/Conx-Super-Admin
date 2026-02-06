import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Archive,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Flow, FlowNode, NodeType } from "@/components/flow-builder/types";
import { FlowCanvas } from "@/components/flow-builder/FlowCanvas";
import { NodePalette } from "@/components/flow-builder/NodePalette";
import { NodePropertiesPanel } from "@/components/flow-builder/NodePropertiesPanel";
import { FlowTestPanel } from "@/components/flow-builder/FlowTestPanel";

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
const sampleFlowNodes: FlowNode[] = [
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
    connections: [{ id: "c3", targetNodeId: "cond-1", label: "Any key" }],
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
    connections: [{ id: "c4", targetNodeId: "end-1", label: "Default" }],
  },
  {
    id: "end-1",
    type: "end",
    label: "End Call",
    position: { x: 980, y: 200 },
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
      description: "Handle incoming customer support requests with AI triage",
      status: "published",
      currentVersion: "v2.3",
      versions: [
        { id: "v1", version: "v2.3", createdAt: new Date().toISOString(), createdBy: "Admin", nodeCount: 5, notes: "Added escalation logic" },
        { id: "v2", version: "v2.2", createdAt: new Date(Date.now() - 86400000).toISOString(), createdBy: "Admin", nodeCount: 4 },
      ],
      nodes: sampleFlowNodes,
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
      status: "draft",
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
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [showNewFlowDialog, setShowNewFlowDialog] = useState(false);
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
    setShowTestPanel(false);
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
    
    const newVersion = `v${parseFloat(selectedFlow.currentVersion.replace('v', '')) + 0.1}`;
    const updatedFlow: Flow = {
      ...selectedFlow,
      nodes,
      status: "published",
      currentVersion: newVersion,
      versions: [
        { id: `v-${Date.now()}`, version: newVersion, createdAt: new Date().toISOString(), createdBy: "Admin", nodeCount: nodes.length, notes: "Published" },
        ...selectedFlow.versions,
      ],
      updatedAt: new Date().toISOString(),
    };
    
    setFlows(flows.map(f => f.id === selectedFlow.id ? updatedFlow : f));
    setSelectedFlow(updatedFlow);
    setIsDirty(false);
    toast.success("Flow published successfully!");
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
    return (
      <div className="space-y-4">
        {/* Editor Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleCloseEditor}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {selectedFlow.name}
                {isDirty && <span className="text-warning text-sm">•</span>}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedFlow.currentVersion} • {nodes.length} nodes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleUndo} disabled={historyIndex <= 0}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
              <Redo className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 border rounded-md px-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm w-12 text-center">{zoom}%</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(150, zoom + 10))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowTestPanel(!showTestPanel)} className="gap-2">
              <Play className="h-4 w-4" />
              Test
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveFlow} disabled={!isDirty} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button size="sm" onClick={handlePublishFlow} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Publish
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex gap-4 h-[calc(100vh-320px)] min-h-[500px]">
          {/* Node Palette */}
          <div className="w-48 shrink-0">
            <NodePalette onAddNode={handleAddNode} />
          </div>

        {/* Canvas */}
          <div className="flex-1 border rounded-lg overflow-hidden">
            <FlowCanvas
              nodes={nodes}
              onNodesChange={handleNodesChange}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              zoom={zoom}
              onConnect={handleConnect}
            />
          </div>

          {/* Properties Panel */}
          <NodePropertiesPanel
            node={selectedNode}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            onDuplicateNode={handleDuplicateNode}
          />

          {/* Test Panel */}
          <FlowTestPanel
            nodes={nodes}
            isOpen={showTestPanel}
            onClose={() => setShowTestPanel(false)}
            onHighlightNode={() => {}}
          />
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
