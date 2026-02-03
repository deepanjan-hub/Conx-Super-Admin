import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BillingPlan {
  id: string;
  name: string;
  price: string;
  description: string[];
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

export const useBillingPlans = () => {
  return useQuery({
    queryKey: ["billing_plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("billing_plans")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data as BillingPlan[];
    },
  });
};

export const useAddBillingPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (plan: Omit<BillingPlan, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("billing_plans")
        .insert([plan])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing_plans"] });
      toast.success("Plan created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create plan: " + error.message);
    },
  });
};

export const useUpdateBillingPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BillingPlan> }) => {
      const { data, error } = await supabase
        .from("billing_plans")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing_plans"] });
      toast.success("Plan updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update plan: " + error.message);
    },
  });
};

export const useDeleteBillingPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("billing_plans")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing_plans"] });
      toast.success("Plan deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete plan: " + error.message);
    },
  });
};
