import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { stageNumberToSlug } from "./use-awareness-stages";
import type { ContentRow, AwarenessStage } from "@/data/types";

export function useContentPerformance() {
  return useQuery({
    queryKey: ["content"],
    queryFn: async (): Promise<ContentRow[]> => {
      const { data, error } = await supabase
        .from("content_performance")
        .select("*");
      if (error) throw error;

      return (data ?? []).map((row) => {
        // stage_target is like "1 → 2"; extract the target_stage_to number
        const targetTo = row.stage_target
          ? parseInt(row.stage_target.split("→").pop()?.trim() ?? "1", 10)
          : 1;

        return {
          id: row.id,
          title: row.title,
          type: row.content_type,
          stageTarget: stageNumberToSlug(targetTo) as AwarenessStage,
          views: row.views,
          engagements: row.engagements,
          stageMoves: row.stage_moves,
          conversionPct: Number(row.conversion_pct),
        };
      });
    },
  });
}

export interface AddContentInput {
  title: string;
  content_type: string;
  target_stage_from: number | null;
  target_stage_to: number | null;
  url?: string;
  views?: number;
  engagements?: number;
  stage_moves?: number;
  is_active?: boolean;
  published_at?: string;
}

export function useAddContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddContentInput) => {
      const { error } = await supabase.from("content_pieces").insert(input);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export interface UpdateContentInput {
  id: string;
  title?: string;
  content_type?: string;
  target_stage_from?: number | null;
  target_stage_to?: number | null;
  url?: string;
  views?: number;
  engagements?: number;
  stage_moves?: number;
  is_active?: boolean;
  published_at?: string;
}

export function useUpdateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateContentInput) => {
      const { error } = await supabase
        .from("content_pieces")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
    },
  });
}
