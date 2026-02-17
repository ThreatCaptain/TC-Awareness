import { useState, useEffect } from "react";
import { DateRange, AwarenessStage } from "@/data/types";
import { TopBar } from "@/components/dashboard/TopBar";
import { NavRail } from "@/components/dashboard/NavRail";
import { PipelineBar } from "@/components/dashboard/PipelineBar";
import { StageCards } from "@/components/dashboard/StageCards";
import { ContentTable } from "@/components/dashboard/ContentTable";
import { ContentStrategyBoard } from "@/components/dashboard/ContentStrategyBoard";
import { SocialMetricsPanel } from "@/components/dashboard/SocialMetricsPanel";
import { ICPPanel } from "@/components/dashboard/ICPPanel";
import { LeadMagnetTracker } from "@/components/dashboard/LeadMagnetTracker";
import { useStages } from "@/hooks/use-stages";
import { useContentPerformance } from "@/hooks/use-content";
import { useICPMetrics } from "@/hooks/use-icp-metrics";
import { useLeadMagnetData } from "@/hooks/use-lead-magnet";
import { AddContactSheet } from "@/components/forms/AddContactSheet";
import { ContentFormSheet, type ContentEditData } from "@/components/forms/ContentFormSheet";
import { AddContentIdeaSheet } from "@/components/forms/AddContentIdeaSheet";
import { ConnectPlatformSheet } from "@/components/forms/ConnectPlatformSheet";
import { UpdateLeadMagnetSheet } from "@/components/forms/UpdateLeadMagnetSheet";
import { MoveStageDialog, type MoveStageTarget } from "@/components/forms/MoveStageDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [dateRange, setDateRange] = useState<DateRange>("month");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [highlightedStage, setHighlightedStage] = useState<AwarenessStage | null>(null);

  // Move stage dialog state
  const [moveTarget, setMoveTarget] = useState<MoveStageTarget | null>(null);
  const [moveOpen, setMoveOpen] = useState(false);

  // Content edit state
  const [editContent, setEditContent] = useState<ContentEditData | null>(null);
  const [editContentOpen, setEditContentOpen] = useState(false);

  // Content strategy filter
  const [strategyStageFilter, setStrategyStageFilter] = useState<number | null>(null);

  // Data hooks
  const { data: stages, isLoading: stagesLoading, error: stagesError } = useStages(dateRange);
  const { data: content, isLoading: contentLoading, error: contentError } = useContentPerformance();
  const { data: icpMetrics, isLoading: icpLoading, error: icpError } = useICPMetrics();
  const { data: leadMagnet, isLoading: lmLoading, error: lmError } = useLeadMagnetData(dateRange);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Show toast for any errors
  useEffect(() => {
    const errors = [stagesError, contentError, icpError, lmError].filter(Boolean);
    for (const err of errors) {
      toast.error(err instanceof Error ? err.message : "Failed to load data");
    }
  }, [stagesError, contentError, icpError, lmError]);

  const handleStageClick = (stage: AwarenessStage) => {
    setHighlightedStage(stage);
    document.getElementById(`stage-${stage}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setHighlightedStage(null), 2000);
  };

  const handleMoveStage = async (contactId: string, contactName: string, stageNumber: number) => {
    // Look up the stage UUID from the stage_number
    const { data: stageRow } = await supabase
      .from("awareness_stages")
      .select("id, name")
      .eq("stage_number", stageNumber)
      .single();

    if (stageRow) {
      setMoveTarget({
        contactId,
        contactName,
        currentStageId: stageRow.id,
        currentStageName: stageRow.name,
      });
      setMoveOpen(true);
    }
  };

  const handleContentRowClick = async (contentId: string) => {
    // Fetch the full content piece for editing
    const { data, error } = await supabase
      .from("content_pieces")
      .select("*")
      .eq("id", contentId)
      .single();

    if (error || !data) {
      toast.error("Failed to load content piece");
      return;
    }

    setEditContent({
      id: data.id,
      title: data.title,
      content_type: data.content_type,
      target_stage_from: data.target_stage_from,
      target_stage_to: data.target_stage_to,
      url: data.url,
      views: data.views,
      engagements: data.engagements,
      stage_moves: data.stage_moves,
      is_active: data.is_active,
      published_at: data.published_at,
    });
    setEditContentOpen(true);
  };

  const isLoading = stagesLoading || contentLoading || icpLoading || lmLoading;

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
          {isLoading ? (
            <div className="px-6 py-4 space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-5 gap-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-40" />
                ))}
              </div>
              <Skeleton className="h-64 w-full" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            </div>
          ) : (
            <>
              {stages && <PipelineBar stages={stages} onStageClick={handleStageClick} />}
              {stages && (
                <StageCards
                  stages={stages}
                  highlightedStage={highlightedStage}
                  onMoveStage={handleMoveStage}
                />
              )}

              {/* Action buttons */}
              <div className="px-6 py-2 flex gap-2 flex-wrap">
                <AddContactSheet />
                <ContentFormSheet />
                <AddContentIdeaSheet />
                <ConnectPlatformSheet />
                <UpdateLeadMagnetSheet
                  currentData={leadMagnet ? {
                    betaSignups: leadMagnet.betaSignups,
                    leadsGenerated: leadMagnet.leadsGenerated,
                    goal: leadMagnet.goal,
                  } : undefined}
                />
              </div>

              {/* Content Strategy Board */}
              <ContentStrategyBoard
                stageFilter={strategyStageFilter}
                onStageFilterChange={setStrategyStageFilter}
              />

              {/* Social Platform Metrics */}
              <SocialMetricsPanel />

              {content && (
                <ContentTable
                  rows={content}
                  onRowClick={handleContentRowClick}
                />
              )}
              <div className="grid grid-cols-2 gap-0">
                {icpMetrics && <ICPPanel metrics={icpMetrics} />}
                {leadMagnet && <LeadMagnetTracker data={leadMagnet} />}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Move Stage Dialog */}
      <MoveStageDialog
        target={moveTarget}
        open={moveOpen}
        onOpenChange={setMoveOpen}
      />

      {/* Content Edit Sheet */}
      <ContentFormSheet
        editData={editContent}
        open={editContentOpen}
        onOpenChange={setEditContentOpen}
      />
    </div>
  );
};

export default Index;
