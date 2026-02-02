import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ChannelMetrics } from "@/components/dashboard/ChannelMetrics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { DollarSign, TrendingUp, Users, MessageSquare, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sentimentData = [
  { month: "Jan", positive: 68, neutral: 22, negative: 10 },
  { month: "Feb", positive: 72, neutral: 20, negative: 8 },
  { month: "Mar", positive: 70, neutral: 21, negative: 9 },
  { month: "Apr", positive: 75, neutral: 18, negative: 7 },
  { month: "May", positive: 78, neutral: 16, negative: 6 },
  { month: "Jun", positive: 82, neutral: 13, negative: 5 },
];

const conversationData = [
  { day: "Mon", voice: 12400, chat: 18200, email: 4200 },
  { day: "Tue", voice: 14200, chat: 19800, email: 5100 },
  { day: "Wed", voice: 15800, chat: 21400, email: 4800 },
  { day: "Thu", voice: 13200, chat: 17600, email: 4400 },
  { day: "Fri", voice: 11800, chat: 16200, email: 3900 },
  { day: "Sat", voice: 6200, chat: 8400, email: 2100 },
  { day: "Sun", voice: 4800, chat: 6200, email: 1800 },
];

const topClients = [
  { name: "Global Services Ltd", conversations: "89.1K", growth: 12.4 },
  { name: "Acme Corporation", conversations: "52.4K", growth: 8.2 },
  { name: "HealthTech Solutions", conversations: "34.2K", growth: 15.8 },
  { name: "RetailMax", conversations: "22.1K", growth: -2.3 },
  { name: "TechFlow Inc", conversations: "18.2K", growth: 5.6 },
];

const Analytics = () => {
  return (
    <DashboardLayout title="Analytics" subtitle="Platform-wide performance insights">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue (MRR)"
            value="$112,450"
            change="+18.2% from last month"
            changeType="positive"
            icon={DollarSign}
            iconColor="text-success"
          />
          <StatsCard
            title="Active Users"
            value="2,847"
            change="+342 this month"
            changeType="positive"
            icon={Users}
            iconColor="text-primary"
          />
          <StatsCard
            title="Total Conversations"
            value="1.24M"
            change="+8.1% this week"
            changeType="positive"
            icon={MessageSquare}
            iconColor="text-primary"
          />
          <StatsCard
            title="Avg. CSAT Score"
            value="4.7/5"
            change="+0.2 from last quarter"
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-success"
          />
        </div>

        {/* Revenue & Channel Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <ChannelMetrics />
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="conversations" className="space-y-4">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
            <TabsTrigger value="clients">Top Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="conversations" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Weekly Conversation Volume</CardTitle>
                <CardDescription>Breakdown by channel type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
                      <XAxis
                        dataKey="day"
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
                        formatter={(value: number) => [value.toLocaleString(), ""]}
                      />
                      <Bar dataKey="voice" name="Voice" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="chat" name="Chat" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="email" name="Email" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">Voice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success" />
                    <span className="text-sm text-muted-foreground">Chat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-warning" />
                    <span className="text-sm text-muted-foreground">Email</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Sentiment Trends</CardTitle>
                <CardDescription>Monthly sentiment distribution across all channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sentimentData}>
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
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(0, 0%, 100%)",
                          border: "1px solid hsl(220, 13%, 91%)",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value: number) => [`${value}%`, ""]}
                      />
                      <Line
                        type="monotone"
                        dataKey="positive"
                        name="Positive"
                        stroke="hsl(142, 76%, 36%)"
                        strokeWidth={2}
                        dot={{ fill: "hsl(142, 76%, 36%)" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="neutral"
                        name="Neutral"
                        stroke="hsl(220, 9%, 46%)"
                        strokeWidth={2}
                        dot={{ fill: "hsl(220, 9%, 46%)" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="negative"
                        name="Negative"
                        stroke="hsl(0, 72%, 51%)"
                        strokeWidth={2}
                        dot={{ fill: "hsl(0, 72%, 51%)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success" />
                    <span className="text-sm text-muted-foreground">Positive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Neutral</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive" />
                    <span className="text-sm text-muted-foreground">Negative</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Top Performing Clients</CardTitle>
                <CardDescription>Ranked by conversation volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topClients.map((client, index) => (
                    <div
                      key={client.name}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{client.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {client.conversations} conversations
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {client.growth > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-success" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-destructive" />
                        )}
                        <span
                          className={
                            client.growth > 0 ? "text-success font-medium" : "text-destructive font-medium"
                          }
                        >
                          {Math.abs(client.growth)}%
                        </span>
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

export default Analytics;