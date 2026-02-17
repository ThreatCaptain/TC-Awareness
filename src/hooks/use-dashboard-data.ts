import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { StageData, ContentRow, ICPMetric, LeadMagnetData, AwarenessStage } from "@/data/types";

type ICPMetricRow = Database["public"]["Tables"]["icp_metrics"]["Row"];
type LeadMagnetRow = Database["public"]["Tables"]["lead_magnet_metrics"]["Row"];

const STAGE_ID_MAP: Record<number, AwarenessStage> = {
  1: "unaware",
  2: "problem",
  3: "solution",
  4: "product",
  5: "most",
};

export function useStagePipeline() {
  return useQuery({
    queryKey: ["stage_pipeline"],
    queryFn: async (): Promise<StageData[]> => {
      const { data: pipeline, error: pipeErr } = await supabase
        .from("stage_pipeline")
        .select("*")
        .order("stage_number");

      if (pipeErr) throw pipeErr;

      const { data: contacts, error: conErr } = await supabase
        .from("contacts_enriched")
        .select("*");

      if (conErr) throw conErr;

      return (pipeline ?? []).map((row) => {
        const stageId = STAGE_ID_MAP[row.stage_number] ?? "unaware";
        const stageContacts = (contacts ?? [])
          .filter((c) => c.stage_number === row.stage_number)
          .map((c) => ({
            id: c.id,
            name: `${c.first_name} ${c.last_name}`,
            company: c.company_name ?? "",
            stage: stageId,
            icpScore: c.icp_fit ? 90 : 50,
            role: c.title ?? "",
            employeeCount: c.employee_count ?? 0,
            country: c.country ?? "",
          }));

        return {
          id: stageId,
          label: row.stage_name,
          count: Number(row.contact_count),
          prevCount: Math.round(Number(row.contact_count) * 0.9), // approximate previous
          contacts: stageContacts,
        };
      });
    },
  });
}

export function useContentPerformance() {
  return useQuery({
    queryKey: ["content_performance"],
    queryFn: async (): Promise<ContentRow[]> => {
      const { data, error } = await supabase
        .from("content_performance")
        .select("*");

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        type: row.content_type,
        stageTarget: (row.stage_target as AwarenessStage) ?? "unaware",
        views: row.views,
        engagements: row.engagements,
        stageMoves: row.stage_moves,
        conversionPct: Number(row.conversion_pct),
      }));
    },
  });
}

export function useICPMetrics() {
  return useQuery({
    queryKey: ["icp_metrics"],
    queryFn: async (): Promise<ICPMetric[]> => {
      const { data, error } = await supabase
        .from("icp_metrics" as any)
        .select("*")
        .order("date", { ascending: false })
        .limit(1);

      if (error) throw error;
      const row = (data as unknown as ICPMetricRow[])?.[0];
      if (!row) return [];

      return [
        { label: "MSP Owners / Sales Directors / vCISO", value: row.pct_target_titles ?? 0, target: 80 },
        { label: "10–100 Employee Range", value: row.pct_target_company_size ?? 0, target: 70 },
        { label: "US-Based", value: row.pct_us_based ?? 0, target: 90 },
      ];
    },
  });
}

export function useLeadMagnetMetrics() {
  return useQuery({
    queryKey: ["lead_magnet_metrics"],
    queryFn: async (): Promise<LeadMagnetData> => {
      const { data, error } = await supabase
        .from("lead_magnet_metrics" as any)
        .select("*")
        .order("date", { ascending: false })
        .limit(1);

      if (error) throw error;
      const row = (data as unknown as LeadMagnetRow[])?.[0];

      if (!row) {
        return { betaSignups: 0, prevBetaSignups: 0, activationRate: 0, leadsGenerated: 0, goal: 50 };
      }

      return {
        betaSignups: row.total_beta_signups,
        prevBetaSignups: row.total_beta_signups - row.signups_this_period,
        activationRate: row.activated_count > 0 ? Math.round((row.activated_count / row.total_beta_signups) * 100) : 0,
        leadsGenerated: row.total_leads_generated,
        goal: row.beta_target,
      };
    },
  });
}
