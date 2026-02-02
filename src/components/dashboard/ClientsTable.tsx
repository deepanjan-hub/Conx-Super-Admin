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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  plan: "Starter" | "Professional" | "Enterprise";
  status: "Active" | "Suspended" | "Pending";
  users: number;
  conversations: string;
  mrr: string;
}

const clients: Client[] = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "admin@acme.com",
    plan: "Enterprise",
    status: "Active",
    users: 145,
    conversations: "52.4K",
    mrr: "$12,500",
  },
  {
    id: "2",
    name: "TechFlow Inc",
    email: "team@techflow.io",
    plan: "Professional",
    status: "Active",
    users: 48,
    conversations: "18.2K",
    mrr: "$4,200",
  },
  {
    id: "3",
    name: "Global Services Ltd",
    email: "support@globalservices.com",
    plan: "Enterprise",
    status: "Active",
    users: 312,
    conversations: "89.1K",
    mrr: "$24,000",
  },
  {
    id: "4",
    name: "StartupXYZ",
    email: "hello@startupxyz.co",
    plan: "Starter",
    status: "Pending",
    users: 8,
    conversations: "1.2K",
    mrr: "$299",
  },
  {
    id: "5",
    name: "FinanceHub",
    email: "ops@financehub.com",
    plan: "Professional",
    status: "Suspended",
    users: 24,
    conversations: "5.8K",
    mrr: "$0",
  },
];

const planColors = {
  Starter: "bg-secondary text-secondary-foreground",
  Professional: "bg-primary/10 text-primary",
  Enterprise: "bg-accent text-accent-foreground border border-primary/20",
};

const statusColors = {
  Active: "bg-success/10 text-success",
  Suspended: "bg-destructive/10 text-destructive",
  Pending: "bg-warning/10 text-warning",
};

export function ClientsTable() {
  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Clients</h3>
          <p className="text-sm text-muted-foreground">Manage and monitor client accounts</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          View All <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-6">Client</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Users</TableHead>
            <TableHead className="text-right">Conversations</TableHead>
            <TableHead className="text-right">MRR</TableHead>
            <TableHead className="pr-6 w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} className="group cursor-pointer">
              <TableCell className="pl-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-medium">
                      {client.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={cn("font-medium", planColors[client.plan])}>
                  {client.plan}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={cn("font-medium", statusColors[client.status])}>
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">{client.users}</TableCell>
              <TableCell className="text-right font-medium">{client.conversations}</TableCell>
              <TableCell className="text-right font-semibold text-foreground">{client.mrr}</TableCell>
              <TableCell className="pr-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Client</DropdownMenuItem>
                    <DropdownMenuItem>Manage Subscription</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Suspend Account</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}