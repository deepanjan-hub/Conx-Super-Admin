import { create } from "zustand";

export interface Client {
  id: string;
  name: string;
  email: string;
  plan: "Starter" | "Professional" | "Enterprise";
  status: "Active" | "Suspended" | "Pending";
  users: number;
  conversations: string;
  mrr: string;
  createdAt: string;
}

interface ClientStore {
  clients: Client[];
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
}

const initialClients: Client[] = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "admin@acme.com",
    plan: "Enterprise",
    status: "Active",
    users: 145,
    conversations: "52.4K",
    mrr: "$12,500",
    createdAt: "Jan 15, 2024",
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
    createdAt: "Feb 3, 2024",
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
    createdAt: "Nov 22, 2023",
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
    createdAt: "Mar 10, 2024",
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
    createdAt: "Dec 8, 2023",
  },
  {
    id: "6",
    name: "HealthTech Solutions",
    email: "contact@healthtech.com",
    plan: "Enterprise",
    status: "Active",
    users: 89,
    conversations: "34.2K",
    mrr: "$18,000",
    createdAt: "Oct 5, 2023",
  },
  {
    id: "7",
    name: "RetailMax",
    email: "admin@retailmax.com",
    plan: "Professional",
    status: "Active",
    users: 56,
    conversations: "22.1K",
    mrr: "$5,800",
    createdAt: "Jan 28, 2024",
  },
  {
    id: "8",
    name: "EduLearn Platform",
    email: "support@edulearn.io",
    plan: "Starter",
    status: "Active",
    users: 15,
    conversations: "3.4K",
    mrr: "$599",
    createdAt: "Feb 14, 2024",
  },
];

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: initialClients.sort((a, b) => a.name.localeCompare(b.name)),
  
  addClient: (clientData) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
    };
    set((state) => ({
      clients: [...state.clients, newClient].sort((a, b) => a.name.localeCompare(b.name)),
    }));
  },
  
  updateClient: (id, updates) => {
    set((state) => ({
      clients: state.clients
        .map((client) => (client.id === id ? { ...client, ...updates } : client))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));
  },
  
  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    }));
  },
  
  getClientById: (id) => {
    return get().clients.find((client) => client.id === id);
  },
}));