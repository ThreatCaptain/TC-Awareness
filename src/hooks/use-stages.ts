import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getDateBounds } from "@/lib/date-ranges";
import { stageNumberToSlug } from "./use-awareness-stages";
import type { StageData, Contact, AwarenessStage, DateRange } from "@/data/types";

export function useStages(dateRange: DateRange) {
  return useQuery({
    queryKey: ["stages", dateRange],
    queryFn: async (): Promise<StageData[]> => {
      const { prevStart, prevEnd } = getDateBounds(dateRange);

      // 1. Current stage counts from the view
      const { data: pipeline, error: pipeErr } = await supabase
        .from("stage_pipeline")
        .select("*");
      if (pipeErr) throw pipeErr;

      // 2. All enriched contacts for the stage cards
      const { data: allContacts, error: cErr } = await supabase
        .from("contacts_enriched")
        .select("*");
      if (cErr) throw cErr;

      // 3. Previous-period counts: count transitions INTO each stage during prev period
      //    as a proxy for what the stage count looked like previously
      const { data: prevTransitions, error: tErr } = await supabase
        .from("stage_transitions")
        .select("to_stage_id")
        .gte("transitioned_at", prevStart.toISOString())
        .lte("transitioned_at", prevEnd.toISOString());
      if (tErr) throw tErr;

      // Build a map of stage_id -> number of transitions into it in prev period
      // We'll use this to estimate prevCount as (current - recent_in + recent_out)
      // Simpler: just compute prevCount as current_count - net_change_this_period
      const { data: recentTransitions, error: rtErr } = await supabase
        .from("stage_transitions")
        .select("from_stage_id, to_stage_id")
        .gte("transitioned_at", getDateBounds(dateRange).start.toISOString());
      if (rtErr) throw rtErr;

      // Get stage id->number mapping
      const { data: stages, error: sErr } = await supabase
        .from("awareness_stages")
        .select("id, stage_number")
        .order("stage_number");
      if (sErr) throw sErr;

      const stageIdToNumber = new Map(
        (stages ?? []).map((s) => [s.id, s.stage_number])
      );

      // Compute net change per stage in current period
      const netChange = new Map<number, number>();
      for (const t of recentTransitions ?? []) {
        const fromNum = t.from_stage_id ? stageIdToNumber.get(t.from_stage_id) : null;
        const toNum = stageIdToNumber.get(t.to_stage_id);
        if (fromNum) netChange.set(fromNum, (netChange.get(fromNum) ?? 0) - 1);
        if (toNum) netChange.set(toNum, (netChange.get(toNum) ?? 0) + 1);
      }

      // Group contacts by stage
      const contactsByStage = new Map<number, Contact[]>();
      for (const c of allContacts ?? []) {
        const sn = c.stage_number;
        if (sn == null) continue;
        if (!contactsByStage.has(sn)) contactsByStage.set(sn, []);
        contactsByStage.get(sn)!.push({
          id: c.id,
          name: `${c.first_name} ${c.last_name}`,
          company: c.company_name ?? "",
          stage: stageNumberToSlug(sn),
          icpScore: c.icp_fit ? 100 : 0,
          role: c.title ?? "",
          employeeCount: c.employee_count ?? 0,
          country: c.country ?? "",
        });
      }

      // Sort pipeline by stage_number and assemble StageData[]
      const sortedPipeline = [...(pipeline ?? [])].sort(
        (a, b) => a.stage_number - b.stage_number
      );

      return sortedPipeline.map((row) => {
        const slug = stageNumberToSlug(row.stage_number);
        const count = row.contact_count;
        const change = netChange.get(row.stage_number) ?? 0;
        const prevCount = Math.max(count - change, 0);

        return {
          id: slug,
          label: row.stage_name,
          count,
          prevCount: prevCount || 1, // avoid division by zero in % calc
          contacts: contactsByStage.get(row.stage_number) ?? [],
        };
      });
    },
  });
}
