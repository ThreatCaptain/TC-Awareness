import type { StageData, ContentRow, ICPMetric, LeadMagnetData, DateRange } from "./types";

const allContacts = [
  { name: "Marcus Chen", company: "ShieldNet MSP", stage: "unaware" as const, icpScore: 92, role: "MSP Owner", employeeCount: 35, country: "US" },
  { name: "Rachel Torres", company: "CyberLock Solutions", stage: "unaware" as const, icpScore: 78, role: "Sales Director", employeeCount: 22, country: "US" },
  { name: "David Park", company: "Fortress IT", stage: "unaware" as const, icpScore: 85, role: "vCISO", employeeCount: 48, country: "US" },
  { name: "Sarah Kim", company: "NetGuard Pro", stage: "unaware" as const, icpScore: 65, role: "IT Manager", employeeCount: 120, country: "CA" },
  { name: "James Wright", company: "TrueNorth Cyber", stage: "unaware" as const, icpScore: 88, role: "MSP Owner", employeeCount: 15, country: "US" },
  { name: "Elena Vasquez", company: "SecureFirst IT", stage: "problem" as const, icpScore: 91, role: "MSP Owner", employeeCount: 28, country: "US" },
  { name: "Tom Bradley", company: "Apex Managed", stage: "problem" as const, icpScore: 82, role: "Sales Director", employeeCount: 55, country: "US" },
  { name: "Priya Patel", company: "CyberShield Group", stage: "problem" as const, icpScore: 74, role: "vCISO", employeeCount: 42, country: "US" },
  { name: "Mike Sullivan", company: "ProTech MSP", stage: "problem" as const, icpScore: 69, role: "IT Director", employeeCount: 88, country: "UK" },
  { name: "Lisa Nguyen", company: "VaultSec", stage: "solution" as const, icpScore: 95, role: "MSP Owner", employeeCount: 32, country: "US" },
  { name: "Carlos Rivera", company: "Sentinel Ops", stage: "solution" as const, icpScore: 87, role: "Sales Director", employeeCount: 19, country: "US" },
  { name: "Amy Zhang", company: "DefensePoint", stage: "solution" as const, icpScore: 80, role: "vCISO", employeeCount: 65, country: "US" },
  { name: "Ryan O'Brien", company: "IronClad IT", stage: "product" as const, icpScore: 93, role: "MSP Owner", employeeCount: 41, country: "US" },
  { name: "Nina Hoffman", company: "ThreatWatch Co", stage: "product" as const, icpScore: 86, role: "Sales Director", employeeCount: 27, country: "US" },
  { name: "Derek Chang", company: "CipherStack", stage: "most" as const, icpScore: 97, role: "MSP Owner", employeeCount: 38, country: "US" },
  { name: "Julia Mendez", company: "BridgeSec MSP", stage: "most" as const, icpScore: 90, role: "vCISO", employeeCount: 52, country: "US" },
];

function buildStages(range: DateRange): StageData[] {
  const multiplier = range === "week" ? 1 : range === "month" ? 1.2 : range === "quarter" ? 1.5 : 2;
  const stages: StageData[] = [
    { id: "unaware", label: "Unaware", count: Math.round(247 * multiplier), prevCount: Math.round(232 * multiplier), contacts: allContacts.filter(c => c.stage === "unaware") },
    { id: "problem", label: "Problem Aware", count: Math.round(183 * multiplier), prevCount: Math.round(171 * multiplier), contacts: allContacts.filter(c => c.stage === "problem") },
    { id: "solution", label: "Solution Aware", count: Math.round(94 * multiplier), prevCount: Math.round(102 * multiplier), contacts: allContacts.filter(c => c.stage === "solution") },
    { id: "product", label: "Product Aware", count: Math.round(52 * multiplier), prevCount: Math.round(47 * multiplier), contacts: allContacts.filter(c => c.stage === "product") },
    { id: "most", label: "Most Aware", count: Math.round(31 * multiplier), prevCount: Math.round(28 * multiplier), contacts: allContacts.filter(c => c.stage === "most") },
  ];
  return stages;
}

const contentRows: ContentRow[] = [
  { id: "1", title: "The Hidden Cost of a Breach for MSPs", type: "Blog", stageTarget: "unaware", views: 4820, engagements: 312, stageMoves: 47, conversionPct: 9.8 },
  { id: "2", title: "Why Your Clients Don't Care About Security (Yet)", type: "LinkedIn Post", stageTarget: "unaware", views: 12400, engagements: 890, stageMoves: 134, conversionPct: 10.8 },
  { id: "3", title: "5 Signs Your MSP Needs a Security Overhaul", type: "Email", stageTarget: "problem", views: 2100, engagements: 420, stageMoves: 63, conversionPct: 15.0 },
  { id: "4", title: "Breach Cost Calculator — Free Tool", type: "Lead Magnet", stageTarget: "problem", views: 3400, engagements: 680, stageMoves: 102, conversionPct: 15.0 },
  { id: "5", title: "How ThreatCaptain Detects Threats in Real-Time", type: "Webinar", stageTarget: "solution", views: 890, engagements: 267, stageMoves: 38, conversionPct: 14.2 },
  { id: "6", title: "MSP Security Stack Comparison Guide", type: "Whitepaper", stageTarget: "solution", views: 1560, engagements: 390, stageMoves: 52, conversionPct: 13.3 },
  { id: "7", title: "ThreatCaptain vs. Competitors: Feature Breakdown", type: "Landing Page", stageTarget: "product", views: 2340, engagements: 585, stageMoves: 41, conversionPct: 7.0 },
  { id: "8", title: "Customer Story: ShieldNet's 90-Day Transformation", type: "Case Study", stageTarget: "product", views: 780, engagements: 234, stageMoves: 28, conversionPct: 12.0 },
  { id: "9", title: "Start Your Free Trial — 14 Days", type: "CTA Page", stageTarget: "most", views: 1890, engagements: 567, stageMoves: 19, conversionPct: 3.4 },
  { id: "10", title: "Onboarding Email Sequence (7-part)", type: "Email", stageTarget: "most", views: 620, engagements: 310, stageMoves: 24, conversionPct: 7.7 },
];

const icpMetrics: ICPMetric[] = [
  { label: "MSP Owners / Sales Directors / vCISO", value: 82, target: 80 },
  { label: "10–100 Employee Range", value: 74, target: 70 },
  { label: "US-Based", value: 91, target: 90 },
];

function getLeadMagnet(range: DateRange): LeadMagnetData {
  const m = range === "week" ? 1 : range === "month" ? 2.5 : range === "quarter" ? 6 : 10;
  return {
    betaSignups: Math.round(23 * m),
    prevBetaSignups: Math.round(19 * m),
    activationRate: 34,
    leadsGenerated: Math.round(156 * m),
    goal: 50,
  };
}

export function getDashboardData(range: DateRange) {
  return {
    stages: buildStages(range),
    content: contentRows,
    icpMetrics,
    leadMagnet: getLeadMagnet(range),
  };
}
