import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SocialPlatform, SocialPostMetric } from "@/data/types";

export function useSocialPlatforms() {
  return useQuery({
    queryKey: ["social-platforms"],
    queryFn: async (): Promise<SocialPlatform[]> => {
      const { data, error } = await supabase
        .from("social_platforms")
        .select("*")
        .order("platform_name");

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        platform_name: row.platform_name as SocialPlatform["platform_name"],
        account_handle: row.account_handle,
        is_connected: row.is_connected ?? false,
        followers_count: row.followers_count ?? 0,
      }));
    },
  });
}

export function useTogglePlatformConnection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      is_connected,
    }: {
      id: string;
      is_connected: boolean;
    }) => {
      const { error } = await supabase
        .from("social_platforms")
        .update({ is_connected, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social-platforms"] });
    },
  });
}

export function useAddSocialPlatform() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      platform_name: string;
      account_handle: string;
    }) => {
      const { error } = await supabase
        .from("social_platforms")
        .insert({ ...input, is_connected: true });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social-platforms"] });
    },
  });
}

export function useSocialMetricsForItem(strategyItemId: string | null) {
  return useQuery({
    queryKey: ["social-metrics", strategyItemId],
    enabled: !!strategyItemId,
    queryFn: async (): Promise<
      (SocialPostMetric & { platform_name: string; account_handle: string })[]
    > => {
      const { data, error } = await supabase
        .from("social_post_metrics")
        .select("*, social_platforms(platform_name, account_handle)")
        .eq("strategy_item_id", strategyItemId!);

      if (error) throw error;

      return (data ?? []).map((row) => {
        const platform = row.social_platforms as unknown as {
          platform_name: string;
          account_handle: string;
        } | null;
        return {
          id: row.id,
          strategy_item_id: row.strategy_item_id,
          platform_id: row.platform_id,
          impressions: row.impressions ?? 0,
          reach: row.reach ?? 0,
          likes: row.likes ?? 0,
          comments: row.comments ?? 0,
          shares: row.shares ?? 0,
          clicks: row.clicks ?? 0,
          engagement_rate: row.engagement_rate ?? 0,
          platform_name: platform?.platform_name ?? "Unknown",
          account_handle: platform?.account_handle ?? "",
        };
      });
    },
  });
}

export function useAggregatedSocialMetrics() {
  return useQuery({
    queryKey: ["social-metrics-aggregated"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_post_metrics")
        .select("*, social_platforms(platform_name)");

      if (error) throw error;

      const byPlatform: Record<
        string,
        {
          impressions: number;
          reach: number;
          likes: number;
          comments: number;
          shares: number;
          clicks: number;
          posts: number;
          avg_engagement: number;
        }
      > = {};

      for (const row of data ?? []) {
        const platform = row.social_platforms as unknown as {
          platform_name: string;
        } | null;
        const name = platform?.platform_name ?? "Unknown";
        if (!byPlatform[name]) {
          byPlatform[name] = {
            impressions: 0,
            reach: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            clicks: 0,
            posts: 0,
            avg_engagement: 0,
          };
        }
        byPlatform[name].impressions += row.impressions ?? 0;
        byPlatform[name].reach += row.reach ?? 0;
        byPlatform[name].likes += row.likes ?? 0;
        byPlatform[name].comments += row.comments ?? 0;
        byPlatform[name].shares += row.shares ?? 0;
        byPlatform[name].clicks += row.clicks ?? 0;
        byPlatform[name].posts += 1;
        byPlatform[name].avg_engagement += row.engagement_rate ?? 0;
      }

      // Calculate averages
      for (const name of Object.keys(byPlatform)) {
        if (byPlatform[name].posts > 0) {
          byPlatform[name].avg_engagement =
            Math.round(
              (byPlatform[name].avg_engagement / byPlatform[name].posts) * 10
            ) / 10;
        }
      }

      return byPlatform;
    },
  });
}
