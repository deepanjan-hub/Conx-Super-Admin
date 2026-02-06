import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Plug,
  Store,
  CheckCircle,
  Clock,
  Search,
  ExternalLink,
  Settings,
  Download,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  status: "active" | "expired" | "revoked";
  permissions: string[];
  client: string;
}

interface Connector {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "connected" | "available" | "coming_soon";
  icon: string;
  docsUrl: string;
}

interface MarketplaceApp {
  id: string;
  name: string;
  vendor: string;
  description: string;
  category: string;
  rating: number;
  installs: string;
  price: string;
  installed: boolean;
  icon: string;
}

const apiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API Key",
    key: "sk_live_xxxxxxxxxxxxxxxxxxxxxxxx",
    createdAt: "Jan 15, 2024",
    lastUsed: "2 hours ago",
    status: "active",
    permissions: ["read", "write", "admin"],
    client: "Acme Corporation",
  },
  {
    id: "2",
    name: "Development API Key",
    key: "sk_test_xxxxxxxxxxxxxxxxxxxxxxxx",
    createdAt: "Jan 10, 2024",
    lastUsed: "5 days ago",
    status: "active",
    permissions: ["read", "write"],
    client: "TechFlow Inc",
  },
  {
    id: "3",
    name: "Legacy Integration Key",
    key: "sk_legacy_xxxxxxxxxxxxxxxxxxxxxxxx",
    createdAt: "Dec 01, 2023",
    lastUsed: "30 days ago",
    status: "expired",
    permissions: ["read"],
    client: "Global Services",
  },
];

const connectors: Connector[] = [
  {
    id: "1",
    name: "Salesforce CRM",
    category: "CRM",
    description: "Sync customer data and interactions with Salesforce",
    status: "connected",
    icon: "🔵",
    docsUrl: "#",
  },
  {
    id: "2",
    name: "HubSpot",
    category: "CRM",
    description: "Connect marketing, sales, and service data",
    status: "available",
    icon: "🟠",
    docsUrl: "#",
  },
  {
    id: "3",
    name: "Zendesk",
    category: "Ticketing",
    description: "Integrate support tickets and customer conversations",
    status: "connected",
    icon: "🟢",
    docsUrl: "#",
  },
  {
    id: "4",
    name: "SAP ERP",
    category: "ERP",
    description: "Connect enterprise resource planning data",
    status: "available",
    icon: "🔷",
    docsUrl: "#",
  },
  {
    id: "5",
    name: "Microsoft Dynamics",
    category: "ERP",
    description: "Integrate with Microsoft business applications",
    status: "coming_soon",
    icon: "🟣",
    docsUrl: "#",
  },
  {
    id: "6",
    name: "Jira",
    category: "Ticketing",
    description: "Sync project and issue tracking data",
    status: "available",
    icon: "🔵",
    docsUrl: "#",
  },
  {
    id: "7",
    name: "ServiceNow",
    category: "ITSM",
    description: "Connect IT service management workflows",
    status: "available",
    icon: "🟩",
    docsUrl: "#",
  },
  {
    id: "8",
    name: "Oracle NetSuite",
    category: "ERP",
    description: "Integrate with cloud ERP and financials",
    status: "coming_soon",
    icon: "🔴",
    docsUrl: "#",
  },
];

const marketplaceApps: MarketplaceApp[] = [
  {
    id: "1",
    name: "Voice AI Engine",
    vendor: "VoiceTech Labs",
    description: "Advanced voice synthesis and recognition for natural conversations",
    category: "Voice",
    rating: 4.8,
    installs: "2.5k+",
    price: "From $99/mo",
    installed: true,
    icon: "🎙️",
  },
  {
    id: "2",
    name: "Advanced Analytics Suite",
    vendor: "DataViz Pro",
    description: "Deep conversation analytics and sentiment tracking",
    category: "Analytics",
    rating: 4.6,
    installs: "1.8k+",
    price: "From $149/mo",
    installed: false,
    icon: "📊",
  },
  {
    id: "3",
    name: "Multi-Language Pack",
    vendor: "GlobalSpeak",
    description: "Support for 50+ languages with real-time translation",
    category: "Language",
    rating: 4.9,
    installs: "3.2k+",
    price: "From $79/mo",
    installed: true,
    icon: "🌍",
  },
  {
    id: "4",
    name: "Compliance Guardian",
    vendor: "SecureAI",
    description: "Automated compliance monitoring and reporting",
    category: "Security",
    rating: 4.7,
    installs: "950+",
    price: "From $199/mo",
    installed: false,
    icon: "🛡️",
  },
  {
    id: "5",
    name: "Smart Routing Engine",
    vendor: "FlowLogic",
    description: "AI-powered call routing and queue optimization",
    category: "Routing",
    rating: 4.5,
    installs: "1.2k+",
    price: "From $129/mo",
    installed: false,
    icon: "🔀",
  },
  {
    id: "6",
    name: "Custom Training Studio",
    vendor: "LearnAI",
    description: "Create custom AI training modules for specific industries",
    category: "Training",
    rating: 4.4,
    installs: "680+",
    price: "From $249/mo",
    installed: false,
    icon: "🎓",
  },
];

const IntegrationManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showKey, setShowKey] = useState<string | null>(null);
  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyClient, setNewKeyClient] = useState("");

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const handleCreateKey = () => {
    if (!newKeyName || !newKeyClient) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("API key created successfully", {
      description: "The new key has been generated and is ready to use",
    });
    setIsCreateKeyOpen(false);
    setNewKeyName("");
    setNewKeyClient("");
  };

  const handleRevokeKey = (keyId: string) => {
    toast.success("API key revoked", {
      description: "The key has been permanently disabled",
    });
  };

  const handleConnectIntegration = (connectorId: string, name: string) => {
    toast.success(`Connecting to ${name}...`, {
      description: "Please complete the authentication process",
    });
  };

  const handleInstallApp = (appId: string, name: string) => {
    toast.success(`Installing ${name}...`, {
      description: "The add-on will be available shortly",
    });
  };

  const filteredConnectors = connectors.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredApps = marketplaceApps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(connectors.map((c) => c.category))];

  return (
    <DashboardLayout title="Integration Management" subtitle="Manage API keys, connectors, and third-party add-ons">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Key className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{apiKeys.filter((k) => k.status === "active").length}</p>
                  <p className="text-sm text-muted-foreground">Active API Keys</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <Plug className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{connectors.filter((c) => c.status === "connected").length}</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary">
                  <Store className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{marketplaceApps.filter((a) => a.installed).length}</p>
                  <p className="text-sm text-muted-foreground">Installed Add-ons</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{connectors.filter((c) => c.status === "coming_soon").length}</p>
                  <p className="text-sm text-muted-foreground">Coming Soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList>
            <TabsTrigger value="api-keys">API Key Management</TabsTrigger>
            <TabsTrigger value="connectors">Pre-Built Connectors</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search API keys..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px] pl-9"
                />
              </div>
              <Dialog open={isCreateKeyOpen} onOpenChange={setIsCreateKeyOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogDescription>
                      Generate a new API key for secure integrations
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyName">Key Name</Label>
                      <Input
                        id="keyName"
                        placeholder="e.g., Production Integration"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keyClient">Assign to Client</Label>
                      <Select value={newKeyClient} onValueChange={setNewKeyClient}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acme">Acme Corporation</SelectItem>
                          <SelectItem value="techflow">TechFlow Inc</SelectItem>
                          <SelectItem value="global">Global Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Permissions</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Read Access</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Write Access</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Admin Access</span>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateKeyOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateKey}>Create Key</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium">{apiKey.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {showKey === apiKey.id ? apiKey.key : "••••••••••••••••••••"}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                          >
                            {showKey === apiKey.id ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleCopyKey(apiKey.key)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{apiKey.client}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {apiKey.permissions.map((perm) => (
                            <Badge key={perm} variant="secondary" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{apiKey.lastUsed}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            apiKey.status === "active" && "bg-success/10 text-success",
                            apiKey.status === "expired" && "bg-warning/10 text-warning",
                            apiKey.status === "revoked" && "bg-destructive/10 text-destructive"
                          )}
                        >
                          {apiKey.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {}}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleRevokeKey(apiKey.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Connectors Tab */}
          <TabsContent value="connectors" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search connectors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[300px] pl-9"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredConnectors.map((connector) => (
                <Card key={connector.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{connector.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{connector.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {connector.category}
                          </Badge>
                        </div>
                      </div>
                      {connector.status === "connected" && (
                        <Badge className="bg-success/10 text-success">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{connector.description}</p>
                    <div className="flex items-center gap-2">
                      {connector.status === "connected" ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </>
                      ) : connector.status === "available" ? (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleConnectIntegration(connector.id, connector.name)}
                        >
                          <Plug className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      ) : (
                        <Button size="sm" variant="secondary" className="flex-1" disabled>
                          <Clock className="h-4 w-4 mr-2" />
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search add-ons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px] pl-9"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredApps.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{app.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{app.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{app.vendor}</p>
                        </div>
                      </div>
                      {app.installed && (
                        <Badge className="bg-success/10 text-success">Installed</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{app.description}</p>
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>{app.rating}</span>
                      </div>
                      <span className="text-muted-foreground">{app.installs} installs</span>
                      <Badge variant="secondary">{app.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{app.price}</span>
                      {app.installed ? (
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleInstallApp(app.id, app.name)}>
                          <Download className="h-4 w-4 mr-2" />
                          Install
                        </Button>
                      )}
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

export default IntegrationManagement;
