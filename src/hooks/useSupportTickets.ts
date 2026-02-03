import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender: string;
  sender_type: string;
  content: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  client_name: string;
  client_email: string;
  client_company: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  ticket_messages?: TicketMessage[];
}

export const useSupportTickets = () => {
  return useQuery({
    queryKey: ["support_tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select(`
          *,
          ticket_messages (*)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as SupportTicket[];
    },
  });
};

export const useAddSupportTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ticket: Omit<SupportTicket, "id" | "created_at" | "updated_at" | "ticket_messages">) => {
      const { data, error } = await supabase
        .from("support_tickets")
        .insert([ticket])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support_tickets"] });
    },
    onError: (error) => {
      toast.error("Failed to create ticket: " + error.message);
    },
  });
};

export const useUpdateSupportTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SupportTicket> }) => {
      const { data, error } = await supabase
        .from("support_tickets")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support_tickets"] });
    },
    onError: (error) => {
      toast.error("Failed to update ticket: " + error.message);
    },
  });
};

export const useAddTicketMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (message: Omit<TicketMessage, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("ticket_messages")
        .insert([message])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support_tickets"] });
    },
    onError: (error) => {
      toast.error("Failed to send message: " + error.message);
    },
  });
};
