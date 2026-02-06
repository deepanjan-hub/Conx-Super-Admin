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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, MoreHorizontal, Filter, Download, Eye, Edit, CreditCard, BarChart3, PauseCircle, PlayCircle, Loader2, X } from "lucide-react";
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

const planOptions = ["Starter", "Professional", "Enterprise"];
const statusOptions = ["Active", "Suspended", "Pending"];

const exportColumns = ["Name", "Email", "Plan", "Status", "Users", "Conversations", "MRR", "Created"];

const Clients = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
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

  const togglePlanFilter = (plan: string) => {
    setSelectedPlans(prev => 
      prev.includes(plan) ? prev.filter(p => p !== plan) : [...prev, plan]
    );
  };

  const toggleStatusFilter = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSelectedPlans([]);
    setSelectedStatuses([]);
  };

  const activeFilterCount = selectedPlans.length + selectedStatuses.length;

  const filteredClients = clients.filter((client) => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlan = selectedPlans.length === 0 || selectedPlans.includes(client.plan);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(client.status);
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

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
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Filter className="h-4 w-4" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Filters</h4>
                    {activeFilterCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground">
                        Clear all
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Plan</p>
                    {planOptions.map((plan) => (
                      <label key={plan} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedPlans.includes(plan)}
                          onCheckedChange={() => togglePlanFilter(plan)}
                        />
                        <span className="text-sm">{plan}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
                    {statusOptions.map((status) => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={() => toggleStatusFilter(status)}
                        />
                        <span className="text-sm">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2">
                {selectedPlans.map((plan) => (
                  <Badge key={plan} variant="secondary" className="gap-1 pr-1">
                    {plan}
                    <button onClick={() => togglePlanFilter(plan)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedStatuses.map((status) => (
                  <Badge key={status} variant="secondary" className="gap-1 pr-1">
                    {status}
                    <button onClick={() => toggleStatusFilter(status)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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
