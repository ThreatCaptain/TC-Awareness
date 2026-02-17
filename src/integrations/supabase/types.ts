export type Database = {
  public: {
    Tables: {
      awareness_stages: {
        Row: {
          id: string;
          stage_number: number;
          name: string;
          description: string | null;
          color_accent: string;
          example_content: string | null;
          tracked_signals: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          stage_number: number;
          name: string;
          description?: string | null;
          color_accent: string;
          example_content?: string | null;
          tracked_signals?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          stage_number?: number;
          name?: string;
          description?: string | null;
          color_accent?: string;
          example_content?: string | null;
          tracked_signals?: string | null;
          created_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          employee_count: number | null;
          estimated_revenue: string | null;
          country: string | null;
          is_msp: boolean | null;
          website: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          employee_count?: number | null;
          estimated_revenue?: string | null;
          country?: string | null;
          is_msp?: boolean | null;
          website?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          employee_count?: number | null;
          estimated_revenue?: string | null;
          country?: string | null;
          is_msp?: boolean | null;
          website?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          company_id: string | null;
          first_name: string;
          last_name: string;
          email: string | null;
          title: string | null;
          current_stage_id: string | null;
          previous_stage_id: string | null;
          stage_changed_at: string | null;
          source: string | null;
          icp_fit: boolean | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id?: string | null;
          first_name: string;
          last_name: string;
          email?: string | null;
          title?: string | null;
          current_stage_id?: string | null;
          previous_stage_id?: string | null;
          stage_changed_at?: string | null;
          source?: string | null;
          icp_fit?: boolean | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string | null;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          title?: string | null;
          current_stage_id?: string | null;
          previous_stage_id?: string | null;
          stage_changed_at?: string | null;
          source?: string | null;
          icp_fit?: boolean | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      stage_transitions: {
        Row: {
          id: string;
          contact_id: string | null;
          from_stage_id: string | null;
          to_stage_id: string;
          attributed_content_id: string | null;
          notes: string | null;
          transitioned_at: string;
        };
        Insert: {
          id?: string;
          contact_id?: string | null;
          from_stage_id?: string | null;
          to_stage_id: string;
          attributed_content_id?: string | null;
          notes?: string | null;
          transitioned_at?: string;
        };
        Update: {
          id?: string;
          contact_id?: string | null;
          from_stage_id?: string | null;
          to_stage_id?: string;
          attributed_content_id?: string | null;
          notes?: string | null;
          transitioned_at?: string;
        };
      };
      content_pieces: {
        Row: {
          id: string;
          title: string;
          content_type: string;
          target_stage_from: number | null;
          target_stage_to: number | null;
          url: string | null;
          views: number;
          engagements: number;
          stage_moves: number;
          is_active: boolean | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content_type: string;
          target_stage_from?: number | null;
          target_stage_to?: number | null;
          url?: string | null;
          views?: number;
          engagements?: number;
          stage_moves?: number;
          is_active?: boolean | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content_type?: string;
          target_stage_from?: number | null;
          target_stage_to?: number | null;
          url?: string | null;
          views?: number;
          engagements?: number;
          stage_moves?: number;
          is_active?: boolean | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lead_magnet_metrics: {
        Row: {
          id: string;
          date: string;
          total_beta_signups: number;
          signups_this_period: number;
          activated_count: number;
          total_leads_generated: number;
          beta_target: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          date?: string;
          total_beta_signups?: number;
          signups_this_period?: number;
          activated_count?: number;
          total_leads_generated?: number;
          beta_target?: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          total_beta_signups?: number;
          signups_this_period?: number;
          activated_count?: number;
          total_leads_generated?: number;
          beta_target?: number;
          notes?: string | null;
          created_at?: string;
        };
      };
      icp_metrics: {
        Row: {
          id: string;
          date: string;
          pct_target_titles: number | null;
          pct_target_company_size: number | null;
          pct_us_based: number | null;
          overall_icp_score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          date?: string;
          pct_target_titles?: number | null;
          pct_target_company_size?: number | null;
          pct_us_based?: number | null;
          overall_icp_score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          pct_target_titles?: number | null;
          pct_target_company_size?: number | null;
          pct_us_based?: number | null;
          overall_icp_score?: number | null;
          created_at?: string;
        };
      };
      content_strategy_items: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          content_type: string;
          target_stage: number;
          status: string;
          platform: string | null;
          scheduled_date: string | null;
          posted_date: string | null;
          sort_order: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          content_type: string;
          target_stage: number;
          status?: string;
          platform?: string | null;
          scheduled_date?: string | null;
          posted_date?: string | null;
          sort_order?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          content_type?: string;
          target_stage?: number;
          status?: string;
          platform?: string | null;
          scheduled_date?: string | null;
          posted_date?: string | null;
          sort_order?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_platforms: {
        Row: {
          id: string;
          platform_name: string;
          account_handle: string;
          is_connected: boolean | null;
          followers_count: number | null;
          access_token: string | null;
          refresh_token: string | null;
          token_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          platform_name: string;
          account_handle: string;
          is_connected?: boolean | null;
          followers_count?: number | null;
          access_token?: string | null;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          platform_name?: string;
          account_handle?: string;
          is_connected?: boolean | null;
          followers_count?: number | null;
          access_token?: string | null;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_post_metrics: {
        Row: {
          id: string;
          strategy_item_id: string;
          platform_id: string;
          impressions: number | null;
          reach: number | null;
          likes: number | null;
          comments: number | null;
          shares: number | null;
          clicks: number | null;
          engagement_rate: number | null;
          fetched_at: string;
        };
        Insert: {
          id?: string;
          strategy_item_id: string;
          platform_id: string;
          impressions?: number | null;
          reach?: number | null;
          likes?: number | null;
          comments?: number | null;
          shares?: number | null;
          clicks?: number | null;
          engagement_rate?: number | null;
          fetched_at?: string;
        };
        Update: {
          id?: string;
          strategy_item_id?: string;
          platform_id?: string;
          impressions?: number | null;
          reach?: number | null;
          likes?: number | null;
          comments?: number | null;
          shares?: number | null;
          clicks?: number | null;
          engagement_rate?: number | null;
          fetched_at?: string;
        };
      };
    };
    Views: {
      stage_pipeline: {
        Row: {
          stage_number: number;
          stage_name: string;
          color_accent: string;
          contact_count: number;
        };
      };
      content_performance: {
        Row: {
          id: string;
          title: string;
          content_type: string;
          stage_target: string | null;
          views: number;
          engagements: number;
          stage_moves: number;
          conversion_pct: number;
          is_active: boolean | null;
          published_at: string | null;
        };
      };
      contacts_enriched: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          title: string | null;
          source: string | null;
          icp_fit: boolean | null;
          stage_changed_at: string | null;
          created_at: string;
          company_name: string | null;
          employee_count: number | null;
          country: string | null;
          stage_number: number | null;
          stage_name: string | null;
          stage_color: string | null;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
