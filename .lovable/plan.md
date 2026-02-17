

# ThreatCaptain Awareness Tracker Dashboard

## Overview
A single-page, dark-themed internal operations dashboard for tracking ThreatCaptain's marketing and sales pipeline across the 5 Stages of Awareness (Eugene Schwartz framework). Designed with a Bloomberg terminal / military ops aesthetic — high-density, utilitarian, no fluff.

## Design System
- **Background**: Deep navy-charcoal (#0A0F1C) with subtle 1px dividers (#1A2038)
- **Accent colors**: Amber/gold (#D4A843) for primary actions, Teal (#3AAFA9) for secondary, Red (#E74C3C) for alerts only
- **Stage colors**: Gray → Amber → Teal → Blue → Green
- **Typography**: Monospace font for data, clean sans-serif for labels (no Inter/Roboto)
- **Layout**: Left icon-only nav rail + CSS grid content area, no card shadows
- **Dark mode default with light mode toggle**

## Dashboard Sections (top to bottom)

### 1. Top Bar — Date Range Filter
Simple filter: This Week / This Month / This Quarter / All Time

### 2. Stage Pipeline Bar (hero element)
Full-width horizontal segmented bar showing contact distribution across all 5 awareness stages. Each segment proportionally sized with stage accent color. Hover reveals count + percentage.

### 3. Stage Detail Cards (5-column grid)
One card per stage showing:
- Stage name + icon + contact count (large)
- Week-over-week change (arrow + %)
- Top 3 contacts (company + name, truncated)
- "View all →" link
- Clicking a pipeline segment scrolls to and highlights the corresponding card

### 4. Content Performance Table
Sortable table tracking content effectiveness across stages:
- Content Piece, Type, Stage Target, Views, Engagements, Stage Moves, Conversion %
- 8-10 hardcoded rows of realistic ThreatCaptain sample data

### 5. ICP Fit Score Panel
Compact section showing pipeline quality vs. ICP targets:
- % MSP Owners/Sales Directors/vCISO Leads (target 80%+)
- % in 10-100 employee range (target 70%+)
- % US-based (target 90%+)
- Overall weighted ICP Fit Score

### 6. Lead Magnet Widget Tracker
Dedicated section for the embeddable breach cost calculator campaign:
- Beta signups total + week-over-week comparison
- Activation rate (installed on website)
- Aggregate leads generated
- Goal progress bar: target 50 beta signups

## Left Nav Rail
Vertical icon-only navigation, expandable on hover. Minimal — just enough to feel like a real ops tool.

## Interactions
- Pipeline bar segments clickable → scroll to stage card
- Table columns sortable
- Date range filter affects displayed data
- Dark/light mode toggle

## Data Architecture
All data hardcoded as clean JSON objects, structured for easy future API swap-in. No authentication, no routing — single page.

