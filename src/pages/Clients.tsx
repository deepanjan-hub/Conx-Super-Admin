import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Filter, Download, Eye, Edit, CreditCard, BarChart3, PauseCircle, PlayCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { ExportDialog } from "@/components/shared/ExportDialog";
import { useClients, useUpdateClient } from "@/hooks/useClients";
import { toast } from "sonner";

const planColors: Record<string, string> = {
  Starter: "bg-secondary text-secondary-foreground",
  Professional: "bg-primary/10 text-primary",
  Enterprise: "bg-accent text-accent-foreground border border-primary/20",
};

const statusColors: Record<string, string> = {
  Active: "bg-success/10 text-success",
  Suspended: "bg-destructive/10 text-destructive",
  Pending: "bg-warning/10 text-warning",
};

const exportColumns = ["Name", "Email", "Plan", "Status", "Users", "Conversations", "MRR", "Created"];

const Clients = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  
  const { data: clients = [], isLoading } = useClients();
  const updateClientMutation = useUpdateClient();

  const handleToggleSuspend = (e: React.MouseEvent, client: typeof clients[0]) => {
    e.stopPropagation();
    const newStatus = client.status === "Suspended" ? "Active" : "Suspended";
    updateClientMutation.mutate(
      { id: client.id, updates: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(
            newStatus === "Suspended" 
              ? `${client.name} has been suspended` 
              : `${client.name} has been reactivated`
          );
        },
      }
    );
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout title="Clients" subtitle="Manage enterprise client accounts">
      <div className="space-y-6 animate-fade-in">
        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[300px] pl-9 bg-secondary/50 border-0 focus-visible:ring-1"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => setIsExportDialogOpen(true)}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Clients Table */}
        <div className="rounded-xl border bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Client</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="text-right">Conversations</TableHead>
                <TableHead className="text-right">MRR</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="pr-6 w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Loader2 className="h-8 w-8 mb-2 animate-spin" />
                      <p>Loading clients...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Search className="h-8 w-8 mb-2 opacity-50" />
                      <p>{searchQuery ? "No clients match your search" : "No clients found"}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow 
                    key={client.id} 
                    className="group cursor-pointer"
                    onClick={() => handleViewDetails(client.id)}
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-medium">
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("font-medium", planColors[client.plan] || "")}>
                        {client.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn("font-medium", statusColors[client.status] || "")}
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{client.users}</TableCell>
                    <TableCell className="text-right font-medium">{client.conversations}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">
                      {client.mrr}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(client.created_at)}</TableCell>
                    <TableCell className="pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleViewDetails(client.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}?tab=edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}?tab=subscription`)}>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Manage Subscription
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}?tab=analytics`)}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className={client.status === "Suspended" ? "text-success" : "text-destructive"}
                            onClick={(e) => handleToggleSuspend(e, client)}
                          >
                            {client.status === "Suspended" ? (
                              <>
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Unsuspend Account
                              </>
                            ) : (
                              <>
                                <PauseCircle className="h-4 w-4 mr-2" />
                                Suspend Account
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Client Dialog */}
      <AddClientDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      {/* Export Dialog */}
      <ExportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        title="Export Clients"
        description="Export client data to a file"
        dataType="clients"
        columns={exportColumns}
      />
    </DashboardLayout>
  );
};

export default Clients;
