import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useReports() {
  const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
    queryKey: [api.reports.category.path],
    queryFn: async () => {
      const res = await fetch(api.reports.category.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch category report");
      return api.reports.category.responses[200].parse(await res.json());
    },
  });

  const { data: monthlyData, isLoading: isLoadingMonthly } = useQuery({
    queryKey: [api.reports.monthly.path],
    queryFn: async () => {
      const res = await fetch(api.reports.monthly.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch monthly report");
      return api.reports.monthly.responses[200].parse(await res.json());
    },
  });

  return {
    categoryData,
    monthlyData,
    isLoading: isLoadingCategory || isLoadingMonthly,
  };
}
