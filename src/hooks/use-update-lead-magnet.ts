import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UpdateLeadMagnetInput {
  total_beta_signups: number;
  signups_this_period: number;
  activated_count: number;
  total_leads_generated: number;
  beta_target: number;
  notes?: string;
}

export function useUpdateLeadMagnet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateLeadMagnetInput) => {
      const today = new Date().toISOString().split("T")[0];

      // Upsert for today's date
      const { error } = await supabase
        .from("lead_magnet_metrics")
        .upsert(
          {
            date: today,
            ...input,
          },
          { onConflict: "date" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leadMagnet"] });
    },
  });
}
