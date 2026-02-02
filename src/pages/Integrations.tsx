import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Search,
  Plus,
  Key,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Plug,
  Code,
  Package,
  Globe,
  MessageSquare,
  Phone,
  Mail,
  Database,
  Shield,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const apiKeys = [
  {
    id: "1",
    name: "Production API Key",
    key: "sk_live_...a8f4",
    created: "Jan 15, 2024",
    lastUsed: "2 minutes ago",
    status: "active",
    permissions: ["read", "write"],
  },
  {
    id: "2",
    name: "Development Key",
    key: "sk_test_...b2c1",
    created: "Feb 3, 2024",
    lastUsed: "1 hour ago",
    status: "active",
    permissions: ["read", "write"],
  },
  {
    id: "3",
    name: "Webhook Signing Secret",
    key: "whsec_...d4e5",
    created: "Mar 10, 2024",
    lastUsed: "5 hours ago",
    status: "active",
    permissions: ["webhooks"],
  },
];

const connectors = [
  {
    id: "twilio",
    name: "Twilio",
    description: "Voice and SMS communication",
    category: "Communication",
    icon: Phone,
    status: "connected",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "WhatsApp messaging integration",
    category: "Communication",
    icon: MessageSquare,
    status: "connected",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team notifications and alerts",
    category: "Communication",
    icon: MessageSquare,
    status: "connected",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "gmail",
    name: "Gmail / Google Workspace",
    description: "Email automation and sync",
    category: "Email",
    icon: Mail,
    status: "disconnected",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "CRM data synchronization",
    category: "CRM",
    icon: Database,
    status: "connected",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Marketing and CRM integration",
    category: "CRM",
    icon: Database,
    status: "disconnected",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: "zendesk",
    name: "Zendesk",
    description: "Ticketing system integration",
    category: "Support",
    icon: Package,
    status: "connected",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: "sap",
    name: "SAP",
    description: "ERP data integration",
    category: "ERP",
    icon: Database,
    status: "disconnected",
    color: "text-muted-foreground",
    bgColor: "bg-secondary",
  },
];

const webhooks = [
  { id: "1", url: "https://api.acme.com/webhooks/conx", events: ["conversation.created", "conversation.ended"], status: "active" },
  { id: "2", url: "https://hooks.slack.com/services/...", events: ["agent.escalation"], status: "active" },
  { id: "3", url: "https://api.salesforce.com/webhook", events: ["conversation.ended"], status: "inactive" },
];

const Integrations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showKey, setShowKey] = useState<string | null>(null);
  const [isNewKeyDialogOpen, setIsNewKeyDialogOpen] = useState(false);
  const [isConnectorDialogOpen, setIsConnectorDialogOpen] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<typeof connectors[0] | null>(null);

  const filteredConnectors = connectors.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Integrations" subtitle="API management and third-party connectors">
      <div className="space-y-6 animate-fade-in">
        {/* Tabs */}
        <Tabs defaultValue="api" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="api" className="gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="connectors" className="gap-2">
              <Plug className="h-4 w-4" />
              Connectors
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="gap-2">
              <Zap className="h-4 w-4" />
              Webhooks
            </TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">API Keys</h3>
                <p className="text-sm text-muted-foreground">Manage API access tokens</p>
              </div>
              <Dialog open={isNewKeyDialogOpen} onOpenChange={setIsNewKeyDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Generate New Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate API Key</DialogTitle>
                    <DialogDescription>
                      Create a new API key for platform access
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Key Name</Label>
                      <Input placeholder="e.g., Production API Key" />
                    </div>
                    <div className="space-y-2">
                      <Label>Permissions</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Read Access</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Write Access</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Webhook Access</span>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewKeyDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsNewKeyDialogOpen(false)}>Generate Key</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="shadow-card">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm bg-secondary/50 px-2 py-1 rounded">
                              {showKey === key.id ? "sk_live_abc123xyz789def" : key.key}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                            >
                              {showKey === key.id ? (
                                <EyeOff className="h-3.5 w-3.5" />
                              ) : (
                                <Eye className="h-3.5 w-3.5" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {key.permissions.map((p) => (
                              <Badge key={p} variant="secondary" className="text-xs">
                                {p}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{key.lastUsed}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>Resources for integrating with the ConX-AI platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg border bg-card hover:bg-secondary/20 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Code className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">REST API Reference</p>
                        <p className="text-sm text-muted-foreground">Complete API documentation</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border bg-card hover:bg-secondary/20 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                        <Package className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">SDK Downloads</p>
                        <p className="text-sm text-muted-foreground">Web & Mobile SDKs</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border bg-card hover:bg-secondary/20 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                        <Globe className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium">Postman Collection</p>
                        <p className="text-sm text-muted-foreground">Ready-to-use examples</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connectors Tab */}
          <TabsContent value="connectors" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px] pl-9 bg-secondary/50 border-0"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredConnectors.map((connector) => (
                <Card key={connector.id} className="shadow-card">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", connector.bgColor)}>
                          <connector.icon className={cn("h-6 w-6", connector.color)} />
                        </div>
                        <div>
                          <p className="font-medium">{connector.name}</p>
                          <p className="text-sm text-muted-foreground">{connector.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className={cn(
                          connector.status === "connected"
                            ? "bg-success/10 text-success"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {connector.status === "connected" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Connected
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Disconnected
                          </>
                        )}
                      </Badge>
                      <Button
                        variant={connector.status === "connected" ? "outline" : "default"}
                        size="sm"
                        onClick={() => {
                          setSelectedConnector(connector);
                          setIsConnectorDialogOpen(true);
                        }}
                      >
                        {connector.status === "connected" ? (
                          <>
                            <Settings className="h-4 w-4 mr-1" />
                            Configure
                          </>
                        ) : (
                          <>
                            <Plug className="h-4 w-4 mr-1" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Dialog open={isConnectorDialogOpen} onOpenChange={setIsConnectorDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {selectedConnector?.status === "connected" ? "Configure" : "Connect"} {selectedConnector?.name}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedConnector?.status === "connected"
                      ? "Update your integration settings"
                      : "Enter your credentials to connect"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter API key..." />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter API secret..." />
                  </div>
                  {selectedConnector?.status === "connected" && (
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                      <div>
                        <p className="font-medium">Auto-Sync</p>
                        <p className="text-sm text-muted-foreground">Sync data every 15 minutes</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  {selectedConnector?.status === "connected" && (
                    <Button variant="destructive" className="mr-auto">
                      Disconnect
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setIsConnectorDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsConnectorDialogOpen(false)}>
                    {selectedConnector?.status === "connected" ? "Save Changes" : "Connect"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Webhooks</h3>
                <p className="text-sm text-muted-foreground">Receive real-time event notifications</p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Webhook
              </Button>
            </div>

            <Card className="shadow-card">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Endpoint URL</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.map((webhook) => (
                      <TableRow key={webhook.id}>
                        <TableCell>
                          <code className="font-mono text-sm">{webhook.url}</code>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.map((event) => (
                              <Badge key={event} variant="secondary" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              webhook.status === "active"
                                ? "bg-success/10 text-success"
                                : "bg-secondary text-muted-foreground"
                            )}
                          >
                            {webhook.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Available Events</CardTitle>
                <CardDescription>Events you can subscribe to</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { event: "conversation.created", desc: "New conversation started" },
                    { event: "conversation.ended", desc: "Conversation completed" },
                    { event: "conversation.escalated", desc: "Transferred to human agent" },
                    { event: "agent.escalation", desc: "Agent escalation request" },
                    { event: "sentiment.negative", desc: "Negative sentiment detected" },
                    { event: "fraud.detected", desc: "Suspicious activity flagged" },
                  ].map((item) => (
                    <div key={item.event} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <Zap className="h-4 w-4 text-primary" />
                      <div>
                        <code className="text-sm font-mono">{item.event}</code>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Integrations;
