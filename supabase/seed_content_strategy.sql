-- =============================================================
-- ThreatCaptain — Content Strategy Seed Data
-- Run AFTER 002_content_strategy.sql migration
-- =============================================================

-- Stage 1: Unaware — pattern-interrupt content to wake them up
INSERT INTO content_strategy_items (title, description, content_type, target_stage, status, platform, sort_order, scheduled_date, posted_date) VALUES
  ('The $4.45M Wake-Up Call: What One Breach Costs an MSP', 'Pattern-interrupt stat that grabs attention. Lead with the IBM data breach report number. End with "Are you sure your clients understand this?"', 'LinkedIn Post', 1, 'posted', 'LinkedIn', 1, '2026-02-10', '2026-02-10'),
  ('60-Second Reel: "What MSPs Get Wrong About Selling Security"', 'Quick-hit video. Open with the most common objection MSPs hear, flip the script. Hook: "Your clients don''t care about firewalls."', 'Short-Form Video', 1, 'scheduled', 'LinkedIn', 2, '2026-02-20', NULL),
  ('"I Lost a $200K Deal Because I Talked About Firewalls"', 'Story-driven LinkedIn post. First-person narrative of an MSP owner who lost a deal to a competitor who spoke the CFO''s language.', 'LinkedIn Post', 1, 'in_progress', 'LinkedIn', 3, NULL, NULL),
  ('Infographic: 5 Reasons CFOs Ignore Your Security Pitch', 'Visual breakdown of the disconnect between MSP sales language and what financial decision-makers care about.', 'Infographic', 1, 'idea', NULL, 4, NULL, NULL),
  ('Cold Outreach Email: "Is Your Biggest Competitor... Your Own Pitch?"', 'Pattern-interrupt cold email template. Subject line A/B test. Personalized with prospect company data.', 'Email Sequence', 1, 'idea', 'Email', 5, NULL, NULL),
  ('Twitter Thread: "The MSP sales problem nobody talks about"', '7-tweet thread unpacking why MSPs lose to competitors with worse tech. Each tweet = one painful truth.', 'Twitter Thread', 1, 'idea', 'Twitter', 6, NULL, NULL);

-- Stage 2: Problem Aware — validate the pain, deepen the wound
INSERT INTO content_strategy_items (title, description, content_type, target_stage, status, platform, sort_order, scheduled_date, posted_date) VALUES
  ('Blog: "Why CFOs Say No — And What They Actually Want to Hear"', 'Deep-dive blog post. Interview quotes from 3 CFOs about what makes them tune out during security pitches vs. what gets their attention.', 'Blog Post', 2, 'posted', 'Blog', 1, '2026-02-05', '2026-02-05'),
  ('Webinar: "The CFO Problem" — Live Q&A with MSP Owners', 'Interactive webinar where we discuss real deal-loss stories and identify the language gap. Record for repurposing.', 'Webinar', 2, 'scheduled', NULL, 2, '2026-02-25', NULL),
  ('LinkedIn Carousel: "Translate Your Security Pitch to CFO Language"', '10-slide carousel. Side-by-side: what you say vs. what the CFO hears. Each slide is a cringe-worthy translation.', 'LinkedIn Post', 2, 'in_progress', 'LinkedIn', 3, NULL, NULL),
  ('Email Sequence: "The Deal You Lost Last Quarter"', '3-part drip sequence. Email 1: The problem. Email 2: The cost of inaction. Email 3: Teaser that a solution exists.', 'Email Sequence', 2, 'idea', 'Email', 4, NULL, NULL),
  ('Video: "Watch a CFO React to a Typical MSP Security Pitch"', 'Reaction-style video. Get a real CFO to review common MSP pitches and give honest feedback. Gold content.', 'Video', 2, 'idea', 'YouTube', 5, NULL, NULL);

-- Stage 3: Solution Aware — show the category, position vs. alternatives
INSERT INTO content_strategy_items (title, description, content_type, target_stage, status, platform, sort_order, scheduled_date, posted_date) VALUES
  ('Comparison Guide: ThreatCaptain vs. Cynomi vs. Cork vs. FortifyData', 'Honest feature comparison. Focus on risk quantification in dollars, not technical jargon. Lead with what CFOs care about.', 'Guide', 3, 'posted', 'Blog', 1, '2026-01-28', '2026-01-28'),
  ('Webinar: "How to Talk to CFOs About Cyber Risk (Without Losing Them)"', 'Tactical webinar. 5 frameworks for translating technical risk into financial language. Attendees get our cheat sheet.', 'Webinar', 3, 'scheduled', NULL, 2, '2026-03-01', NULL),
  ('Case Study: How BridgeSec Closed 3 Deals by Changing Their Pitch', 'Before/after case study. BridgeSec was losing deals, adopted risk quantification, closed 3 in 30 days.', 'Case Study', 3, 'in_progress', NULL, 3, NULL, NULL),
  ('LinkedIn Post: "The 3 Types of Cyber Risk Tools (And Which One CFOs Trust)"', 'Educational post. Categories: compliance tools, technical scanners, financial risk translators. Position ThreatCaptain in the third.', 'LinkedIn Post', 3, 'idea', 'LinkedIn', 4, NULL, NULL),
  ('Lead Magnet: "The CFO Risk Translation Cheat Sheet"', 'PDF download. One-pager that maps common cyber risks to dollar amounts. Gated behind email capture.', 'Lead Magnet Widget', 3, 'idea', NULL, 5, NULL, NULL);

-- Stage 4: Product Aware — demo the product, remove objections
INSERT INTO content_strategy_items (title, description, content_type, target_stage, status, platform, sort_order, scheduled_date, posted_date) VALUES
  ('Product Demo: "See ThreatCaptain Turn a Risk Scan Into a CFO Pitch"', 'Live demo showing the full flow: scan → risk quantification → executive-ready report in 2 minutes.', 'Video', 4, 'posted', 'YouTube', 1, '2026-02-01', '2026-02-01'),
  ('ROI Calculator: "How Much Revenue Are You Leaving on the Table?"', 'Interactive tool. Input your average deal size, close rate, and # of CFO meetings. Output: revenue lift with ThreatCaptain.', 'Lead Magnet Widget', 4, 'scheduled', 'Blog', 2, '2026-02-22', NULL),
  ('Customer Story: ShieldNet''s 90-Day Transformation (Video)', 'Video testimonial. Marcus from ShieldNet walks through their before/after with real numbers.', 'Case Study', 4, 'in_progress', 'YouTube', 3, NULL, NULL),
  ('LinkedIn Post: "We gave 10 MSPs free access. Here''s what happened."', 'Results post. Share aggregate beta tester outcomes. Social proof for the skeptics.', 'LinkedIn Post', 4, 'idea', 'LinkedIn', 4, NULL, NULL),
  ('Email: "Your Free 14-Day Trial Is Ready"', 'Direct trial offer email. Personalized with their company name and a pre-generated sample report.', 'Email Sequence', 4, 'idea', 'Email', 5, NULL, NULL);

-- Stage 5: Most Aware — close the deal, urgency + onboarding
INSERT INTO content_strategy_items (title, description, content_type, target_stage, status, platform, sort_order, scheduled_date, posted_date) VALUES
  ('Email: "Your Trial Ends Friday — Lock In Founding Member Pricing"', 'Urgency email for trial users approaching expiration. Founding member pricing ($99/mo) expires end of month.', 'Email Sequence', 5, 'posted', 'Email', 1, '2026-02-12', '2026-02-12'),
  ('LinkedIn Post: "We just hit 23 beta MSPs. 27 spots left."', 'Scarcity + social proof. Tag some beta testers (with permission). Show momentum.', 'LinkedIn Post', 5, 'scheduled', 'LinkedIn', 2, '2026-02-19', NULL),
  ('Onboarding Guide: "Your First 7 Days with ThreatCaptain"', 'Step-by-step guide. Day 1: Run your first scan. Day 3: Generate your first CFO report. Day 7: Book your first meeting.', 'Guide', 5, 'in_progress', 'Blog', 3, NULL, NULL),
  ('Ad: "MSPs Using ThreatCaptain Close 3x More CFO Deals"', 'Paid ad for retargeting. Targets site visitors and trial users who haven''t converted.', 'Ad', 5, 'idea', 'LinkedIn', 4, NULL, NULL);

-- Social platform connections (demo data — not actually connected)
INSERT INTO social_platforms (platform_name, account_handle, is_connected, followers_count) VALUES
  ('LinkedIn', '@threatcaptain', true, 2840),
  ('Twitter', '@threatcaptain', true, 1250),
  ('YouTube', 'ThreatCaptain', false, 380),
  ('Facebook', 'ThreatCaptain', false, 520),
  ('Instagram', '@threatcaptain', false, 190),
  ('TikTok', '@threatcaptain', false, 45);

-- Social post metrics for posted items
INSERT INTO social_post_metrics (strategy_item_id, platform_id, impressions, reach, likes, comments, shares, clicks, engagement_rate) VALUES
  -- Stage 1 posted: "The $4.45M Wake-Up Call"
  ((SELECT id FROM content_strategy_items WHERE title LIKE '%$4.45M Wake-Up%'), (SELECT id FROM social_platforms WHERE platform_name = 'LinkedIn'), 8420, 5200, 312, 47, 89, 234, 5.3),
  -- Stage 2 posted: "Why CFOs Say No"
  ((SELECT id FROM content_strategy_items WHERE title LIKE '%Why CFOs Say No%'), (SELECT id FROM social_platforms WHERE platform_name = 'LinkedIn'), 3200, 1800, 145, 23, 34, 178, 6.3),
  -- Stage 3 posted: Comparison Guide
  ((SELECT id FROM content_strategy_items WHERE title LIKE '%Comparison Guide%'), (SELECT id FROM social_platforms WHERE platform_name = 'LinkedIn'), 4100, 2600, 198, 31, 52, 312, 6.8),
  -- Stage 4 posted: Product Demo
  ((SELECT id FROM content_strategy_items WHERE title LIKE '%See ThreatCaptain Turn%'), (SELECT id FROM social_platforms WHERE platform_name = 'YouTube'), 2300, 1400, 89, 18, 12, 456, 5.2),
  -- Stage 5 posted: Trial urgency email (LinkedIn share)
  ((SELECT id FROM content_strategy_items WHERE title LIKE '%Trial Ends Friday%'), (SELECT id FROM social_platforms WHERE platform_name = 'LinkedIn'), 1900, 1100, 67, 12, 28, 89, 5.6),
  -- Twitter metrics for Stage 1 post
  ((SELECT id FROM content_strategy_items WHERE title LIKE '%$4.45M Wake-Up%'), (SELECT id FROM social_platforms WHERE platform_name = 'Twitter'), 12400, 8900, 456, 78, 234, 567, 6.1);
