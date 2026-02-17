-- =============================================================
-- ThreatCaptain Awareness Tracker — Content Strategy Schema
-- =============================================================

-- 1. content_strategy_items (kanban cards: Idea → In Progress → Scheduled → Posted)
CREATE TABLE content_strategy_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('Blog Post', 'Video', 'Webinar', 'Case Study', 'Guide', 'Lead Magnet Widget', 'Email Sequence', 'LinkedIn Post', 'Ad', 'Twitter Thread', 'Short-Form Video', 'Infographic', 'Other')),
  target_stage INTEGER NOT NULL REFERENCES awareness_stages(stage_number),
  status TEXT NOT NULL DEFAULT 'idea' CHECK (status IN ('idea', 'in_progress', 'scheduled', 'posted')),
  platform TEXT CHECK (platform IN ('LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'YouTube', 'TikTok', 'Blog', 'Email', 'Other')),
  scheduled_date DATE,
  posted_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_strategy_items_status ON content_strategy_items(status);
CREATE INDEX idx_strategy_items_stage ON content_strategy_items(target_stage);

-- 2. social_platforms (connected social accounts)
CREATE TABLE social_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_name TEXT NOT NULL CHECK (platform_name IN ('LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'YouTube', 'TikTok')),
  account_handle TEXT NOT NULL,
  is_connected BOOLEAN DEFAULT false,
  followers_count INTEGER DEFAULT 0,
  access_token TEXT, -- encrypted in production
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(platform_name, account_handle)
);

-- 3. social_post_metrics (metrics per posted content item per platform)
CREATE TABLE social_post_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_item_id UUID NOT NULL REFERENCES content_strategy_items(id) ON DELETE CASCADE,
  platform_id UUID NOT NULL REFERENCES social_platforms(id) ON DELETE CASCADE,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  engagement_rate NUMERIC(5,2) DEFAULT 0,
  fetched_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(strategy_item_id, platform_id)
);

CREATE INDEX idx_social_metrics_item ON social_post_metrics(strategy_item_id);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

ALTER TABLE content_strategy_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_post_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access" ON content_strategy_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON social_platforms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON social_post_metrics FOR ALL USING (true) WITH CHECK (true);
