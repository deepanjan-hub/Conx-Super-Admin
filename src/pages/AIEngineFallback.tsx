import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  ArrowUpDown,
  Brain,
  CheckCircle,
  Clock,
  Mic,
  RefreshCw,
  Save,
  Settings2,
  Volume2,
  Zap,
  XCircle,
  TrendingUp,
  Shield,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data for AI engines
const aiEngines = {
  stt: [
    { id: "whisper", name: "OpenAI Whisper", status: "healthy", latency: 145, threshold: 300, uptime: 99.97, priority: 1 },
    { id: "deepgram", name: "Deepgram Nova", status: "healthy", latency: 98, threshold: 200, uptime: 99.99, priority: 2 },
    { id: "azure-stt", name: "Azure Speech", status: "degraded", latency: 287, threshold: 250, uptime: 98.5, priority: 3 },
    { id: "google-stt", name: "Google Speech-to-Text", status: "healthy", latency: 156, threshold: 300, uptime: 99.85, priority: 4 },
  ],
  tts: [
    { id: "elevenlabs", name: "ElevenLabs", status: "healthy", latency: 234, threshold: 400, uptime: 99.95, priority: 1 },
    { id: "azure-tts", name: "Azure Neural TTS", status: "healthy", latency: 178, threshold: 300, uptime: 99.98, priority: 2 },
    { id: "google-tts", name: "Google Cloud TTS", status: "healthy", latency: 145, threshold: 250, uptime: 99.92, priority: 3 },
    { id: "amazon-polly", name: "Amazon Polly", status: "down", latency: 0, threshold: 350, uptime: 94.2, priority: 4 },
  ],
  llm: [
    { id: "openai", name: "OpenAI GPT-4o", status: "healthy", latency: 1245, threshold: 2000, uptime: 99.95, priority: 1 },
    { id: "anthropic", name: "Anthropic Claude 3.5", status: "healthy", latency: 1456, threshold: 2500, uptime: 99.97, priority: 2 },
    { id: "gemini", name: "Google Gemini Pro", status: "degraded", latency: 2134, threshold: 2000, uptime: 98.8, priority: 3 },
    { id: "llama", name: "Meta Llama 3 (Self-hosted)", status: "healthy", latency: 890, threshold: 1500, uptime: 99.5, priority: 4 },
  ],
};

// Mock tenant configurations
const tenantConfigs = [
  { id: "1", name: "Acme Corp", preferredLLM: "openai", preferredSTT: "whisper", preferredTTS: "elevenlabs", fallbackEnabled: true },
  { id: "2", name: "TechFlow Inc", preferredLLM: "anthropic", preferredSTT: "deepgram", preferredTTS: "azure-tts", fallbackEnabled: true },
  { id: "3", name: "GlobalBank", preferredLLM: "openai", preferredSTT: "azure-stt", preferredTTS: "azure-tts", fallbackEnabled: false },
  { id: "4", name: "HealthPlus", preferredLLM: "gemini", preferredSTT: "google-stt", preferredTTS: "google-tts", fallbackEnabled: true },
  { id: "5", name: "RetailMax", preferredLLM: "llama", preferredSTT: "whisper", preferredTTS: "amazon-polly", fallbackEnabled: true },
];

// Mock failover events
const failoverEvents = [
  { id: "1", timestamp: "2024-01-15 14:32:05", fromEngine: "Azure Speech", toEngine: "Deepgram Nova", type: "STT", reason: "Latency threshold exceeded (287ms > 250ms)", duration: "2m 34s" },
  { id: "2", timestamp: "2024-01-15 12:15:22", fromEngine: "Amazon Polly", toEngine: "ElevenLabs", type: "TTS", reason: "Service unavailable", duration: "15m 45s" },
  { id: "3", timestamp: "2024-01-15 09:45:11", fromEngine: "Google Gemini", toEngine: "OpenAI GPT-4o", type: "LLM", reason: "Latency threshold exceeded (2134ms > 2000ms)", duration: "5m 12s" },
  { id: "4", timestamp: "2024-01-14 22:18:33", fromEngine: "ElevenLabs", toEngine: "Azure Neural TTS", type: "TTS", reason: "Rate limit exceeded", duration: "1m 08s" },
  { id: "5", timestamp: "2024-01-14 18:05:47", fromEngine: "OpenAI Whisper", toEngine: "Deepgram Nova", type: "STT", reason: "Intermittent connectivity", duration: "45s" },
];

const statusConfig = {
  healthy: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Healthy" },
  degraded: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Degraded" },
  down: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Down" },
};

const AIEngineFallback = () => {
  const [globalFallbackEnabled, setGlobalFallbackEnabled] = useState(true);
  const [autoRecovery, setAutoRecovery] = useState(true);
  const [healthCheckInterval, setHealthCheckInterval] = useState([30]);
  const [selectedTab, setSelectedTab] = useState("monitoring");

  const getLatencyColor = (latency: number, threshold: number) => {
    const ratio = latency / threshold;
    if (ratio < 0.6) return "text-success";
    if (ratio < 0.85) return "text-warning";
    return "text-destructive";
  };

  const getLatencyProgress = (latency: number, threshold: number) => {
    return Math.min((latency / threshold) * 100, 100);
  };

  const renderEngineTable = (engines: typeof aiEngines.stt, type: string) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Priority</TableHead>
          <TableHead>Engine</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Latency</TableHead>
          <TableHead>Threshold</TableHead>
          <TableHead>Uptime</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {engines.map((engine) => {
          const config = statusConfig[engine.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;
          return (
            <TableRow key={engine.id}>
              <TableCell>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary font-semibold text-sm">
                  {engine.priority}
                </div>
              </TableCell>
              <TableCell className="font-medium">{engine.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <StatusIcon className={cn("h-4 w-4", config.color)} />
                  <span className={config.color}>{config.label}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className={cn("font-mono text-sm", getLatencyColor(engine.latency, engine.threshold))}>
                      {engine.latency}ms
                    </span>
                  </div>
                  <Progress 
                    value={getLatencyProgress(engine.latency, engine.threshold)} 
                    className="h-1.5"
                  />
                </div>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground">{engine.threshold}ms</span>
              </TableCell>
              <TableCell>
                <span className={cn(
                  "font-medium",
                  engine.uptime >= 99.9 ? "text-success" : engine.uptime >= 99 ? "text-warning" : "text-destructive"
                )}>
                  {engine.uptime}%
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  const handleSaveConfiguration = () => {
    toast.success("AI Engine configuration saved successfully");
  };

  const handleRefreshHealth = () => {
    toast.info("Refreshing health status for all engines...");
  };

  return (
    <DashboardLayout 
      title="AI Engine Fallback" 
      subtitle="Latency monitoring and intelligent failover management"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Global Status Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                  <Activity className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">System Status</p>
                  <p className="text-2xl font-bold text-success">Operational</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Engines</p>
                  <p className="text-2xl font-bold">10/12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                  <RefreshCw className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Failovers (24h)</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <TrendingUp className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold">156ms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Global Fallback Settings</CardTitle>
                  <CardDescription>Configure system-wide failover behavior</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefreshHealth}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Health
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                <div>
                  <Label className="text-base">Enable Automatic Fallback</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically switch to backup engines when thresholds are breached
                  </p>
                </div>
                <Switch 
                  checked={globalFallbackEnabled} 
                  onCheckedChange={setGlobalFallbackEnabled}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                <div>
                  <Label className="text-base">Auto Recovery</Label>
                  <p className="text-sm text-muted-foreground">
                    Return to primary engine when it becomes healthy
                  </p>
                </div>
                <Switch 
                  checked={autoRecovery} 
                  onCheckedChange={setAutoRecovery}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Health Check Interval</Label>
                <span className="text-sm text-muted-foreground font-mono">{healthCheckInterval[0]}s</span>
              </div>
              <Slider
                value={healthCheckInterval}
                onValueChange={setHealthCheckInterval}
                min={10}
                max={120}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10s (Aggressive)</span>
                <span>60s (Balanced)</span>
                <span>120s (Conservative)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="monitoring" className="gap-2">
              <Activity className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="priority" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Priority Routing
            </TabsTrigger>
            <TabsTrigger value="tenants" className="gap-2">
              <Building2 className="h-4 w-4" />
              Tenant Config
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              Failover History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-4">
            {/* STT Engines */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mic className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Speech-to-Text Engines</CardTitle>
                    <CardDescription>Real-time latency and health monitoring</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderEngineTable(aiEngines.stt, "STT")}
              </CardContent>
            </Card>

            {/* TTS Engines */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <Volume2 className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <CardTitle>Text-to-Speech Engines</CardTitle>
                    <CardDescription>Real-time latency and health monitoring</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderEngineTable(aiEngines.tts, "TTS")}
              </CardContent>
            </Card>

            {/* LLM Engines */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                    <Brain className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <CardTitle>LLM Engines</CardTitle>
                    <CardDescription>Real-time latency and health monitoring</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderEngineTable(aiEngines.llm, "LLM")}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="priority" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Priority-Based Routing Configuration</CardTitle>
                <CardDescription>
                  Configure the order in which engines are tried during failover. Lower priority numbers are tried first.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  {/* STT Priority */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Mic className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">STT Priority</h4>
                    </div>
                    <div className="space-y-2">
                      {aiEngines.stt.sort((a, b) => a.priority - b.priority).map((engine, index) => (
                        <div key={engine.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium flex-1">{engine.name}</span>
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground cursor-move" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TTS Priority */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5 text-success" />
                      <h4 className="font-semibold">TTS Priority</h4>
                    </div>
                    <div className="space-y-2">
                      {aiEngines.tts.sort((a, b) => a.priority - b.priority).map((engine, index) => (
                        <div key={engine.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-success/10 text-success text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium flex-1">{engine.name}</span>
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground cursor-move" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* LLM Priority */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-warning" />
                      <h4 className="font-semibold">LLM Priority</h4>
                    </div>
                    <div className="space-y-2">
                      {aiEngines.llm.sort((a, b) => a.priority - b.priority).map((engine, index) => (
                        <div key={engine.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-warning/10 text-warning text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium flex-1">{engine.name}</span>
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground cursor-move" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Threshold Configuration</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>STT Latency Threshold (ms)</Label>
                      <Input type="number" defaultValue={300} />
                    </div>
                    <div className="space-y-2">
                      <Label>TTS Latency Threshold (ms)</Label>
                      <Input type="number" defaultValue={400} />
                    </div>
                    <div className="space-y-2">
                      <Label>LLM Latency Threshold (ms)</Label>
                      <Input type="number" defaultValue={2000} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenants" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Tenant-Level AI Provider Configuration</CardTitle>
                <CardDescription>
                  Configure preferred AI providers for each tenant. Tenants can have custom failover preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Preferred LLM</TableHead>
                      <TableHead>Preferred STT</TableHead>
                      <TableHead>Preferred TTS</TableHead>
                      <TableHead>Fallback Enabled</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenantConfigs.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell className="font-medium">{tenant.name}</TableCell>
                        <TableCell>
                          <Select defaultValue={tenant.preferredLLM}>
                            <SelectTrigger className="w-[160px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {aiEngines.llm.map((engine) => (
                                <SelectItem key={engine.id} value={engine.id}>
                                  {engine.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={tenant.preferredSTT}>
                            <SelectTrigger className="w-[160px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {aiEngines.stt.map((engine) => (
                                <SelectItem key={engine.id} value={engine.id}>
                                  {engine.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={tenant.preferredTTS}>
                            <SelectTrigger className="w-[160px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {aiEngines.tts.map((engine) => (
                                <SelectItem key={engine.id} value={engine.id}>
                                  {engine.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Switch defaultChecked={tenant.fallbackEnabled} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Settings2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Failover Event History</CardTitle>
                <CardDescription>
                  Recent automatic failover events and their resolution details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {failoverEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-mono text-sm">{event.timestamp}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn(
                            event.type === "STT" && "bg-primary/10 text-primary",
                            event.type === "TTS" && "bg-success/10 text-success",
                            event.type === "LLM" && "bg-warning/10 text-warning"
                          )}>
                            {event.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-destructive">{event.fromEngine}</TableCell>
                        <TableCell className="text-success">{event.toEngine}</TableCell>
                        <TableCell className="max-w-[250px] truncate" title={event.reason}>
                          {event.reason}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.duration}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="gap-2" onClick={handleSaveConfiguration}>
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIEngineFallback;
