import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Download,
  Filter,
  User,
  Settings,
  Eye,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const auditLogs = [
  {
    id: "1",
    user: "admin@qubelabs.ai",
    action: "Updated LLM configuration",
    resource: "Platform Config",
    timestamp: "2 minutes ago",
    status: "success",
    ip: "192.168.1.45",
  },
  {
    id: "2",
    user: "ops@qubelabs.ai",
    action: "Suspended client account",
    resource: "FinanceHub",
    timestamp: "15 minutes ago",
    status: "success",
    ip: "192.168.1.32",
  },
  {
    id: "3",
    user: "admin@qubelabs.ai",
    action: "Failed login attempt",
    resource: "Authentication",
    timestamp: "1 hour ago",
    status: "failed",
    ip: "203.0.113.42",
  },
  {
    id: "4",
    user: "security@qubelabs.ai",
    action: "Exported compliance report",
    resource: "Reports",
    timestamp: "3 hours ago",
    status: "success",
    ip: "192.168.1.67",
  },
  {
    id: "5",
    user: "ops@qubelabs.ai",
    action: "Modified billing settings",
    resource: "Subscription",
    timestamp: "5 hours ago",
    status: "success",
    ip: "192.168.1.32",
  },
];

const fraudAlerts = [
  {
    id: "1",
    type: "Unusual Activity",
    client: "StartupXYZ",
    description: "Spike in API calls detected (500% increase)",
    severity: "medium",
    timestamp: "10 minutes ago",
    status: "investigating",
  },
  {
    id: "2",
    type: "Suspicious Login",
    client: "TechFlow Inc",
    description: "Login attempt from new geographic location",
    severity: "low",
    timestamp: "2 hours ago",
    status: "resolved",
  },
  {
    id: "3",
    type: "Data Access",
    client: "HealthTech Solutions",
    description: "Bulk data export request outside normal hours",
    severity: "high",
    timestamp: "1 day ago",
    status: "resolved",
  },
];

const complianceItems = [
  { name: "GDPR Compliance", status: "compliant", lastAudit: "Jan 15, 2024" },
  { name: "AI Act Compliance", status: "compliant", lastAudit: "Feb 1, 2024" },
  { name: "Data Retention Policy", status: "compliant", lastAudit: "Jan 28, 2024" },
  { name: "Consent Management", status: "review", lastAudit: "Dec 10, 2023" },
  { name: "Security Audit", status: "compliant", lastAudit: "Feb 5, 2024" },
];

const severityColors = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
};

const statusColors = {
  investigating: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
  open: "bg-destructive/10 text-destructive",
};

const complianceColors = {
  compliant: "bg-success/10 text-success",
  review: "bg-warning/10 text-warning",
  "non-compliant": "bg-destructive/10 text-destructive",
};

const Security = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState("audit");

  useEffect(() => {
    if (tabParam && ["audit", "fraud", "compliance"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <DashboardLayout title="Security & Compliance" subtitle="Audit logs, fraud detection, and compliance monitoring">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">98.5%</p>
                  <p className="text-sm text-muted-foreground">Security Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">1,247</p>
                  <p className="text-sm text-muted-foreground">Audit Events Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">5/5</p>
                  <p className="text-sm text-muted-foreground">Compliant Areas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="audit">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Audit Trail</CardTitle>
                    <CardDescription>Immutable log of all platform activities</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search logs..."
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
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-sm font-medium">{log.user}</span>
                          </div>
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="text-muted-foreground">{log.resource}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{log.ip}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-sm">{log.timestamp}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              log.status === "success" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                            )}
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fraud">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Fraud Alerts</CardTitle>
                    <CardDescription>Detected anomalies and suspicious activities</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fraudAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg",
                            alert.severity === "high" && "bg-destructive/10",
                            alert.severity === "medium" && "bg-warning/10",
                            alert.severity === "low" && "bg-success/10"
                          )}
                        >
                          <AlertTriangle
                            className={cn(
                              "h-5 w-5",
                              alert.severity === "high" && "text-destructive",
                              alert.severity === "medium" && "text-warning",
                              alert.severity === "low" && "text-success"
                            )}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{alert.type}</p>
                            <Badge
                              variant="secondary"
                              className={severityColors[alert.severity as keyof typeof severityColors]}
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Client: {alert.client}</span>
                            <span>{alert.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={statusColors[alert.status as keyof typeof statusColors]}
                      >
                        {alert.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Compliance Overview</CardTitle>
                    <CardDescription>Regulatory compliance status and audit history</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceItems.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Last audit: {item.lastAudit}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={complianceColors[item.status as keyof typeof complianceColors]}
                        >
                          {item.status === "review" ? "Needs Review" : "Compliant"}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
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

export default Security;