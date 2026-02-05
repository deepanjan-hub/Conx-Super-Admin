import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  Calendar,
  Users,
  MessageSquare,
  DollarSign,
  Settings,
  CreditCard,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Save,
  Trash2,
  PlayCircle,
  PauseCircle,
  Edit,
  Upload,
  FileText,
  TrendingUp,
  TrendingDown,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useClients, useUpdateClient, useDeleteClient } from "@/hooks/useClients";
import { toast } from "sonner";

// Mock client data
const clientData = {
  id: "1",
  name: "Acme Corporation",
  email: "admin@acme.com",
  phone: "+1 (555) 123-4567",
  website: "https://acme.com",
  industry: "Technology",
  plan: "Enterprise",
  status: "Active",
  users: 145,
  agents: 12,
  conversations: "52.4K",
  mrr: "$12,500",
  createdAt: "Jan 15, 2024",
  billingEmail: "billing@acme.com",
  address: "123 Tech Avenue, San Francisco, CA 94102",
  timezone: "America/Los_Angeles",
  languages: ["English", "Spanish"],
  channels: {
    voice: true,
    chat: true,
    email: true,
  },
  features: {
    sentimentAnalysis: true,
    fraudDetection: true,
    voiceBiometrics: false,
    multiLanguage: true,
  },
};

const usageData = [
  { month: "Jan", conversations: 8200, minutes: 12400 },
  { month: "Feb", conversations: 9100, minutes: 14200 },
  { month: "Mar", conversations: 8800, minutes: 13100 },
  { month: "Apr", conversations: 10200, minutes: 15800 },
  { month: "May", conversations: 11500, minutes: 17200 },
  { month: "Jun", conversations: 12400, minutes: 18900 },
];

const channelBreakdown = [
  { name: "Voice", value: 45, color: "hsl(221, 83%, 53%)" },
  { name: "Chat", value: 40, color: "hsl(142, 76%, 36%)" },
  { name: "Email", value: 15, color: "hsl(38, 92%, 50%)" },
];

const invoiceHistory = [
  { id: "INV-2024-006", date: "Jun 1, 2024", amount: "$12,500", status: "Paid" },
  { id: "INV-2024-005", date: "May 1, 2024", amount: "$12,500", status: "Paid" },
  { id: "INV-2024-004", date: "Apr 1, 2024", amount: "$11,200", status: "Paid" },
  { id: "INV-2024-003", date: "Mar 1, 2024", amount: "$11,200", status: "Paid" },
  { id: "INV-2024-002", date: "Feb 1, 2024", amount: "$9,800", status: "Paid" },
];

const activityLog = [
  { action: "User added", user: "john.doe@acme.com", time: "2 hours ago" },
  { action: "API key generated", user: "admin@acme.com", time: "5 hours ago" },
  { action: "Plan upgraded", user: "billing@acme.com", time: "2 days ago" },
  { action: "Agent configured", user: "admin@acme.com", time: "3 days ago" },
  { action: "Integration enabled", user: "admin@acme.com", time: "1 week ago" },
];

const planColors = {
  Starter: "bg-secondary text-secondary-foreground",
  Professional: "bg-primary/10 text-primary",
  Enterprise: "bg-accent text-accent-foreground border border-primary/20",
};

const statusColors = {
  Active: "bg-success/10 text-success",
  Suspended: "bg-destructive/10 text-destructive",
  Pending: "bg-warning/10 text-warning",
};

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const { data: clients = [], isLoading } = useClients();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();

  const storeClient = clients.find((c) => c.id === id);

  // Merge store data with additional mock fields for display
  const client = storeClient ? {
    ...storeClient,
    phone: "+1 (555) 123-4567",
    website: `https://${storeClient.name.toLowerCase().replace(/\s+/g, '')}.com`,
    industry: "Technology",
    agents: 12,
    billingEmail: `billing@${storeClient.email.split('@')[1]}`,
    address: "123 Tech Avenue, San Francisco, CA 94102",
    timezone: "America/Los_Angeles",
    languages: ["English", "Spanish"],
    channels: {
      voice: true,
      chat: true,
      email: true,
    },
    features: {
      sentimentAnalysis: true,
      fraudDetection: true,
      voiceBiometrics: false,
      multiLanguage: true,
    },
    createdAt: new Date(storeClient.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  } : null;

  const handleSuspendToggle = () => {
    if (!client || !id) return;
    const newStatus = client.status === "Suspended" ? "Active" : "Suspended";
    updateClientMutation.mutate(
      { id, updates: { status: newStatus } },
      {
        onSuccess: () => {
          setIsSuspendDialogOpen(false);
          toast.success(
            newStatus === "Suspended"
              ? `${client.name} has been suspended`
              : `${client.name} has been reactivated`
          );
        },
      }
    );
  };

  const handleApprove = () => {
    if (!client || !id) return;
    updateClientMutation.mutate(
      { id, updates: { status: "Active" } },
      {
        onSuccess: () => {
          setIsApproveDialogOpen(false);
          toast.success(`${client.name} has been approved and activated`);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!id) return;
    deleteClientMutation.mutate(id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success("Client deleted successfully");
        navigate("/clients");
      },
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Loading..." subtitle="">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading client details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!client && !isLoading) {
    return (
      <DashboardLayout title="Client Not Found" subtitle="">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">The requested client was not found.</p>
          <Button onClick={() => navigate("/clients")}>Back to Clients</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/clients")}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {client.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="text-foreground">{client.name}</span>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                variant="secondary"
                className={cn("text-xs", planColors[client.plan as keyof typeof planColors])}
              >
                {client.plan}
              </Badge>
              <Badge
                variant="secondary"
                className={cn("text-xs", statusColors[client.status as keyof typeof statusColors])}
              >
                {client.status}
              </Badge>
            </div>
          </div>
        </div>
      }
      subtitle=""
    >
      <div className="space-y-6 animate-fade-in">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Mail className="h-4 w-4" />
              Send Email
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync Data
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {/* Approve button for Pending accounts */}
            {client.status === "Pending" && (
              <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 text-success border-success/30 hover:bg-success/10">
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Client Account</DialogTitle>
                    <DialogDescription>
                      This will activate the account for {client.name}. They will be able to access the platform and start using services.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div className="text-sm text-success">
                          <p className="font-medium">Account Activation</p>
                          <p>The client will receive a welcome email and can start using the platform immediately.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="bg-success hover:bg-success/90" 
                      onClick={handleApprove}
                      disabled={updateClientMutation.isPending}
                    >
                      {updateClientMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      )}
                      Approve Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            
            {/* Unsuspend button for Suspended accounts */}
            {client.status === "Suspended" ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 text-success border-success/30 hover:bg-success/10"
                onClick={handleSuspendToggle}
                disabled={updateClientMutation.isPending}
              >
                {updateClientMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
                Reactivate
              </Button>
            ) : client.status === "Active" ? (
              /* Suspend button for Active accounts */
              <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 text-warning border-warning/30 hover:bg-warning/10">
                    <PauseCircle className="h-4 w-4" />
                    Suspend
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Suspend Client Account</DialogTitle>
                    <DialogDescription>
                      This will temporarily disable all services for {client.name}. They will not be able to access the platform.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Reason for Suspension</Label>
                      <Textarea placeholder="Enter reason for suspension..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSuspendDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleSuspendToggle}
                      disabled={updateClientMutation.isPending}
                    >
                      {updateClientMutation.isPending && (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      )}
                      Suspend Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : null}
            
            {/* Delete button - always visible */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Client Account</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. All data associated with {client.name} will be permanently deleted.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div className="text-sm text-destructive">
                        <p className="font-medium">Warning</p>
                        <p>This will delete all users, conversations, configurations, and billing history.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Type "{client.name}" to confirm</Label>
                    <Input 
                      placeholder="Enter client name..." 
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={deleteConfirmation !== client.name || deleteClientMutation.isPending}
                  >
                    {deleteClientMutation.isPending && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    Delete Permanently
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="edit">Edit Details</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Client Info Card */}
              <Card className="shadow-card lg:col-span-2">
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{client.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{client.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <p className="font-medium">{client.website}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Industry</p>
                        <p className="font-medium">{client.industry}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="font-medium">{client.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">MRR</p>
                        <p className="font-medium text-success">{client.mrr}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card className="shadow-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Users</p>
                        <p className="text-2xl font-semibold">{client.users}</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">AI Agents</p>
                        <p className="text-2xl font-semibold">{client.agents}</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                        <MessageSquare className="h-5 w-5 text-success" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Conversations</p>
                        <p className="text-2xl font-semibold">{client.conversations}</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                        <BarChart3 className="h-5 w-5 text-warning" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Usage Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Usage Overview</CardTitle>
                <CardDescription>Conversation volume over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }}
                        tickFormatter={(value) => `${value / 1000}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(0, 0%, 100%)",
                          border: "1px solid hsl(220, 13%, 91%)",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="conversations"
                        stroke="hsl(221, 83%, 53%)"
                        fill="hsl(221, 83%, 53%)"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Edit Client Details</CardTitle>
                <CardDescription>Update client information and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input id="name" defaultValue={client.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Admin Email</Label>
                    <Input id="email" type="email" defaultValue={client.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue={client.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue={client.website} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select defaultValue="technology">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="pst">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                        <SelectItem value="cet">Central European Time (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" defaultValue={client.address} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingEmail">Billing Email</Label>
                  <Input id="billingEmail" type="email" defaultValue={client.billingEmail} />
                </div>
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Branding */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>White-Label Branding</CardTitle>
                <CardDescription>Customize the client's branding and appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="text-sm text-muted-foreground">PNG, SVG, or JPG. Max 2MB.</p>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary" />
                      <Input defaultValue="#3b82f6" className="font-mono" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Custom Domain</Label>
                    <Input placeholder="chat.acme.com" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Current Plan */}
              <Card className="shadow-card lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Current Subscription</CardTitle>
                      <CardDescription>Manage plan and billing</CardDescription>
                    </div>
                    <Badge className={planColors[client.plan as keyof typeof planColors]}>
                      {client.plan}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <p className="text-sm text-muted-foreground">Monthly Cost</p>
                      <p className="text-2xl font-semibold text-foreground">{client.mrr}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <p className="text-sm text-muted-foreground">User Seats</p>
                      <p className="text-2xl font-semibold text-foreground">{client.users} / 200</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <p className="text-sm text-muted-foreground">Renewal Date</p>
                      <p className="text-2xl font-semibold text-foreground">Jul 15, 2024</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Plan Features</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">Unlimited conversations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">Voice, Chat & Email</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">Advanced analytics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">Custom integrations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">White-label branding</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">Priority support</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline">Add Credits</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Summary */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Conversations</span>
                      <span className="font-medium">12,400 / ∞</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-full w-3/4 rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Voice Minutes</span>
                      <span className="font-medium">18,900 / 25,000</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-full w-3/4 rounded-full bg-warning" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">User Seats</span>
                      <span className="font-medium">145 / 200</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-full w-[72%] rounded-full bg-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Invoice History */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Invoice History</CardTitle>
                    <CardDescription>Past invoices and payment records</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceHistory.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                        <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                        <TableCell className="font-medium">{invoice.amount}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm text-success">+12.5%</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">52,400</p>
                  <p className="text-sm text-muted-foreground">Total Conversations</p>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm text-success">+8.2%</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">94.5%</p>
                  <p className="text-sm text-muted-foreground">Resolution Rate</p>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">-2.1%</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">2m 34s</p>
                  <p className="text-sm text-muted-foreground">Avg. Handle Time</p>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm text-success">+0.3</span>
                  </div>
                  <p className="text-2xl font-semibold mt-2">4.8 / 5</p>
                  <p className="text-sm text-muted-foreground">CSAT Score</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="shadow-card lg:col-span-2">
                <CardHeader>
                  <CardTitle>Conversation Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={usageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }}
                        />
                        <Tooltip />
                        <Bar dataKey="conversations" name="Conversations" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="minutes" name="Minutes" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Channel Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={channelBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          paddingAngle={2}
                        >
                          {channelBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    {channelBreakdown.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Analytics Report
              </Button>
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="configuration" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Channel Configuration</CardTitle>
                <CardDescription>Enable or disable communication channels for this client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Voice Calls</p>
                      <p className="text-sm text-muted-foreground">Inbound & outbound AI calling</p>
                    </div>
                  </div>
                  <Switch defaultChecked={client.channels.voice} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium">Chat</p>
                      <p className="text-sm text-muted-foreground">Web, mobile, and messaging</p>
                    </div>
                  </div>
                  <Switch defaultChecked={client.channels.chat} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium">Email Automation</p>
                      <p className="text-sm text-muted-foreground">AI-assisted replies and routing</p>
                    </div>
                  </div>
                  <Switch defaultChecked={client.channels.email} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Feature Access</CardTitle>
                <CardDescription>Toggle premium features for this client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sentiment Analysis</p>
                    <p className="text-sm text-muted-foreground">Real-time sentiment tagging</p>
                  </div>
                  <Switch defaultChecked={client.features.sentimentAnalysis} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Fraud Detection</p>
                    <p className="text-sm text-muted-foreground">Anomaly and suspicious activity detection</p>
                  </div>
                  <Switch defaultChecked={client.features.fraudDetection} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-medium">Voice Biometrics</p>
                      <p className="text-sm text-muted-foreground">Voice-based authentication</p>
                    </div>
                    <Badge variant="secondary" className="bg-warning/10 text-warning">Beta</Badge>
                  </div>
                  <Switch defaultChecked={client.features.voiceBiometrics} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Multi-Language Support</p>
                    <p className="text-sm text-muted-foreground">EN, DE, CZ, SK, PL, HI</p>
                  </div>
                  <Switch defaultChecked={client.features.multiLanguage} />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>Recent actions and changes for this client</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Log
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLog.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">by {activity.user}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
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

export default ClientDetail;
