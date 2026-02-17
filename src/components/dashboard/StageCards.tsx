import { StageData, STAGE_META, AwarenessStage } from "@/data/types";
import { TrendingUp, TrendingDown, Eye, AlertTriangle, Lightbulb, Package, Star } from "lucide-react";

const stageIcons: Record<AwarenessStage, React.ElementType> = {
  unaware: Eye,
  problem: AlertTriangle,
  solution: Lightbulb,
  product: Package,
  most: Star,
};

interface StageCardsProps {
  stages: StageData[];
  highlightedStage: AwarenessStage | null;
}

export function StageCards({ stages, highlightedStage }: StageCardsProps) {
  return (
    <section className="px-6 py-2">
      <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
        Stage Breakdown
      </h2>
      <div className="grid grid-cols-5 gap-3">
        {stages.map(stage => {
          const meta = STAGE_META[stage.id];
          const Icon = stageIcons[stage.id];
          const change = ((stage.count - stage.prevCount) / stage.prevCount) * 100;
          const isUp = change >= 0;

          return (
            <div
              key={stage.id}
              id={`stage-${stage.id}`}
              className={`rounded border bg-card p-4 transition-all ${
                highlightedStage === stage.id
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 rounded flex items-center justify-center ${meta.color}/20`}>
                    <Icon size={14} className={`text-stage-${stage.id}`} style={{ color: `hsl(var(--stage-${stage.id}))` }} />
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wide">
                    {meta.label}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-mono font-bold text-foreground">
                  {stage.count}
                </span>
                <span className={`flex items-center gap-0.5 text-xs font-mono ${isUp ? "text-stage-most" : "text-destructive"}`}>
                  {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(change).toFixed(1)}%
                </span>
              </div>

              <div className="border-t border-border pt-2 mt-2 space-y-1.5">
                {stage.contacts.slice(0, 3).map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="truncate">
                      <span className="text-[11px] text-foreground font-medium">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">· {c.company}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-2 text-[10px] font-mono text-primary hover:underline">
                View all →
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
