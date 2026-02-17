export type AwarenessStage = "unaware" | "problem" | "solution" | "product" | "most";

export interface Contact {
  id?: string;
  name: string;
  company: string;
  stage: AwarenessStage;
  icpScore: number;
  role: string;
  employeeCount: number;
  country: string;
}

export interface StageData {
  id: AwarenessStage;
  label: string;
  count: number;
  prevCount: number;
  contacts: Contact[];
}

export interface ContentRow {
  id: string;
  title: string;
  type: string;
  stageTarget: AwarenessStage;
  views: number;
  engagements: number;
  stageMoves: number;
  conversionPct: number;
}

export interface ICPMetric {
  label: string;
  value: number;
  target: number;
}

export interface LeadMagnetData {
  betaSignups: number;
  prevBetaSignups: number;
  activationRate: number;
  leadsGenerated: number;
  goal: number;
}

export type DateRange = "week" | "month" | "quarter" | "all";

export const STAGE_META: Record<AwarenessStage, { label: string; color: string }> = {
  unaware: { label: "Unaware", color: "bg-stage-unaware" },
  problem: { label: "Problem Aware", color: "bg-stage-problem" },
  solution: { label: "Solution Aware", color: "bg-stage-solution" },
  product: { label: "Product Aware", color: "bg-stage-product" },
  most: { label: "Most Aware", color: "bg-stage-most" },
};

// Content Strategy types
export type ContentStatus = "idea" | "in_progress" | "scheduled" | "posted";

export const CONTENT_STATUS_META: Record<ContentStatus, { label: string; color: string }> = {
  idea: { label: "Idea", color: "text-muted-foreground" },
  in_progress: { label: "In Progress", color: "text-stage-problem" },
  scheduled: { label: "Scheduled", color: "text-stage-product" },
  posted: { label: "Posted", color: "text-stage-most" },
};

export type SocialPlatformName = "LinkedIn" | "Twitter" | "Facebook" | "Instagram" | "YouTube" | "TikTok";

export interface ContentStrategyItem {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  target_stage: number;
  status: ContentStatus;
  platform: string | null;
  scheduled_date: string | null;
  posted_date: string | null;
  sort_order: number;
  notes: string | null;
}

export interface SocialPlatform {
  id: string;
  platform_name: SocialPlatformName;
  account_handle: string;
  is_connected: boolean;
  followers_count: number;
}

export interface SocialPostMetric {
  id: string;
  strategy_item_id: string;
  platform_id: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  engagement_rate: number;
}
