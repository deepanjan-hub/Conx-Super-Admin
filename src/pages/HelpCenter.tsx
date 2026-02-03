import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  ArrowLeft,
  Building2,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "client" | "admin";
  senderName: string;
  content: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  subject: string;
  clientName: string;
  clientEmail: string;
  status: "open" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Unable to configure voice channels",
    clientName: "Acme Corporation",
    clientEmail: "support@acme.com",
    status: "open",
    priority: "high",
    createdAt: "2024-06-10 09:30",
    updatedAt: "2024-06-10 14:22",
    messages: [
      {
        id: "1",
        sender: "client",
        senderName: "John Smith",
        content: "We're having trouble setting up voice channels. The configuration keeps failing with an error about API limits.",
        timestamp: "2024-06-10 09:30",
      },
      {
        id: "2",
        sender: "admin",
        senderName: "Super Admin",
        content: "Hi John, I can see the issue. Your current plan has a limit on concurrent voice channels. Let me check your account settings.",
        timestamp: "2024-06-10 10:15",
      },
      {
        id: "3",
        sender: "client",
        senderName: "John Smith",
        content: "Thank you! We definitely need more channels for our team. What are our options?",
        timestamp: "2024-06-10 14:22",
      },
    ],
  },
  {
    id: "TKT-002",
    subject: "Billing discrepancy on last invoice",
    clientName: "TechFlow Inc",
    clientEmail: "billing@techflow.io",
    status: "in_progress",
    priority: "medium",
    createdAt: "2024-06-09 15:45",
    updatedAt: "2024-06-10 11:00",
    messages: [
      {
        id: "1",
        sender: "client",
        senderName: "Sarah Lee",
        content: "Our latest invoice shows charges for 75K conversations, but our dashboard only shows 52K. Can you please review?",
        timestamp: "2024-06-09 15:45",
      },
      {
        id: "2",
        sender: "admin",
        senderName: "Super Admin",
        content: "Hi Sarah, thanks for bringing this to our attention. I'm investigating the discrepancy now and will get back to you within 24 hours.",
        timestamp: "2024-06-09 16:30",
      },
    ],
  },
  {
    id: "TKT-003",
    subject: "Request for API documentation",
    clientName: "Global Services Ltd",
    clientEmail: "dev@globalservices.com",
    status: "resolved",
    priority: "low",
    createdAt: "2024-06-08 11:20",
    updatedAt: "2024-06-09 09:15",
    messages: [
      {
        id: "1",
        sender: "client",
        senderName: "Mike Chen",
        content: "Where can I find the latest API documentation for the webhook integrations?",
        timestamp: "2024-06-08 11:20",
      },
      {
        id: "2",
        sender: "admin",
        senderName: "Super Admin",
        content: "Hi Mike! You can find all API documentation at docs.voiceai.com/api. I've also sent you an invite to our developer portal.",
        timestamp: "2024-06-08 14:00",
      },
      {
        id: "3",
        sender: "client",
        senderName: "Mike Chen",
        content: "Perfect, got it! Thank you so much for the quick response.",
        timestamp: "2024-06-09 09:15",
      },
    ],
  },
  {
    id: "TKT-004",
    subject: "Integration with Salesforce failing",
    clientName: "RetailMax",
    clientEmail: "it@retailmax.com",
    status: "open",
    priority: "high",
    createdAt: "2024-06-10 08:00",
    updatedAt: "2024-06-10 08:00",
    messages: [
      {
        id: "1",
        sender: "client",
        senderName: "Emma Wilson",
        content: "Our Salesforce integration stopped working yesterday. Leads are not syncing and we're losing valuable data. This is urgent!",
        timestamp: "2024-06-10 08:00",
      },
    ],
  },
  {
    id: "TKT-005",
    subject: "Feature request: Custom reporting",
    clientName: "HealthTech Solutions",
    clientEmail: "product@healthtech.io",
    status: "in_progress",
    priority: "low",
    createdAt: "2024-06-07 10:30",
    updatedAt: "2024-06-08 16:45",
    messages: [
      {
        id: "1",
        sender: "client",
        senderName: "Dr. James Patel",
        content: "We would love to have custom reporting capabilities for HIPAA compliance. Is this something on your roadmap?",
        timestamp: "2024-06-07 10:30",
      },
      {
        id: "2",
        sender: "admin",
        senderName: "Super Admin",
        content: "Great suggestion, Dr. Patel! Custom reporting is indeed on our Q3 roadmap. I'll add your requirements to the feature spec.",
        timestamp: "2024-06-08 16:45",
      },
    ],
  },
];

const statusConfig = {
  open: { label: "Open", color: "bg-warning/10 text-warning", icon: AlertCircle },
  in_progress: { label: "In Progress", color: "bg-primary/10 text-primary", icon: Clock },
  resolved: { label: "Resolved", color: "bg-success/10 text-success", icon: CheckCircle },
};

const priorityConfig = {
  low: { label: "Low", color: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", color: "bg-warning/10 text-warning" },
  high: { label: "High", color: "bg-destructive/10 text-destructive" },
};

const HelpCenter = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [replyMessage, setReplyMessage] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "open") return matchesSearch && ticket.status === "open";
    if (activeTab === "in_progress") return matchesSearch && ticket.status === "in_progress";
    if (activeTab === "resolved") return matchesSearch && ticket.status === "resolved";
    return matchesSearch;
  });

  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length;

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "admin",
      senderName: "Super Admin",
      content: replyMessage,
      timestamp: new Date().toLocaleString(),
    };

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === selectedTicket.id
        ? {
            ...ticket,
            messages: [...ticket.messages, newMessage],
            updatedAt: new Date().toLocaleString(),
            status: ticket.status === "open" ? "in_progress" as const : ticket.status,
          }
        : ticket
    );

    setTickets(updatedTickets);
    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
      status: selectedTicket.status === "open" ? "in_progress" : selectedTicket.status,
    });
    setReplyMessage("");
  };

  const handleResolveTicket = () => {
    if (!selectedTicket) return;

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === selectedTicket.id
        ? { ...ticket, status: "resolved" as const, updatedAt: new Date().toLocaleString() }
        : ticket
    );

    setTickets(updatedTickets);
    setSelectedTicket({ ...selectedTicket, status: "resolved" });
  };

  const handleReopenTicket = () => {
    if (!selectedTicket) return;

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === selectedTicket.id
        ? { ...ticket, status: "open" as const, updatedAt: new Date().toLocaleString() }
        : ticket
    );

    setTickets(updatedTickets);
    setSelectedTicket({ ...selectedTicket, status: "open" });
  };

  return (
    <DashboardLayout title="Support Tickets" subtitle="Manage client support requests">
      <div className="h-[calc(100vh-180px)] animate-fade-in">
        {selectedTicket ? (
          // Ticket Detail View
          <Card className="h-full flex flex-col shadow-card">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTicket(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                      <Badge className={cn("text-xs", statusConfig[selectedTicket.status].color)}>
                        {statusConfig[selectedTicket.status].label}
                      </Badge>
                      <Badge className={cn("text-xs", priorityConfig[selectedTicket.priority].color)}>
                        {priorityConfig[selectedTicket.priority].label}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Building2 className="h-3 w-3" />
                      {selectedTicket.clientName} • {selectedTicket.clientEmail}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedTicket.status !== "resolved" ? (
                    <Button variant="outline" onClick={handleResolveTicket}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Resolved
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={handleReopenTicket}>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Reopen Ticket
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.sender === "admin" && "flex-row-reverse"
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={cn(
                          message.sender === "admin" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-secondary"
                        )}>
                          {message.sender === "admin" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            message.senderName.charAt(0)
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg p-3",
                          message.sender === "admin"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{message.senderName}</span>
                          <span className={cn(
                            "text-xs",
                            message.sender === "admin" 
                              ? "text-primary-foreground/70" 
                              : "text-muted-foreground"
                          )}>
                            {message.timestamp}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Reply Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="min-h-[80px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                  />
                  <Button onClick={handleSendReply} className="self-end">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Ticket List View
          <div className="space-y-4 h-full flex flex-col">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                      <MessageCircle className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{tickets.length}</p>
                      <p className="text-sm text-muted-foreground">Total Tickets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
                      <AlertCircle className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{openCount}</p>
                      <p className="text-sm text-muted-foreground">Open</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{inProgressCount}</p>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{resolvedCount}</p>
                      <p className="text-sm text-muted-foreground">Resolved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tickets List */}
            <Card className="shadow-card flex-1 flex flex-col overflow-hidden">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Support Tickets</CardTitle>
                    <CardDescription>Client support requests and conversations</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="px-6 pt-4">
                  <TabsList>
                    <TabsTrigger value="all">All ({tickets.length})</TabsTrigger>
                    <TabsTrigger value="open">Open ({openCount})</TabsTrigger>
                    <TabsTrigger value="in_progress">In Progress ({inProgressCount})</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved ({resolvedCount})</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={activeTab} className="flex-1 overflow-hidden m-0">
                  <ScrollArea className="h-full">
                    <div className="p-6 space-y-2">
                      {filteredTickets.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No tickets found</p>
                        </div>
                      ) : (
                        filteredTickets.map((ticket) => {
                          const StatusIcon = statusConfig[ticket.status].icon;
                          return (
                            <div
                              key={ticket.id}
                              onClick={() => setSelectedTicket(ticket)}
                              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-secondary/20 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "flex h-10 w-10 items-center justify-center rounded-lg",
                                  statusConfig[ticket.status].color
                                )}>
                                  <StatusIcon className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{ticket.subject}</p>
                                    <Badge variant="outline" className="text-xs">
                                      {ticket.id}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {ticket.clientName} • {ticket.messages.length} messages
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge className={cn("text-xs", priorityConfig[ticket.priority].color)}>
                                  {priorityConfig[ticket.priority].label}
                                </Badge>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">{ticket.updatedAt}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HelpCenter;
