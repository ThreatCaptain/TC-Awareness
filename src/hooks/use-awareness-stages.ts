import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AwarenessStage } from "@/data/types";

export interface AwarenessStageRow {
  id: string;
  stage_number: number;
  name: string;
  slug: AwarenessStage;
}

const STAGE_NUMBER_TO_SLUG: Record<number, AwarenessStage> = {
  1: "unaware",
  2: "problem",
  3: "solution",
  4: "product",
  5: "most",
};

export function stageNumberToSlug(stageNumber: number): AwarenessStage {
  return STAGE_NUMBER_TO_SLUG[stageNumber] ?? "unaware";
}

export function useAwarenessStages() {
  return useQuery({
    queryKey: ["awarenessStages"],
    queryFn: async (): Promise<AwarenessStageRow[]> => {
      const { data, error } = await supabase
        .from("awareness_stages")
        .select("id, stage_number, name")
        .order("stage_number");
      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        stage_number: row.stage_number,
        name: row.name,
        slug: stageNumberToSlug(row.stage_number),
      }));
    },
    staleTime: Infinity,
  });
}
