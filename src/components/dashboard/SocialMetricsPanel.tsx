import {
  useSocialPlatforms,
  useAggregatedSocialMetrics,
} from "@/hooks/use-social-platforms";
import { Eye, MousePointerClick, Heart, Share2, MessageSquare, TrendingUp } from "lucide-react";

const PLATFORM_COLORS: Record<string, string> = {
  LinkedIn: "border-l-[#0A66C2]",
  Twitter: "border-l-foreground",
  Facebook: "border-l-[#1877F2]",
  Instagram: "border-l-[#E4405F]",
  YouTube: "border-l-[#FF0000]",
  TikTok: "border-l-foreground",
};

export function SocialMetricsPanel() {
  const { data: platforms } = useSocialPlatforms();
  const { data: metrics, isLoading } = useAggregatedSocialMetrics();

  const connectedPlatforms = (platforms ?? []).filter((p) => p.is_connected);

  if (connectedPlatforms.length === 0) {
    return (
      <section className="px-6 py-4">
        <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
          Social Platform Metrics
        </h2>
        <div className="rounded border border-border bg-card/50 p-6 text-center">
          <p className="text-xs font-mono text-muted-foreground">
            No platforms connected. Use the Platforms button above to connect
            your social accounts.
          </p>
        </div>
      </section>
    );
  }

  if (isLoading || !metrics) {
    return (
      <section className="px-6 py-4">
        <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
          Social Platform Metrics
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 bg-muted/20 rounded animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  // Only show metrics for connected platforms
  const connectedNames = new Set(connectedPlatforms.map((p) => p.platform_name));
  const displayMetrics = Object.entries(metrics).filter(([name]) =>
    connectedNames.has(name)
  );

  // Calculate totals
  const totals = displayMetrics.reduce(
    (acc, [, m]) => ({
      impressions: acc.impressions + m.impressions,
      reach: acc.reach + m.reach,
      likes: acc.likes + m.likes,
      comments: acc.comments + m.comments,
      shares: acc.shares + m.shares,
      clicks: acc.clicks + m.clicks,
    }),
    { impressions: 0, reach: 0, likes: 0, comments: 0, shares: 0, clicks: 0 }
  );

  return (
    <section className="px-6 py-4" id="social-metrics">
      <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
        Social Platform Metrics
      </h2>

      {/* Totals row */}
      <div className="grid grid-cols-6 gap-2 mb-3">
        {[
          { icon: Eye, label: "Impressions", value: totals.impressions },
          { icon: MousePointerClick, label: "Reach", value: totals.reach },
          { icon: Heart, label: "Likes", value: totals.likes },
          { icon: MessageSquare, label: "Comments", value: totals.comments },
          { icon: Share2, label: "Shares", value: totals.shares },
          { icon: MousePointerClick, label: "Clicks", value: totals.clicks },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded border border-border bg-card/50 p-2.5 text-center"
          >
            <stat.icon
              size={12}
              className="mx-auto mb-1 text-muted-foreground"
            />
            <p className="text-sm font-mono text-foreground font-medium">
              {stat.value.toLocaleString()}
            </p>
            <p className="text-[9px] font-mono text-muted-foreground uppercase mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Per-platform breakdown */}
      <div className="grid grid-cols-2 gap-3">
        {displayMetrics.map(([name, m]) => (
          <div
            key={name}
            className={`rounded border border-border bg-card/50 p-3 border-l-2 ${
              PLATFORM_COLORS[name] ?? ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-medium text-foreground">
                {name}
              </span>
              <div className="flex items-center gap-1">
                <TrendingUp size={10} className="text-stage-most" />
                <span className="text-xs font-mono text-stage-most">
                  {m.avg_engagement}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Impr.", value: m.impressions },
                { label: "Reach", value: m.reach },
                { label: "Clicks", value: m.clicks },
                { label: "Likes", value: m.likes },
                { label: "Shares", value: m.shares },
                { label: "Posts", value: m.posts },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[9px] font-mono text-muted-foreground uppercase">
                    {stat.label}
                  </p>
                  <p className="text-xs font-mono text-foreground">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
