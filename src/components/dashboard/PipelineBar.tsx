import { StageData, STAGE_META, AwarenessStage } from "@/data/types";
import { useState } from "react";

interface PipelineBarProps {
  stages: StageData[];
  onStageClick: (stage: AwarenessStage) => void;
}

export function PipelineBar({ stages, onStageClick }: PipelineBarProps) {
  const total = stages.reduce((s, st) => s + st.count, 0);
  const [hovered, setHovered] = useState<AwarenessStage | null>(null);

  return (
    <section className="px-6 py-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Pipeline Distribution
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          {total.toLocaleString()} total contacts
        </span>
      </div>

      <div className="flex h-10 w-full rounded overflow-hidden gap-px">
        {stages.map(stage => {
          const pct = (stage.count / total) * 100;
          const meta = STAGE_META[stage.id];
          return (
            <button
              key={stage.id}
              onClick={() => onStageClick(stage.id)}
              onMouseEnter={() => setHovered(stage.id)}
              onMouseLeave={() => setHovered(null)}
              className={`${meta.color} relative transition-all hover:brightness-110 cursor-pointer`}
              style={{ width: `${pct}%` }}
            >
              {hovered === stage.id && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 bg-card border border-border px-2 py-1 rounded text-xs font-mono whitespace-nowrap shadow-lg text-foreground">
                  {meta.label}: {stage.count} ({pct.toFixed(1)}%)
                </div>
              )}
              {pct > 8 && (
                <span className="text-[10px] font-mono font-semibold text-white/90 drop-shadow">
                  {pct.toFixed(0)}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 mt-2">
        {stages.map(stage => (
          <div key={stage.id} className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-sm ${STAGE_META[stage.id].color}`} />
            <span className="text-[10px] font-mono text-muted-foreground">
              {STAGE_META[stage.id].label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
