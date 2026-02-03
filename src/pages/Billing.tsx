import { useState, forwardRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Users,
  Download,
  Search,
  Filter,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  FileText,
  Receipt,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const initialPlans = [
  {
    id: "starter",
    name: "Starter",
    price: "$299",
    period: "/month",
    features: ["5 user seats", "10K conversations/mo", "Chat & Email only", "Basic analytics"],
    clients: 12,
  },
  {
    id: "professional",
    name: "Professional",
    price: "$899",
    period: "/month",
    features: ["25 user seats", "50K conversations/mo", "All channels", "Advanced analytics", "API access"],
    clients: 45,
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$2,499",
    period: "/month",
    features: ["200 user seats", "Unlimited conversations", "All channels", "Custom integrations", "White-label", "Priority support"],
    clients: 18,
  },
];

const revenueData = [
  { month: "Jan", mrr: 89200, newMrr: 8400, churnedMrr: 2100 },
  { month: "Feb", mrr: 94500, newMrr: 7200, churnedMrr: 1900 },
  { month: "Mar", mrr: 98700, newMrr: 6800, churnedMrr: 2600 },
  { month: "Apr", mrr: 105200, newMrr: 9200, churnedMrr: 2700 },
  { month: "May", mrr: 108900, newMrr: 5400, churnedMrr: 1700 },
  { month: "Jun", mrr: 112450, newMrr: 5800, churnedMrr: 2250 },
];

const invoices = [
  { id: "INV-2024-156", client: "Acme Corporation", amount: "$12,500", date: "Jun 1, 2024", status: "Paid", plan: "Enterprise" },
  { id: "INV-2024-155", client: "TechFlow Inc", amount: "$4,200", date: "Jun 1, 2024", status: "Paid", plan: "Professional" },
  { id: "INV-2024-154", client: "Global Services Ltd", amount: "$24,000", date: "Jun 1, 2024", status: "Paid", plan: "Enterprise" },
  { id: "INV-2024-153", client: "StartupXYZ", amount: "$299", date: "Jun 1, 2024", status: "Pending", plan: "Starter" },
  { id: "INV-2024-152", client: "FinanceHub", amount: "$0", date: "Jun 1, 2024", status: "Failed", plan: "Professional" },
  { id: "INV-2024-151", client: "HealthTech Solutions", amount: "$18,000", date: "Jun 1, 2024", status: "Paid", plan: "Enterprise" },
  { id: "INV-2024-150", client: "RetailMax", amount: "$5,800", date: "Jun 1, 2024", status: "Paid", plan: "Professional" },
];

const creditTransactions = [
  { id: "TXN-001", client: "Acme Corporation", type: "Purchase", amount: "+$5,000", date: "Jun 10, 2024", balance: "$8,200" },
  { id: "TXN-002", client: "TechFlow Inc", type: "Usage", amount: "-$420", date: "Jun 9, 2024", balance: "$1,580" },
  { id: "TXN-003", client: "Global Services Ltd", type: "Purchase", amount: "+$10,000", date: "Jun 8, 2024", balance: "$12,400" },
  { id: "TXN-004", client: "StartupXYZ", type: "Usage", amount: "-$45", date: "Jun 7, 2024", balance: "$255" },
  { id: "TXN-005", client: "HealthTech Solutions", type: "Refund", amount: "+$500", date: "Jun 5, 2024", balance: "$3,500" },
];

const statusColors = {
  Paid: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
  Failed: "bg-destructive/10 text-destructive",
  Overdue: "bg-destructive/10 text-destructive",
};

const Billing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCreditsOpen, setIsAddCreditsOpen] = useState(false);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [planWizardStep, setPlanWizardStep] = useState(1);
  const [subscriptionPlans, setSubscriptionPlans] = useState(initialPlans);
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    period: "month",
    userSeats: "",
    conversations: "",
    channels: [] as string[],
    features: [] as string[],
  });

  const resetPlanWizard = () => {
    setPlanWizardStep(1);
    setNewPlan({
      name: "",
      price: "",
      period: "month",
      userSeats: "",
      conversations: "",
      channels: [],
      features: [],
    });
  };

  const handleCreatePlanClose = (open: boolean) => {
    if (!open) {
      resetPlanWizard();
    }
    setIsCreatePlanOpen(open);
  };

  const toggleChannel = (channel: string) => {
    setNewPlan(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const toggleFeature = (feature: string) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <DashboardLayout title="Billing & Subscriptions" subtitle="Manage plans, invoices, and payments">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">$112,450</p>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-sm text-success">
                <ArrowUpRight className="h-4 w-4" />
                <span>+18.2% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">156</p>
                  <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-sm text-success">
                <ArrowUpRight className="h-4 w-4" />
                <span>+12 this month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">8</p>
                  <p className="text-sm text-muted-foreground">Pending Invoices</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                <span>$24,500 outstanding</span>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">$45,800</p>
                  <p className="text-sm text-muted-foreground">Total Credits Balance</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                <span>Across 42 clients</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="credits">Credits & Recharges</TabsTrigger>
            <TabsTrigger value="usage">Usage Monitoring</TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {subscriptionPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={cn(
                    "shadow-card relative",
                    plan.popular && "border-primary ring-1 ring-primary"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2">
                      {plan.clients} active clients
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full mt-6">
                      Edit Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end">
              <Dialog open={isCreatePlanOpen} onOpenChange={handleCreatePlanClose}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {planWizardStep === 1 && "Create New Plan - Basic Info"}
                      {planWizardStep === 2 && "Create New Plan - Limits & Channels"}
                      {planWizardStep === 3 && "Create New Plan - Features"}
                    </DialogTitle>
                    <DialogDescription>
                      Step {planWizardStep} of 3
                    </DialogDescription>
                  </DialogHeader>

                  {/* Step 1: Basic Info */}
                  {planWizardStep === 1 && (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="plan-name">Plan Name</Label>
                        <Input
                          id="plan-name"
                          placeholder="e.g., Business Pro"
                          value={newPlan.name}
                          onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="plan-price">Price (USD)</Label>
                          <Input
                            id="plan-price"
                            type="number"
                            placeholder="499"
                            value={newPlan.price}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, price: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plan-period">Billing Period</Label>
                          <Select
                            value={newPlan.period}
                            onValueChange={(value) => setNewPlan(prev => ({ ...prev, period: value }))}
                          >
                            <SelectTrigger id="plan-period">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="month">Monthly</SelectItem>
                              <SelectItem value="year">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Limits & Channels */}
                  {planWizardStep === 2 && (
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="user-seats">User Seats</Label>
                          <Input
                            id="user-seats"
                            type="number"
                            placeholder="25"
                            value={newPlan.userSeats}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, userSeats: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="conversations">Conversations/mo</Label>
                          <Input
                            id="conversations"
                            type="number"
                            placeholder="50000"
                            value={newPlan.conversations}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, conversations: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Channels</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Chat", "Email", "Voice", "SMS", "WhatsApp", "Social Media"].map((channel) => (
                            <Button
                              key={channel}
                              type="button"
                              variant={newPlan.channels.includes(channel) ? "default" : "outline"}
                              size="sm"
                              className="justify-start"
                              onClick={() => toggleChannel(channel)}
                            >
                              {newPlan.channels.includes(channel) && (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              {channel}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Features */}
                  {planWizardStep === 3 && (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Select Features</Label>
                        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                          {[
                            "Basic analytics",
                            "Advanced analytics",
                            "API access",
                            "Custom integrations",
                            "White-label",
                            "Priority support",
                            "Dedicated account manager",
                            "Custom SLA",
                            "SSO/SAML",
                            "Audit logs",
                          ].map((feature) => (
                            <Button
                              key={feature}
                              type="button"
                              variant={newPlan.features.includes(feature) ? "default" : "outline"}
                              size="sm"
                              className="justify-start"
                              onClick={() => toggleFeature(feature)}
                            >
                              {newPlan.features.includes(feature) && (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              {feature}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Summary */}
                      <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                        <h4 className="font-medium text-sm">Plan Summary</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Name:</strong> {newPlan.name || "—"}</p>
                          <p><strong>Price:</strong> ${newPlan.price || "0"}/{newPlan.period}</p>
                          <p><strong>Seats:</strong> {newPlan.userSeats || "0"}</p>
                          <p><strong>Channels:</strong> {newPlan.channels.join(", ") || "None selected"}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <DialogFooter className="flex gap-2">
                    {planWizardStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPlanWizardStep(prev => prev - 1)}
                      >
                        Back
                      </Button>
                    )}
                    {planWizardStep < 3 ? (
                      <Button
                        type="button"
                        onClick={() => setPlanWizardStep(prev => prev + 1)}
                        disabled={planWizardStep === 1 && (!newPlan.name || !newPlan.price)}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => {
                          // Build features list
                          const allFeatures = [
                            `${newPlan.userSeats || "0"} user seats`,
                            `${newPlan.conversations || "0"} conversations/mo`,
                            ...newPlan.channels,
                            ...newPlan.features,
                          ];
                          
                          // Add the new plan to the list
                          const planToAdd = {
                            id: newPlan.name.toLowerCase().replace(/\s+/g, "-"),
                            name: newPlan.name,
                            price: `$${newPlan.price}`,
                            period: `/${newPlan.period}`,
                            features: allFeatures,
                            clients: 0,
                          };
                          
                          setSubscriptionPlans(prev => [...prev, planToAdd]);
                          handleCreatePlanClose(false);
                        }}
                      >
                        Create Plan
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Invoice History</CardTitle>
                    <CardDescription>All invoices across clients</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search invoices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[250px] pl-9 bg-secondary/50 border-0"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Invoice</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                        <TableCell className="font-medium">{invoice.client}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-secondary">
                            {invoice.plan}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{invoice.amount}</TableCell>
                        <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={statusColors[invoice.status as keyof typeof statusColors]}
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Credits Tab */}
          <TabsContent value="credits" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Credit Management</h3>
                <p className="text-sm text-muted-foreground">Manage prepaid credits and balances</p>
              </div>
              <Dialog open={isAddCreditsOpen} onOpenChange={setIsAddCreditsOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Credits
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Credits to Client</DialogTitle>
                    <DialogDescription>
                      Add prepaid credits to a client account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Select Client</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose client..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acme">Acme Corporation</SelectItem>
                          <SelectItem value="techflow">TechFlow Inc</SelectItem>
                          <SelectItem value="global">Global Services Ltd</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input type="number" placeholder="Enter amount in USD" />
                    </div>
                    <div className="space-y-2">
                      <Label>Note (optional)</Label>
                      <Input placeholder="Add a note..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddCreditsOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddCreditsOpen(false)}>Add Credits</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Credit purchases, usage, and refunds</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditTransactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                        <TableCell className="font-medium">{txn.client}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              txn.type === "Purchase" && "bg-success/10 text-success",
                              txn.type === "Usage" && "bg-primary/10 text-primary",
                              txn.type === "Refund" && "bg-warning/10 text-warning"
                            )}
                          >
                            {txn.type}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={cn(
                            "font-medium",
                            txn.amount.startsWith("+") ? "text-success" : "text-foreground"
                          )}
                        >
                          {txn.amount}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{txn.date}</TableCell>
                        <TableCell className="font-medium">{txn.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Platform Usage Overview</CardTitle>
                <CardDescription>Monitor usage across all clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground">Total API Calls</p>
                    <p className="text-2xl font-semibold mt-1">24.8M</p>
                    <p className="text-sm text-success mt-2">+12% this month</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground">Conversation Minutes</p>
                    <p className="text-2xl font-semibold mt-1">892K</p>
                    <p className="text-sm text-success mt-2">+8% this month</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30">
                    <p className="text-sm text-muted-foreground">Active User Seats</p>
                    <p className="text-2xl font-semibold mt-1">2,847</p>
                    <p className="text-sm text-success mt-2">+342 this month</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="font-medium">Top Consumers</h4>
                  <div className="space-y-3">
                    {[
                      { name: "Global Services Ltd", usage: "89.1K", percent: 85 },
                      { name: "Acme Corporation", usage: "52.4K", percent: 65 },
                      { name: "HealthTech Solutions", usage: "34.2K", percent: 45 },
                      { name: "RetailMax", usage: "22.1K", percent: 30 },
                    ].map((client) => (
                      <div key={client.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{client.name}</span>
                          <span className="text-muted-foreground">{client.usage} conversations</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${client.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
