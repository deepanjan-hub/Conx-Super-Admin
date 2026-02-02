import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
  TrendingUp,
  TrendingDown,
  Minus,
  Phone,
  MessageSquare,
  Mail,
  Search,
  Filter,
  Download,
  Calendar,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Conversation {
  id: string;
  type: "voice" | "chat" | "email";
  client: string;
  customer: string;
  sentiment: "positive" | "neutral" | "negative";
  score: number;
  duration: string;
  timestamp: string;
  summary: string;
}

const conversations: Conversation[] = [
  {
    id: "1",
    type: "voice",
    client: "Acme Corporation",
    customer: "John Smith",
    sentiment: "positive",
    score: 0.85,
    duration: "5:32",
    timestamp: "2 min ago",
    summary: "Customer satisfied with product support",
  },
  {
    id: "2",
    type: "chat",
    client: "TechFlow Inc",
    customer: "Sarah Johnson",
    sentiment: "neutral",
    score: 0.52,
    duration: "8:15",
    timestamp: "15 min ago",
    summary: "General inquiry about pricing",
  },
  {
    id: "3",
    type: "email",
    client: "Global Services",
    customer: "Michael Chen",
    sentiment: "negative",
    score: 0.23,
    duration: "—",
    timestamp: "32 min ago",
    summary: "Complaint about delayed shipment",
  },
  {
    id: "4",
    type: "voice",
    client: "HealthTech",
    customer: "Emily Davis",
    sentiment: "positive",
    score: 0.91,
    duration: "3:45",
    timestamp: "1 hour ago",
    summary: "Happy with new feature rollout",
  },
  {
    id: "5",
    type: "chat",
    client: "RetailMax",
    customer: "Robert Wilson",
    sentiment: "negative",
    score: 0.18,
    duration: "12:08",
    timestamp: "2 hours ago",
    summary: "Frustrated with refund process",
  },
];

const trendData = [
  { date: "Jan 1", positive: 65, neutral: 25, negative: 10 },
  { date: "Jan 8", positive: 68, neutral: 22, negative: 10 },
  { date: "Jan 15", positive: 62, neutral: 28, negative: 10 },
  { date: "Jan 22", positive: 70, neutral: 20, negative: 10 },
  { date: "Jan 29", positive: 72, neutral: 18, negative: 10 },
  { date: "Feb 5", positive: 68, neutral: 22, negative: 10 },
  { date: "Feb 12", positive: 75, neutral: 17, negative: 8 },
];

const pieData = [
  { name: "Positive", value: 65, color: "hsl(var(--success))" },
  { name: "Neutral", value: 25, color: "hsl(var(--warning))" },
  { name: "Negative", value: 10, color: "hsl(var(--destructive))" },
];

const channelData = [
  { channel: "Voice", positive: 72, neutral: 18, negative: 10 },
  { channel: "Chat", positive: 65, neutral: 25, negative: 10 },
  { channel: "Email", positive: 58, neutral: 30, negative: 12 },
];

const sentimentStyles = {
  positive: { icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
  neutral: { icon: Minus, color: "text-warning", bg: "bg-warning/10" },
  negative: { icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10" },
};

const channelIcons = {
  voice: Phone,
  chat: MessageSquare,
  email: Mail,
};

const SentimentAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSentiment = sentimentFilter === "all" || conv.sentiment === sentimentFilter;
    const matchesChannel = channelFilter === "all" || conv.type === channelFilter;
    return matchesSearch && matchesSentiment && matchesChannel;
  });

  const positiveCount = conversations.filter((c) => c.sentiment === "positive").length;
  const neutralCount = conversations.filter((c) => c.sentiment === "neutral").length;
  const negativeCount = conversations.filter((c) => c.sentiment === "negative").length;
  const avgScore = (conversations.reduce((sum, c) => sum + c.score, 0) / conversations.length * 100).toFixed(0);

  return (
    <DashboardLayout title="Sentiment Analysis" subtitle="Monitor conversation sentiment across all channels">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{positiveCount}</p>
                  <p className="text-sm text-muted-foreground">Positive</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <Minus className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{neutralCount}</p>
                  <p className="text-sm text-muted-foreground">Neutral</p>
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
                  <p className="text-sm text-muted-foreground">Negative</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgScore}%</p>
                  <p className="text-sm text-muted-foreground">Avg. Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="conversations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="channels">By Channel</TabsTrigger>
          </TabsList>

          <TabsContent value="conversations" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[300px] pl-9"
                  />
                </div>
                <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiments</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="voice">Voice</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Conversations Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Channel</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConversations.map((conv) => {
                    const ChannelIcon = channelIcons[conv.type];
                    const sentiment = sentimentStyles[conv.sentiment];
                    const SentimentIcon = sentiment.icon;
                    return (
                      <TableRow key={conv.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-secondary">
                              <ChannelIcon className="h-4 w-4" />
                            </div>
                            <span className="capitalize">{conv.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{conv.customer}</TableCell>
                        <TableCell>{conv.client}</TableCell>
                        <TableCell>
                          <Badge className={cn("gap-1", sentiment.bg, sentiment.color)}>
                            <SentimentIcon className="h-3 w-3" />
                            {conv.sentiment}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  conv.score > 0.6 && "bg-success",
                                  conv.score > 0.4 && conv.score <= 0.6 && "bg-warning",
                                  conv.score <= 0.4 && "bg-destructive"
                                )}
                                style={{ width: `${conv.score * 100}%` }}
                              />
                            </div>
                            <span className="text-sm">{(conv.score * 100).toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{conv.duration}</TableCell>
                        <TableCell className="text-muted-foreground">{conv.timestamp}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{conv.summary}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Trends</CardTitle>
                <CardDescription>Weekly sentiment distribution over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="positive"
                        stackId="1"
                        stroke="hsl(var(--success))"
                        fill="hsl(var(--success))"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="neutral"
                        stackId="1"
                        stroke="hsl(var(--warning))"
                        fill="hsl(var(--warning))"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="negative"
                        stackId="1"
                        stroke="hsl(var(--destructive))"
                        fill="hsl(var(--destructive))"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribution by Channel</CardTitle>
                  <CardDescription>Sentiment breakdown per communication channel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {channelData.map((channel) => {
                      const ChannelIcon = channelIcons[channel.channel.toLowerCase() as keyof typeof channelIcons];
                      return (
                        <div key={channel.channel} className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <ChannelIcon className="h-4 w-4" />
                            <span className="font-medium">{channel.channel}</span>
                          </div>
                          <div className="flex h-4 rounded-full overflow-hidden bg-secondary">
                            <div
                              className="bg-success"
                              style={{ width: `${channel.positive}%` }}
                              title={`Positive: ${channel.positive}%`}
                            />
                            <div
                              className="bg-warning"
                              style={{ width: `${channel.neutral}%` }}
                              title={`Neutral: ${channel.neutral}%`}
                            />
                            <div
                              className="bg-destructive"
                              style={{ width: `${channel.negative}%` }}
                              title={`Negative: ${channel.negative}%`}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Positive: {channel.positive}%</span>
                            <span>Neutral: {channel.neutral}%</span>
                            <span>Negative: {channel.negative}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Overall Distribution</CardTitle>
                  <CardDescription>Total sentiment breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">
                          {item.name}: {item.value}%
                        </span>
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

export default SentimentAnalysis;