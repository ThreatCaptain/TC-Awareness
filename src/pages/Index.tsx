import { useState, useEffect } from "react";
import { AwarenessStage } from "@/data/types";
import { getDashboardData } from "@/data/dashboard-data";
import { useStagePipeline, useContentPerformance, useICPMetrics, useLeadMagnetMetrics } from "@/hooks/use-dashboard-data";
import { TopBar } from "@/components/dashboard/TopBar";
import { NavRail } from "@/components/dashboard/NavRail";
import { PipelineBar } from "@/components/dashboard/PipelineBar";
import { StageCards } from "@/components/dashboard/StageCards";
import { ContentTable } from "@/components/dashboard/ContentTable";
import { ICPPanel } from "@/components/dashboard/ICPPanel";
import { LeadMagnetTracker } from "@/components/dashboard/LeadMagnetTracker";

const Index = () => {
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "all">("month");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [highlightedStage, setHighlightedStage] = useState<AwarenessStage | null>(null);

  const fallback = getDashboardData(dateRange);

  const { data: dbStages } = useStagePipeline();
  const { data: dbContent } = useContentPerformance();
  const { data: dbICP } = useICPMetrics();
  const { data: dbLeadMagnet } = useLeadMagnetMetrics();

  const stages = dbStages?.length ? dbStages : fallback.stages;
  const content = dbContent?.length ? dbContent : fallback.content;
  const icpMetrics = dbICP?.length ? dbICP : fallback.icpMetrics;
  const leadMagnet = dbLeadMagnet?.betaSignups !== undefined && dbLeadMagnet.betaSignups > 0 ? dbLeadMagnet : fallback.leadMagnet;

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleStageClick = (stage: AwarenessStage) => {
    setHighlightedStage(stage);
    document.getElementById(`stage-${stage}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setHighlightedStage(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <TopBar
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        theme={theme}
        onThemeToggle={() => setTheme(t => t === "dark" ? "light" : "dark")}
      />
      <div className="flex flex-1 overflow-hidden">
        <NavRail />
        <main className="flex-1 overflow-y-auto">
          <PipelineBar stages={stages} onStageClick={handleStageClick} />
          <StageCards stages={stages} highlightedStage={highlightedStage} />
          <ContentTable rows={content} />
          <div className="grid grid-cols-2 gap-0">
            <ICPPanel metrics={icpMetrics} />
            <LeadMagnetTracker data={leadMagnet} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
