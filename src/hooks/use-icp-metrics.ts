import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ICPMetric } from "@/data/types";

const TARGET_TITLES = ["MSP Owner", "Sales Director", "vCISO Practice Lead", "vCISO"];

export function useICPMetrics() {
  return useQuery({
    queryKey: ["icpMetrics"],
    queryFn: async (): Promise<ICPMetric[]> => {
      // Compute live from contacts_enriched
      const { data: contacts, error } = await supabase
        .from("contacts_enriched")
        .select("title, employee_count, country");
      if (error) throw error;

      const total = contacts?.length ?? 0;
      if (total === 0) {
        return [
          { label: "MSP Owners / Sales Directors / vCISO", value: 0, target: 80 },
          { label: "10–100 Employee Range", value: 0, target: 70 },
          { label: "US-Based", value: 0, target: 90 },
        ];
      }

      const titleMatch = contacts!.filter((c) =>
        TARGET_TITLES.some((t) =>
          c.title?.toLowerCase().includes(t.toLowerCase())
        )
      ).length;

      const sizeMatch = contacts!.filter(
        (c) =>
          c.employee_count != null &&
          c.employee_count >= 10 &&
          c.employee_count <= 100
      ).length;

      const usMatch = contacts!.filter(
        (c) => c.country?.toUpperCase() === "US"
      ).length;

      return [
        {
          label: "MSP Owners / Sales Directors / vCISO",
          value: Math.round((titleMatch / total) * 100),
          target: 80,
        },
        {
          label: "10–100 Employee Range",
          value: Math.round((sizeMatch / total) * 100),
          target: 70,
        },
        {
          label: "US-Based",
          value: Math.round((usMatch / total) * 100),
          target: 90,
        },
      ];
    },
  });
}
