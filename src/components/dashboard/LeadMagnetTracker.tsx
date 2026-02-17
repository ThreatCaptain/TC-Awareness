import { LeadMagnetData } from "@/data/types";
import { TrendingUp } from "lucide-react";

interface LeadMagnetTrackerProps {
  data: LeadMagnetData;
}

export function LeadMagnetTracker({ data }: LeadMagnetTrackerProps) {
  const signupChange = ((data.betaSignups - data.prevBetaSignups) / data.prevBetaSignups) * 100;
  const goalPct = Math.min((data.betaSignups / data.goal) * 100, 100);

  const stats = [
    { label: "Beta Signups", value: data.betaSignups, sub: `+${signupChange.toFixed(1)}% WoW` },
    { label: "Activation Rate", value: `${data.activationRate}%`, sub: "Installed widget" },
    { label: "Leads Generated", value: data.leadsGenerated.toLocaleString(), sub: "Aggregate total" },
  ];

  return (
    <section className="px-6 py-4 pb-8">
      <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
        Lead Magnet — Breach Cost Calculator
      </h2>
      <div className="rounded border border-border bg-card p-4">
        <div className="grid grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label}>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">{s.label}</span>
              <div className="text-xl font-mono font-bold text-foreground mt-0.5">{s.value}</div>
              <span className="text-[10px] font-mono text-stage-most flex items-center gap-0.5">
                <TrendingUp size={10} /> {s.sub}
              </span>
            </div>
          ))}

          {/* Goal progress */}
          <div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Goal Progress</span>
            <div className="text-xl font-mono font-bold text-foreground mt-0.5">
              {data.betaSignups}/{data.goal}
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden mt-1.5">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${goalPct}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-muted-foreground">{goalPct.toFixed(0)}% complete</span>
          </div>
        </div>
      </div>
    </section>
  );
}
