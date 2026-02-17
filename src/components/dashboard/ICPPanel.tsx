import { ICPMetric } from "@/data/types";

interface ICPPanelProps {
  metrics: ICPMetric[];
}

export function ICPPanel({ metrics }: ICPPanelProps) {
  const overallScore = Math.round(
    metrics.reduce((sum, m) => sum + Math.min(m.value / m.target, 1) * 100, 0) / metrics.length
  );

  return (
    <section className="px-6 py-4">
      <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
        ICP Fit Score
      </h2>
      <div className="rounded border border-border bg-card p-4">
        <div className="flex items-center gap-6">
          {/* Overall score */}
          <div className="flex flex-col items-center justify-center border-r border-border pr-6">
            <span className="text-3xl font-mono font-bold text-foreground">{overallScore}</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Overall</span>
          </div>

          {/* Individual metrics */}
          <div className="flex-1 grid grid-cols-3 gap-4">
            {metrics.map(m => {
              const onTarget = m.value >= m.target;
              return (
                <div key={m.label}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[11px] text-muted-foreground">{m.label}</span>
                    <span className={`font-mono text-sm font-semibold ${onTarget ? "text-stage-most" : "text-primary"}`}>
                      {m.value}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${onTarget ? "bg-stage-most" : "bg-primary"}`}
                      style={{ width: `${Math.min((m.value / m.target) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground">
                    Target: {m.target}%+
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
