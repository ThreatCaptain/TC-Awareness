-- =============================================================
-- ThreatCaptain Awareness Tracker — Seed Data
-- Run this AFTER the migration (001_initial_schema.sql)
-- =============================================================

-- Companies (30 total)
INSERT INTO companies (name, employee_count, country) VALUES
  ('ShieldNet MSP', 35, 'US'),
  ('CyberLock Solutions', 22, 'US'),
  ('Fortress IT', 48, 'US'),
  ('NetGuard Pro', 120, 'CA'),
  ('TrueNorth Cyber', 15, 'US'),
  ('SecureFirst IT', 28, 'US'),
  ('Apex Managed', 55, 'US'),
  ('CyberShield Group', 42, 'US'),
  ('ProTech MSP', 88, 'UK'),
  ('VaultSec', 32, 'US'),
  ('Sentinel Ops', 19, 'US'),
  ('DefensePoint', 65, 'US'),
  ('IronClad IT', 41, 'US'),
  ('ThreatWatch Co', 27, 'US'),
  ('CipherStack', 38, 'US'),
  ('BridgeSec MSP', 52, 'US'),
  ('Trident Cyber Solutions', 44, 'US'),
  ('Apex IT Group', 31, 'US'),
  ('BlueShield Managed Services', 67, 'US'),
  ('Kraken Networks', 23, 'US'),
  ('Pinnacle MSP', 18, 'US'),
  ('RedLine Security', 56, 'US'),
  ('NorthStar IT', 29, 'CA'),
  ('CyberPeak Partners', 73, 'US'),
  ('Aegis Managed Tech', 14, 'US'),
  ('Vanguard IT Solutions', 91, 'UK'),
  ('Citadel MSP Group', 37, 'US'),
  ('TechFort Services', 25, 'US'),
  ('Guardian Digital', 46, 'US'),
  ('Atlas Cyber Group', 33, 'US');

-- Contacts (45 total, spread across stages: ~15 Unaware, ~12 Problem Aware, ~8 Solution Aware, ~6 Product Aware, ~4 Most Aware)
-- Stage 1: Unaware (15 contacts)
INSERT INTO contacts (first_name, last_name, title, company_id, current_stage_id, icp_fit, source, stage_changed_at) VALUES
  ('Marcus', 'Chen', 'MSP Owner', (SELECT id FROM companies WHERE name = 'ShieldNet MSP'), (SELECT id FROM awareness_stages WHERE stage_number = 1), true, 'Cold List', now() - interval '20 days'),
  ('Rachel', 'Torres', 'Sales Director', (SELECT id FROM companies WHERE name = 'CyberLock Solutions'), (SELECT id FROM awareness_stages WHERE stage_number = 1), true, 'LinkedIn', now() - interval '18 days'),
  ('David', 'Park', 'vCISO Practice Lead', (SELECT id FROM companies WHERE name = 'Fortress IT'), (SELECT id FROM awareness_stages WHERE stage_number = 1), true, 'Cold List', now() - interval '15 days'),
  ('Sarah', 'Kim', 'IT Manager', (SELECT id FROM companies WHERE name = 'NetGuard Pro'), (SELECT id FROM awareness_stages WHERE stage_number = 1), false, 'Cold List', now() - interval '22 days'),
  ('James', 'Wright', 'MSP Owner', (SELECT id FROM companies WHERE name = 'TrueNorth Cyber'), (SELECT id FROM awareness_stages WHERE stage_number = 1), true, 'LinkedIn', now() - interval '12 days'),
  ('Brandon', 'Lee', 'MSP Owner', (SELECT id FROM companies WHERE name = 'Trident Cyber Solutions'), (SELECT id FROM awareness_stages WHERE stage_number = 1), true, 'Cold List', now() - interval '25 days'),
  ('Stephanie', 'Fox', 'Sales Director', (SELECT id FROM companies WHERE name = 'Apex IT Group'), (SELECT id FROM awareness_stages WHERE stage_number = 1), true, 'LinkedIn', now() - interval '10 days'),
  ('Kevin', 'Pham', 'IT Director', (SELECT id FROM companies WHERE name = 'BlueShield Managed Services'), (SELECT id FROM awareness_stages WHERE stage_number = 1), true, 'Cold List', now() - interval '28 days'),
  ('Andrea', 'Collins', 'MSP Owner', (SELECT id FROM companies WHERE name = 'Pinnacle MSP'), (SELECT id FROM awareness_stages WHERE stage_number = 1), true, 'Website', now() - interval '8 days'),
  ('Tony', 'Russo', 'Sales Director', (SELECT id FROM companies WHERE name = 'Citadel MSP Group'), (SELECT id FROM awareness_stages WHERE stage_number = 1), true, 'LinkedIn', now() - interval '14 days'),
  ('Michelle', 'Grant', 'vCISO Practice Lead', (SELECT id FROM companies WHERE name = 'TechFort Services'), (SELECT id FROM awareness_stages WHERE stage_number = 1), true, 'Cold List', now() - interval '19 days'),
  ('Jason', 'Blake', 'MSP Owner', (SELECT id FROM companies WHERE name = 'Guardian Digital'), (SELECT id FROM awareness_stages WHERE stage_number = 1), true, 'Referral', now() - interval '6 days'),
  ('Laura', 'Martinez', 'IT Manager', (SELECT id FROM companies WHERE name = 'Atlas Cyber Group'), (SELECT id FROM awareness_stages WHERE stage_number = 1), false, 'Cold List', now() - interval '30 days'),
  ('Chris', 'Donovan', 'MSP Owner', (SELECT id FROM companies WHERE name = 'Aegis Managed Tech'), (SELECT id FROM awareness_stages WHERE stage_number = 1), true, 'LinkedIn', now() - interval '11 days'),
  ('Samantha', 'Reed', 'Sales Director', (SELECT id FROM companies WHERE name = 'Vanguard IT Solutions'), (SELECT id FROM awareness_stages WHERE stage_number = 1), false, 'Cold List', now() - interval '26 days');

-- Stage 2: Problem Aware (12 contacts)
INSERT INTO contacts (first_name, last_name, title, company_id, current_stage_id, icp_fit, source, stage_changed_at) VALUES
  ('Elena', 'Vasquez', 'MSP Owner', (SELECT id FROM companies WHERE name = 'SecureFirst IT'), (SELECT id FROM awareness_stages WHERE stage_number = 2), true, 'LinkedIn', now() - interval '14 days'),
  ('Tom', 'Bradley', 'Sales Director', (SELECT id FROM companies WHERE name = 'Apex Managed'), (SELECT id FROM awareness_stages WHERE stage_number = 2), true, 'Webinar', now() - interval '10 days'),
  ('Priya', 'Patel', 'vCISO Practice Lead', (SELECT id FROM companies WHERE name = 'CyberShield Group'), (SELECT id FROM awareness_stages WHERE stage_number = 2), true, 'LinkedIn', now() - interval '16 days'),
  ('Mike', 'Sullivan', 'IT Director', (SELECT id FROM companies WHERE name = 'ProTech MSP'), (SELECT id FROM awareness_stages WHERE stage_number = 2), false, 'Cold List', now() - interval '21 days'),
  ('Hannah', 'Cooper', 'MSP Owner', (SELECT id FROM companies WHERE name = 'Kraken Networks'), (SELECT id FROM awareness_stages WHERE stage_number = 2), true, 'LinkedIn', now() - interval '9 days'),
  ('Derek', 'Walsh', 'Sales Director', (SELECT id FROM companies WHERE name = 'RedLine Security'), (SELECT id FROM awareness_stages WHERE stage_number = 2), true, 'Webinar', now() - interval '7 days'),
  ('Monica', 'Singh', 'vCISO Practice Lead', (SELECT id FROM companies WHERE name = 'NorthStar IT'), (SELECT id FROM awareness_stages WHERE stage_number = 2), true, 'LinkedIn', now() - interval '13 days'),
  ('Robert', 'Hayes', 'MSP Owner', (SELECT id FROM companies WHERE name = 'CyberPeak Partners'), (SELECT id FROM awareness_stages WHERE stage_number = 2), true, 'Referral', now() - interval '5 days'),
  ('Aisha', 'Mohammed', 'Sales Director', (SELECT id FROM companies WHERE name = 'Trident Cyber Solutions'), (SELECT id FROM awareness_stages WHERE stage_number = 2), true, 'Webinar', now() - interval '11 days'),
  ('Greg', 'Nelson', 'MSP Owner', (SELECT id FROM companies WHERE name = 'BlueShield Managed Services'), (SELECT id FROM awareness_stages WHERE stage_number = 2), true, 'LinkedIn', now() - interval '17 days'),
  ('Yuki', 'Tanaka', 'IT Manager', (SELECT id FROM companies WHERE name = 'Pinnacle MSP'), (SELECT id FROM awareness_stages WHERE stage_number = 2), false, 'Cold List', now() - interval '23 days'),
  ('Victor', 'Reyes', 'MSP Owner', (SELECT id FROM companies WHERE name = 'Citadel MSP Group'), (SELECT id FROM awareness_stages WHERE stage_number = 2), true, 'Referral', now() - interval '4 days');

-- Stage 3: Solution Aware (8 contacts)
INSERT INTO contacts (first_name, last_name, title, company_id, current_stage_id, icp_fit, source, stage_changed_at) VALUES
  ('Lisa', 'Nguyen', 'MSP Owner', (SELECT id FROM companies WHERE name = 'VaultSec'), (SELECT id FROM awareness_stages WHERE stage_number = 3), true, 'Webinar', now() - interval '12 days'),
  ('Carlos', 'Rivera', 'Sales Director', (SELECT id FROM companies WHERE name = 'Sentinel Ops'), (SELECT id FROM awareness_stages WHERE stage_number = 3), true, 'LinkedIn', now() - interval '8 days'),
  ('Amy', 'Zhang', 'vCISO Practice Lead', (SELECT id FROM companies WHERE name = 'DefensePoint'), (SELECT id FROM awareness_stages WHERE stage_number = 3), true, 'Webinar', now() - interval '15 days'),
  ('Nathan', 'Brooks', 'MSP Owner', (SELECT id FROM companies WHERE name = 'RedLine Security'), (SELECT id FROM awareness_stages WHERE stage_number = 3), true, 'LinkedIn', now() - interval '6 days'),
  ('Diana', 'Ortega', 'Sales Director', (SELECT id FROM companies WHERE name = 'Guardian Digital'), (SELECT id FROM awareness_stages WHERE stage_number = 3), true, 'Webinar', now() - interval '10 days'),
  ('Patrick', 'Dunn', 'MSP Owner', (SELECT id FROM companies WHERE name = 'Atlas Cyber Group'), (SELECT id FROM awareness_stages WHERE stage_number = 3), true, 'Referral', now() - interval '3 days'),
  ('Tanya', 'Volkov', 'vCISO Practice Lead', (SELECT id FROM companies WHERE name = 'Vanguard IT Solutions'), (SELECT id FROM awareness_stages WHERE stage_number = 3), false, 'Cold List', now() - interval '19 days'),
  ('Kyle', 'Jennings', 'MSP Owner', (SELECT id FROM companies WHERE name = 'TechFort Services'), (SELECT id FROM awareness_stages WHERE stage_number = 3), true, 'Webinar', now() - interval '7 days');

-- Stage 4: Product Aware (6 contacts)
INSERT INTO contacts (first_name, last_name, title, company_id, current_stage_id, icp_fit, source, stage_changed_at) VALUES
  ('Ryan', 'O''Brien', 'MSP Owner', (SELECT id FROM companies WHERE name = 'IronClad IT'), (SELECT id FROM awareness_stages WHERE stage_number = 4), true, 'Website', now() - interval '8 days'),
  ('Nina', 'Hoffman', 'Sales Director', (SELECT id FROM companies WHERE name = 'ThreatWatch Co'), (SELECT id FROM awareness_stages WHERE stage_number = 4), true, 'Webinar', now() - interval '5 days'),
  ('Alex', 'Morrison', 'MSP Owner', (SELECT id FROM companies WHERE name = 'CyberPeak Partners'), (SELECT id FROM awareness_stages WHERE stage_number = 4), true, 'Website', now() - interval '10 days'),
  ('Sonia', 'Gupta', 'vCISO Practice Lead', (SELECT id FROM companies WHERE name = 'Apex IT Group'), (SELECT id FROM awareness_stages WHERE stage_number = 4), true, 'Webinar', now() - interval '3 days'),
  ('Matt', 'Lawson', 'Sales Director', (SELECT id FROM companies WHERE name = 'NorthStar IT'), (SELECT id FROM awareness_stages WHERE stage_number = 4), true, 'LinkedIn', now() - interval '6 days'),
  ('Rachel', 'Wu', 'MSP Owner', (SELECT id FROM companies WHERE name = 'Aegis Managed Tech'), (SELECT id FROM awareness_stages WHERE stage_number = 4), true, 'Referral', now() - interval '2 days');

-- Stage 5: Most Aware (4 contacts)
INSERT INTO contacts (first_name, last_name, title, company_id, current_stage_id, icp_fit, source, stage_changed_at) VALUES
  ('Derek', 'Chang', 'MSP Owner', (SELECT id FROM companies WHERE name = 'CipherStack'), (SELECT id FROM awareness_stages WHERE stage_number = 5), true, 'Website', now() - interval '5 days'),
  ('Julia', 'Mendez', 'vCISO Practice Lead', (SELECT id FROM companies WHERE name = 'BridgeSec MSP'), (SELECT id FROM awareness_stages WHERE stage_number = 5), true, 'Referral', now() - interval '3 days'),
  ('Brian', 'Fischer', 'MSP Owner', (SELECT id FROM companies WHERE name = 'Kraken Networks'), (SELECT id FROM awareness_stages WHERE stage_number = 5), true, 'Website', now() - interval '7 days'),
  ('Keiko', 'Nakamura', 'Sales Director', (SELECT id FROM companies WHERE name = 'Sentinel Ops'), (SELECT id FROM awareness_stages WHERE stage_number = 5), true, 'Webinar', now() - interval '1 day');

-- Content pieces (10 pieces mapped to the new schema)
INSERT INTO content_pieces (title, content_type, target_stage_from, target_stage_to, views, engagements, stage_moves, published_at) VALUES
  ('The Hidden Cost of a Breach for MSPs', 'Blog Post', 1, 2, 4820, 312, 47, '2025-11-15'),
  ('Why Your Clients Don''t Care About Security (Yet)', 'LinkedIn Post', 1, 2, 12400, 890, 134, '2025-10-28'),
  ('5 Signs Your MSP Needs a Security Overhaul', 'Email Sequence', 2, 3, 2100, 420, 63, '2025-12-01'),
  ('Breach Cost Calculator — Free Tool', 'Lead Magnet Widget', 2, 3, 3400, 680, 102, '2025-09-20'),
  ('How ThreatCaptain Detects Threats in Real-Time', 'Webinar', 3, 4, 890, 267, 38, '2026-01-10'),
  ('MSP Security Stack Comparison Guide', 'Guide', 3, 4, 1560, 390, 52, '2025-11-05'),
  ('ThreatCaptain vs. Competitors: Feature Breakdown', 'Blog Post', 4, 5, 2340, 585, 41, '2026-01-20'),
  ('Customer Story: ShieldNet''s 90-Day Transformation', 'Case Study', 4, 5, 780, 234, 28, '2025-12-15'),
  ('Start Your Free Trial — 14 Days', 'Ad', 5, 5, 1890, 567, 19, '2026-02-01'),
  ('Onboarding Email Sequence (7-part)', 'Email Sequence', 5, 5, 620, 310, 24, '2025-10-10');

-- Lead magnet metrics (2 snapshots for WoW comparison)
INSERT INTO lead_magnet_metrics (date, total_beta_signups, signups_this_period, activated_count, total_leads_generated, beta_target) VALUES
  (CURRENT_DATE - interval '7 days', 15, 6, 9, 32, 50),
  (CURRENT_DATE, 23, 8, 14, 47, 50);

-- ICP metrics snapshot
INSERT INTO icp_metrics (date, pct_target_titles, pct_target_company_size, pct_us_based, overall_icp_score) VALUES
  (CURRENT_DATE, 82.00, 74.00, 91.00, 83.40);

-- Stage transitions (sample transitions over last 30 days)
INSERT INTO stage_transitions (contact_id, from_stage_id, to_stage_id, transitioned_at) VALUES
  ((SELECT id FROM contacts WHERE first_name = 'Elena' AND last_name = 'Vasquez'), (SELECT id FROM awareness_stages WHERE stage_number = 1), (SELECT id FROM awareness_stages WHERE stage_number = 2), now() - interval '14 days'),
  ((SELECT id FROM contacts WHERE first_name = 'Tom' AND last_name = 'Bradley'), (SELECT id FROM awareness_stages WHERE stage_number = 1), (SELECT id FROM awareness_stages WHERE stage_number = 2), now() - interval '10 days'),
  ((SELECT id FROM contacts WHERE first_name = 'Lisa' AND last_name = 'Nguyen'), (SELECT id FROM awareness_stages WHERE stage_number = 2), (SELECT id FROM awareness_stages WHERE stage_number = 3), now() - interval '12 days'),
  ((SELECT id FROM contacts WHERE first_name = 'Carlos' AND last_name = 'Rivera'), (SELECT id FROM awareness_stages WHERE stage_number = 2), (SELECT id FROM awareness_stages WHERE stage_number = 3), now() - interval '8 days'),
  ((SELECT id FROM contacts WHERE first_name = 'Ryan' AND last_name = 'O''Brien'), (SELECT id FROM awareness_stages WHERE stage_number = 3), (SELECT id FROM awareness_stages WHERE stage_number = 4), now() - interval '8 days'),
  ((SELECT id FROM contacts WHERE first_name = 'Nina' AND last_name = 'Hoffman'), (SELECT id FROM awareness_stages WHERE stage_number = 3), (SELECT id FROM awareness_stages WHERE stage_number = 4), now() - interval '5 days'),
  ((SELECT id FROM contacts WHERE first_name = 'Derek' AND last_name = 'Chang'), (SELECT id FROM awareness_stages WHERE stage_number = 4), (SELECT id FROM awareness_stages WHERE stage_number = 5), now() - interval '5 days'),
  ((SELECT id FROM contacts WHERE first_name = 'Julia' AND last_name = 'Mendez'), (SELECT id FROM awareness_stages WHERE stage_number = 4), (SELECT id FROM awareness_stages WHERE stage_number = 5), now() - interval '3 days'),
  ((SELECT id FROM contacts WHERE first_name = 'Hannah' AND last_name = 'Cooper'), (SELECT id FROM awareness_stages WHERE stage_number = 1), (SELECT id FROM awareness_stages WHERE stage_number = 2), now() - interval '9 days'),
  ((SELECT id FROM contacts WHERE first_name = 'Nathan' AND last_name = 'Brooks'), (SELECT id FROM awareness_stages WHERE stage_number = 2), (SELECT id FROM awareness_stages WHERE stage_number = 3), now() - interval '6 days');
