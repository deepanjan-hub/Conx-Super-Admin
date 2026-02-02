import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Phone,
  Upload,
  Play,
  Pause,
  Search,
  Filter,
  Download,
  PhoneCall,
  PhoneOff,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  name: string;
  phone: string;
  company: string;
  email: string;
  status: "pending" | "called" | "no_answer" | "callback" | "converted" | "rejected";
  sentiment: "positive" | "negative" | "neutral" | null;
  callDuration: string | null;
  lastCall: string | null;
  notes: string;
}

interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  totalLeads: number;
  calledLeads: number;
  convertedLeads: number;
  startDate: string;
  client: string;
}

const leads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    phone: "+1 (555) 123-4567",
    company: "Tech Solutions Inc",
    email: "john@techsolutions.com",
    status: "converted",
    sentiment: "positive",
    callDuration: "4:32",
    lastCall: "10 min ago",
    notes: "Interested in enterprise plan",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    phone: "+1 (555) 234-5678",
    company: "Global Retail Co",
    email: "sarah@globalretail.com",
    status: "callback",
    sentiment: "neutral",
    callDuration: "2:15",
    lastCall: "1 hour ago",
    notes: "Requested callback next week",
  },
  {
    id: "3",
    name: "Michael Chen",
    phone: "+1 (555) 345-6789",
    company: "FinServ LLC",
    email: "m.chen@finserv.com",
    status: "no_answer",
    sentiment: null,
    callDuration: null,
    lastCall: "2 hours ago",
    notes: "Voicemail left",
  },
  {
    id: "4",
    name: "Emily Davis",
    phone: "+1 (555) 456-7890",
    company: "Healthcare Plus",
    email: "emily@healthcareplus.com",
    status: "rejected",
    sentiment: "negative",
    callDuration: "0:45",
    lastCall: "3 hours ago",
    notes: "Not interested at this time",
  },
  {
    id: "5",
    name: "Robert Wilson",
    phone: "+1 (555) 567-8901",
    company: "Manufacturing Corp",
    email: "r.wilson@manufacturing.com",
    status: "pending",
    sentiment: null,
    callDuration: null,
    lastCall: null,
    notes: "",
  },
];

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Q1 Enterprise Outreach",
    status: "active",
    totalLeads: 500,
    calledLeads: 342,
    convertedLeads: 45,
    startDate: "Jan 15, 2024",
    client: "Acme Corp",
  },
  {
    id: "2",
    name: "Product Launch Campaign",
    status: "active",
    totalLeads: 250,
    calledLeads: 180,
    convertedLeads: 28,
    startDate: "Feb 1, 2024",
    client: "TechFlow Inc",
  },
  {
    id: "3",
    name: "Renewal Outreach",
    status: "completed",
    totalLeads: 150,
    calledLeads: 150,
    convertedLeads: 112,
    startDate: "Dec 10, 2023",
    client: "Global Services",
  },
];

const statusStyles = {
  pending: "bg-secondary text-secondary-foreground",
  called: "bg-primary/10 text-primary",
  no_answer: "bg-warning/10 text-warning",
  callback: "bg-info/10 text-info",
  converted: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

const sentimentIcons = {
  positive: { icon: TrendingUp, color: "text-success" },
  neutral: { icon: Minus, color: "text-muted-foreground" },
  negative: { icon: TrendingDown, color: "text-destructive" },
};

const OutboundCalling = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleUpload = () => {
    toast.success("Lead list uploaded successfully", {
      description: "245 leads imported and ready for calling",
    });
    setIsUploadOpen(false);
  };

  const handleStartCall = (leadId: string) => {
    toast.info("Initiating AI call...", {
      description: "Connecting to lead",
    });
  };

  const handlePauseCampaign = (campaignId: string) => {
    toast.warning("Campaign paused", {
      description: "Outbound calls have been paused",
    });
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSentiment =
      sentimentFilter === "all" || lead.sentiment === sentimentFilter;
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesSentiment && matchesStatus;
  });

  const totalCalls = leads.filter((l) => l.status !== "pending").length;
  const positiveCount = leads.filter((l) => l.sentiment === "positive").length;
  const negativeCount = leads.filter((l) => l.sentiment === "negative").length;

  return (
    <DashboardLayout title="Outbound Calling" subtitle="AI-driven sales call campaigns">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <PhoneCall className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCalls}</p>
                  <p className="text-sm text-muted-foreground">Total Calls Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{positiveCount}</p>
                  <p className="text-sm text-muted-foreground">Positive Sentiment</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{negativeCount}</p>
                  <p className="text-sm text-muted-foreground">Negative Sentiment</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary">
                  <CheckCircle className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {leads.filter((l) => l.status === "converted").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Conversions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="leads" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="leads">Lead List</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="analytics">Call Analytics</TabsTrigger>
            </TabsList>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Leads
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Lead List</DialogTitle>
                  <DialogDescription>
                    Upload an Excel, CSV, or PDF file with lead information
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                      "hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Excel (.xlsx), CSV, or PDF (max 10MB)
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Required columns:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Name (Full name of the lead)</li>
                      <li>Phone (Phone number with country code)</li>
                      <li>Company (Company name)</li>
                      <li>Email (Optional)</li>
                    </ul>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload}>Upload & Import</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="leads" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px] pl-9"
                />
              </div>
              <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="called">Called</SelectItem>
                  <SelectItem value="no_answer">No Answer</SelectItem>
                  <SelectItem value="callback">Callback</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Leads Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Last Call</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => {
                    const SentimentIcon = lead.sentiment
                      ? sentimentIcons[lead.sentiment]
                      : null;
                    return (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-muted-foreground">{lead.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{lead.company}</TableCell>
                        <TableCell className="font-mono">{lead.phone}</TableCell>
                        <TableCell>
                          <Badge className={cn(statusStyles[lead.status])}>
                            {lead.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {SentimentIcon ? (
                            <div className="flex items-center gap-2">
                              <SentimentIcon.icon
                                className={cn("h-4 w-4", SentimentIcon.color)}
                              />
                              <span className="capitalize">{lead.sentiment}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {lead.callDuration || (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {lead.lastCall || (
                            <span className="text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={lead.status === "pending" ? "default" : "outline"}
                            className="gap-1"
                            onClick={() => handleStartCall(lead.id)}
                          >
                            <Phone className="h-3 w-3" />
                            {lead.status === "pending" ? "Call" : "Retry"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <CardDescription>{campaign.client}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          campaign.status === "active"
                            ? "default"
                            : campaign.status === "completed"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {campaign.calledLeads} / {campaign.totalLeads}
                        </span>
                      </div>
                      <Progress
                        value={(campaign.calledLeads / campaign.totalLeads) * 100}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Conversions</p>
                        <p className="text-xl font-bold text-success">
                          {campaign.convertedLeads}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conversion Rate</p>
                        <p className="text-xl font-bold">
                          {((campaign.convertedLeads / campaign.calledLeads) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {campaign.status === "active" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1"
                            onClick={() => handlePauseCampaign(campaign.id)}
                          >
                            <Pause className="h-3 w-3" />
                            Pause
                          </Button>
                          <Button size="sm" className="flex-1 gap-1">
                            <Play className="h-3 w-3" />
                            Resume
                          </Button>
                        </>
                      ) : campaign.status === "paused" ? (
                        <Button size="sm" className="flex-1 gap-1">
                          <Play className="h-3 w-3" />
                          Resume
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="flex-1 gap-1">
                          <Download className="h-3 w-3" />
                          Export Results
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Distribution</CardTitle>
                  <CardDescription>Call outcomes by sentiment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Positive", value: 45, color: "bg-success" },
                      { label: "Neutral", value: 32, color: "bg-warning" },
                      { label: "Negative", value: 23, color: "bg-destructive" },
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{item.label}</span>
                          <span className="font-medium">{item.value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary">
                          <div
                            className={cn("h-full rounded-full", item.color)}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Call Metrics</CardTitle>
                  <CardDescription>Today's performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Total Calls", value: "127", icon: Phone },
                      { label: "Avg Duration", value: "3:24", icon: Clock },
                      { label: "Answer Rate", value: "68%", icon: CheckCircle },
                      { label: "Conversion", value: "12%", icon: TrendingUp },
                    ].map((metric) => (
                      <div
                        key={metric.label}
                        className="p-4 rounded-lg bg-secondary/30 text-center"
                      >
                        <metric.icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default OutboundCalling;