import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LeadMagnetData, DateRange } from "@/data/types";

export function useLeadMagnetData(dateRange: DateRange) {
  return useQuery({
    queryKey: ["leadMagnet", dateRange],
    queryFn: async (): Promise<LeadMagnetData> => {
      // Get the two most recent rows for current / previous comparison
      const { data, error } = await supabase
        .from("lead_magnet_metrics")
        .select("*")
        .order("date", { ascending: false })
        .limit(2);
      if (error) throw error;

      const current = data?.[0];
      const previous = data?.[1];

      if (!current) {
        return {
          betaSignups: 0,
          prevBetaSignups: 0,
          activationRate: 0,
          leadsGenerated: 0,
          goal: 50,
        };
      }

      const activationRate =
        current.total_beta_signups > 0
          ? Math.round(
              (current.activated_count / current.total_beta_signups) * 100
            )
          : 0;

      return {
        betaSignups: current.total_beta_signups,
        prevBetaSignups: previous?.total_beta_signups ?? 0,
        activationRate,
        leadsGenerated: current.total_leads_generated,
        goal: current.beta_target,
      };
    },
  });
}
