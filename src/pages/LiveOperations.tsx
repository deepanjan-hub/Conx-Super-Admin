import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Phone,
  PhoneOff,
  MessageSquare,
  Mail,
  Search,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  User,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Zap,
  Activity,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Simulated live data
const liveVoiceCalls = [
  {
    id: "call-001",
    client: "Acme Corporation",
    caller: "+1 (555) 123-4567",
    agent: "AI Agent - Sales",
    duration: "3:42",
    sentiment: "positive",
    status: "active",
    topic: "Product inquiry",
  },
  {
    id: "call-002",
    client: "TechFlow Inc",
    caller: "+1 (555) 987-6543",
    agent: "AI Agent - Support",
    duration: "1:18",
    sentiment: "neutral",
    status: "active",
    topic: "Technical support",
  },
  {
    id: "call-003",
    client: "Global Services Ltd",
    caller: "+44 20 7123 4567",
    agent: "AI Agent - Support",
    duration: "5:24",
    sentiment: "negative",
    status: "escalating",
    topic: "Billing dispute",
  },
  {
    id: "call-004",
    client: "HealthTech Solutions",
    caller: "+1 (555) 456-7890",
    agent: "Human Agent - Sarah",
    duration: "8:12",
    sentiment: "positive",
    status: "active",
    topic: "Account upgrade",
  },
];

const liveChats = [
  {
    id: "chat-001",
    client: "RetailMax",
    user: "john.customer@email.com",
    agent: "AI Agent - Sales",
    messages: 12,
    sentiment: "positive",
    status: "active",
    lastMessage: "I'd like to know more about the enterprise plan",
  },
  {
    id: "chat-002",
    client: "Acme Corporation",
    user: "support@acme.com",
    agent: "AI Agent - Support",
    messages: 8,
    sentiment: "neutral",
    status: "active",
    lastMessage: "Can you help me reset my password?",
  },
  {
    id: "chat-003",
    client: "StartupXYZ",
    user: "ceo@startupxyz.co",
    agent: "Human Agent - Mike",
    messages: 24,
    sentiment: "positive",
    status: "active",
    lastMessage: "This is exactly what we needed!",
  },
];

const liveEmails = [
  {
    id: "email-001",
    client: "FinanceHub",
    from: "operations@financehub.com",
    subject: "Integration assistance needed",
    agent: "AI Agent",
    status: "processing",
    priority: "high",
  },
  {
    id: "email-002",
    client: "TechFlow Inc",
    from: "billing@techflow.io",
    subject: "Invoice clarification request",
    agent: "AI Agent",
    status: "drafting",
    priority: "medium",
  },
  {
    id: "email-003",
    client: "Global Services Ltd",
    from: "support@globalservices.com",
    subject: "Feature request for dashboard",
    agent: "Awaiting review",
    status: "pending",
    priority: "low",
  },
];

const sentimentColors = {
  positive: "bg-success/10 text-success",
  neutral: "bg-secondary text-muted-foreground",
  negative: "bg-destructive/10 text-destructive",
};

const statusColors = {
  active: "bg-success/10 text-success",
  escalating: "bg-warning/10 text-warning",
  processing: "bg-primary/10 text-primary",
  drafting: "bg-primary/10 text-primary",
  pending: "bg-secondary text-muted-foreground",
};

const LiveOperations = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <DashboardLayout title="Live Operations" subtitle="Real-time monitoring of active conversations">
      <div className="space-y-6 animate-fade-in">
        {/* Live Status Bar */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/5 to-success/5 border">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={cn(
                "h-3 w-3 rounded-full",
                isLive ? "bg-success animate-pulse" : "bg-muted-foreground"
              )} />
            </div>
            <div>
              <p className="font-medium">
                {isLive ? "Live Monitoring Active" : "Monitoring Paused"}
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isLive ? "Pause" : "Resume"}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Calls</p>
                  <p className="text-2xl font-semibold">{liveVoiceCalls.length}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Chats</p>
                  <p className="text-2xl font-semibold">{liveChats.length}</p>
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
                  <p className="text-sm text-muted-foreground">Emails Queue</p>
                  <p className="text-2xl font-semibold">{liveEmails.length}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Mail className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Escalations</p>
                  <p className="text-2xl font-semibold">1</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                  <p className="text-2xl font-semibold">12s</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Feeds */}
        <Tabs defaultValue="voice" className="space-y-4">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="voice" className="gap-2">
              <Phone className="h-4 w-4" />
              Voice Calls ({liveVoiceCalls.length})
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat Sessions ({liveChats.length})
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              Email Queue ({liveEmails.length})
            </TabsTrigger>
          </TabsList>

          {/* Voice Calls Tab */}
          <TabsContent value="voice" className="space-y-4">
            <div className="grid gap-4">
              {liveVoiceCalls.map((call) => (
                <Card key={call.id} className="shadow-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Phone className="h-6 w-6 text-primary" />
                          </div>
                          {call.status === "active" && (
                            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-success border-2 border-background animate-pulse" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{call.caller}</p>
                            <Badge
                              variant="secondary"
                              className={sentimentColors[call.sentiment as keyof typeof sentimentColors]}
                            >
                              {call.sentiment}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {call.client} • {call.topic}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Agent</p>
                          <p className="font-medium">{call.agent}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-mono font-medium">{call.duration}</p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={statusColors[call.status as keyof typeof statusColors]}
                        >
                          {call.status}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Headphones className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          {call.status === "escalating" && (
                            <Button size="sm" className="gap-1">
                              <ArrowRight className="h-4 w-4" />
                              Transfer
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Voice waveform simulation */}
                    <div className="mt-4 flex items-center gap-1 h-8">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1 rounded-full bg-primary/30 transition-all",
                            call.status === "active" && "animate-pulse"
                          )}
                          style={{
                            height: `${Math.random() * 100}%`,
                            animationDelay: `${i * 50}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chat Sessions Tab */}
          <TabsContent value="chat" className="space-y-4">
            <div className="grid gap-4">
              {liveChats.map((chat) => (
                <Card key={chat.id} className="shadow-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-success/10 text-success">
                              <MessageSquare className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-success border-2 border-background animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{chat.user}</p>
                            <Badge
                              variant="secondary"
                              className={sentimentColors[chat.sentiment as keyof typeof sentimentColors]}
                            >
                              {chat.sentiment}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{chat.client}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Agent</p>
                          <p className="font-medium">{chat.agent}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Messages</p>
                          <p className="font-medium">{chat.messages}</p>
                        </div>
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          Active
                        </Badge>
                        <Button variant="outline" size="sm" className="gap-1">
                          <MessageSquare className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-secondary/30">
                      <p className="text-sm text-muted-foreground">Latest message:</p>
                      <p className="text-sm mt-1">"{chat.lastMessage}"</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Email Queue Tab */}
          <TabsContent value="email" className="space-y-4">
            <div className="grid gap-4">
              {liveEmails.map((email) => (
                <Card key={email.id} className="shadow-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                          <Mail className="h-6 w-6 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium">{email.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            From: {email.from} • {email.client}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Handler</p>
                          <p className="font-medium">{email.agent}</p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            email.priority === "high" && "bg-destructive/10 text-destructive",
                            email.priority === "medium" && "bg-warning/10 text-warning",
                            email.priority === "low" && "bg-secondary text-muted-foreground"
                          )}
                        >
                          {email.priority} priority
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={statusColors[email.status as keyof typeof statusColors]}
                        >
                          {email.status}
                        </Badge>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Mail className="h-4 w-4" />
                          Open
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Agent Performance Quick View */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Agent Performance (Today)</CardTitle>
            <CardDescription>Real-time agent metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Resolution Rate</span>
                  <span className="font-medium">94.2%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">First Contact Resolution</span>
                  <span className="font-medium">87.5%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Customer Satisfaction</span>
                  <span className="font-medium">4.8/5</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Escalation Rate</span>
                  <span className="font-medium">5.8%</span>
                </div>
                <Progress value={6} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LiveOperations;
