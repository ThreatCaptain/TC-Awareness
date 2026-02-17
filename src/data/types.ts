export type AwarenessStage = "unaware" | "problem" | "solution" | "product" | "most";

export interface Contact {
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
