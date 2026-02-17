import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ContentStrategyItem, ContentStatus } from "@/data/types";

export function useContentStrategy(stageFilter?: number | null) {
  return useQuery({
    queryKey: ["content-strategy", stageFilter],
    queryFn: async (): Promise<ContentStrategyItem[]> => {
      let query = supabase
        .from("content_strategy_items")
        .select("*")
        .order("sort_order", { ascending: true });

      if (stageFilter) {
        query = query.eq("target_stage", stageFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        content_type: row.content_type,
        target_stage: row.target_stage,
        status: row.status as ContentStatus,
        platform: row.platform,
        scheduled_date: row.scheduled_date,
        posted_date: row.posted_date,
        sort_order: row.sort_order,
        notes: row.notes,
      }));
    },
  });
}

export function useUpdateStrategyStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      sort_order,
    }: {
      id: string;
      status: ContentStatus;
      sort_order?: number;
    }) => {
      const updates: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (status === "posted") {
        updates.posted_date = new Date().toISOString().split("T")[0];
      }
      if (sort_order !== undefined) {
        updates.sort_order = sort_order;
      }
      const { error } = await supabase
        .from("content_strategy_items")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content-strategy"] });
    },
  });
}

export interface AddStrategyItemInput {
  title: string;
  description?: string;
  content_type: string;
  target_stage: number;
  status?: ContentStatus;
  platform?: string;
  scheduled_date?: string;
  notes?: string;
}

export function useAddStrategyItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddStrategyItemInput) => {
      // Get highest sort_order for the status column
      const { data: maxRow } = await supabase
        .from("content_strategy_items")
        .select("sort_order")
        .eq("status", input.status ?? "idea")
        .order("sort_order", { ascending: false })
        .limit(1)
        .single();

      const sort_order = (maxRow?.sort_order ?? 0) + 1;

      const { error } = await supabase.from("content_strategy_items").insert({
        ...input,
        sort_order,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content-strategy"] });
    },
  });
}

export function useDeleteStrategyItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("content_strategy_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content-strategy"] });
    },
  });
}
