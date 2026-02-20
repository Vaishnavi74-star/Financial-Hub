import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertTransaction } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useTransactions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: transactions, isLoading } = useQuery({
    queryKey: [api.transactions.list.path],
    queryFn: async () => {
      const res = await fetch(api.transactions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return api.transactions.list.responses[200].parse(await res.json());
    },
  });

  const createTransaction = useMutation({
    mutationFn: async (data: InsertTransaction) => {
      const validated = api.transactions.create.input.parse(data);
      const res = await fetch(api.transactions.create.path, {
        method: api.transactions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create transaction");
      return api.transactions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.reports.monthly.path] });
      queryClient.invalidateQueries({ queryKey: [api.reports.category.path] });
      toast({ title: "Success", description: "Transaction added successfully." });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.transactions.delete.path, { id });
      const res = await fetch(url, {
        method: api.transactions.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete transaction");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.reports.monthly.path] });
      queryClient.invalidateQueries({ queryKey: [api.reports.category.path] });
      toast({ title: "Deleted", description: "Transaction removed." });
    },
  });

  return {
    transactions,
    isLoading,
    createTransaction,
    deleteTransaction,
  };
}
