-- =============================================================
-- ThreatCaptain Awareness Tracker — Initial Schema
-- =============================================================

-- 1. awareness_stages (reference table, seeded with 5 stages)
CREATE TABLE awareness_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_number INTEGER NOT NULL UNIQUE CHECK (stage_number BETWEEN 1 AND 5),
  name TEXT NOT NULL,
  description TEXT,
  color_accent TEXT NOT NULL,
  example_content TEXT,
  tracked_signals TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO awareness_stages (stage_number, name, description, color_accent, example_content, tracked_signals) VALUES
(1, 'Unaware', 'MSPs who don''t realize they have a sales language problem. They think losing deals is about pricing or competition, not about how they present risk.', '#4A5568', 'Industry stat posts, pattern-interrupt social videos', 'Cold list imports, purchased lists, event attendee lists not yet engaged'),
(2, 'Problem Aware', 'MSPs who recognize they''re losing deals at the CFO level but don''t know a solution exists.', '#D4A843', 'Pain-point blog posts, "The CFO Problem" video series, LinkedIn posts about losing deals', 'Engaged with problem-focused content, watched video, commented on pain-point post, opened email'),
(3, 'Solution Aware', 'MSPs who know financial risk translation tools exist but haven''t specifically found ThreatCaptain. May be evaluating Cynomi, FortifyData, or Cork.', '#3AAFA9', 'Comparison guides, "How to talk to CFOs about cyber risk" webinars, approach-focused case studies', 'Downloaded comparison guide, attended webinar, searched "cyber risk quantification for MSPs"'),
(4, 'Product Aware', 'MSPs who know ThreatCaptain exists and understand what we do, but haven''t committed.', '#4F8EF7', 'Product demos, ROI calculators, customer testimonials, free trial offers', 'Visited threatcaptain.com, watched demo, attended sales call, requested pricing, signed up for widget beta'),
(5, 'Most Aware', 'MSPs who know ThreatCaptain, understand the value, and are ready to buy or have already bought.', '#2ECC71', 'Limited-time pricing, onboarding support offers, urgency-based direct outreach', 'Started trial, requested contract, became paying customer, referred others');

-- 2. companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  employee_count INTEGER,
  estimated_revenue TEXT,
  country TEXT DEFAULT 'US',
  is_msp BOOLEAN DEFAULT true,
  website TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. contacts
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  title TEXT,
  current_stage_id UUID REFERENCES awareness_stages(id),
  previous_stage_id UUID REFERENCES awareness_stages(id),
  stage_changed_at TIMESTAMPTZ,
  source TEXT,
  icp_fit BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_contacts_stage ON contacts(current_stage_id);
CREATE INDEX idx_contacts_company ON contacts(company_id);
CREATE INDEX idx_contacts_created ON contacts(created_at);

-- 4. stage_transitions
CREATE TABLE stage_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  from_stage_id UUID REFERENCES awareness_stages(id),
  to_stage_id UUID NOT NULL REFERENCES awareness_stages(id),
  attributed_content_id UUID,
  notes TEXT,
  transitioned_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_transitions_contact ON stage_transitions(contact_id);
CREATE INDEX idx_transitions_date ON stage_transitions(transitioned_at);

-- 5. content_pieces
CREATE TABLE content_pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('Blog Post', 'Video', 'Webinar', 'Case Study', 'Guide', 'Lead Magnet Widget', 'Email Sequence', 'LinkedIn Post', 'Ad', 'Other')),
  target_stage_from INTEGER REFERENCES awareness_stages(stage_number),
  target_stage_to INTEGER REFERENCES awareness_stages(stage_number),
  url TEXT,
  views INTEGER DEFAULT 0,
  engagements INTEGER DEFAULT 0,
  stage_moves INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  published_at DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add FK from stage_transitions to content_pieces
ALTER TABLE stage_transitions
  ADD CONSTRAINT fk_attributed_content
  FOREIGN KEY (attributed_content_id) REFERENCES content_pieces(id) ON DELETE SET NULL;

-- 6. lead_magnet_metrics (daily snapshots)
CREATE TABLE lead_magnet_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_beta_signups INTEGER DEFAULT 0,
  signups_this_period INTEGER DEFAULT 0,
  activated_count INTEGER DEFAULT 0,
  total_leads_generated INTEGER DEFAULT 0,
  beta_target INTEGER DEFAULT 50,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(date)
);

-- 7. icp_metrics (daily snapshots)
CREATE TABLE icp_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  pct_target_titles NUMERIC(5,2),
  pct_target_company_size NUMERIC(5,2),
  pct_us_based NUMERIC(5,2),
  overall_icp_score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(date)
);

-- =============================================================
-- VIEWS
-- =============================================================

-- Stage pipeline counts (powers the top bar)
CREATE OR REPLACE VIEW stage_pipeline AS
SELECT
  s.stage_number,
  s.name AS stage_name,
  s.color_accent,
  COUNT(c.id)::integer AS contact_count
FROM awareness_stages s
LEFT JOIN contacts c ON c.current_stage_id = s.id
GROUP BY s.id, s.stage_number, s.name, s.color_accent
ORDER BY s.stage_number;

-- Content performance (powers the content table)
CREATE OR REPLACE VIEW content_performance AS
SELECT
  cp.id,
  cp.title,
  cp.content_type,
  CONCAT(cp.target_stage_from, ' → ', cp.target_stage_to) AS stage_target,
  cp.views,
  cp.engagements,
  cp.stage_moves,
  CASE WHEN cp.views > 0 THEN ROUND((cp.stage_moves::NUMERIC / cp.views) * 100, 1) ELSE 0 END AS conversion_pct,
  cp.is_active,
  cp.published_at
FROM content_pieces cp
ORDER BY cp.stage_moves DESC;

-- Contacts with company and stage info (powers stage detail cards)
CREATE OR REPLACE VIEW contacts_enriched AS
SELECT
  c.id,
  c.first_name,
  c.last_name,
  c.email,
  c.title,
  c.source,
  c.icp_fit,
  c.stage_changed_at,
  c.created_at,
  co.name AS company_name,
  co.employee_count,
  co.country,
  s.stage_number,
  s.name AS stage_name,
  s.color_accent AS stage_color
FROM contacts c
LEFT JOIN companies co ON c.company_id = co.id
LEFT JOIN awareness_stages s ON c.current_stage_id = s.id
ORDER BY s.stage_number, c.updated_at DESC;

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

ALTER TABLE awareness_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_magnet_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE icp_metrics ENABLE ROW LEVEL SECURITY;

-- Permissive policies for now (anon can read/write everything)
-- TODO: Replace with proper auth-based policies before production
CREATE POLICY "Allow all access" ON awareness_stages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON stage_transitions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON content_pieces FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON lead_magnet_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON icp_metrics FOR ALL USING (true) WITH CHECK (true);
