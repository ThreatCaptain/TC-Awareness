import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CompanyRow {
  id: string;
  name: string;
  employee_count: number | null;
  country: string | null;
}

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async (): Promise<CompanyRow[]> => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, employee_count, country")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
}
