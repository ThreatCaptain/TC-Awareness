import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AddContactInput {
  first_name: string;
  last_name: string;
  email?: string;
  title?: string;
  company_name: string;
  employee_count?: number;
  country?: string;
  current_stage_id: string;
  source?: string;
  icp_fit?: boolean;
  notes?: string;
}

export function useAddContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddContactInput) => {
      const { company_name, employee_count, country, ...contactFields } = input;

      // Upsert company (match by name)
      const { data: existingCompany, error: fetchErr } = await supabase
        .from("companies")
        .select("id")
        .eq("name", company_name)
        .maybeSingle();
      if (fetchErr) throw fetchErr;

      let companyId: string;
      if (existingCompany) {
        companyId = existingCompany.id;
      } else {
        const { data: newCompany, error: insertErr } = await supabase
          .from("companies")
          .insert({
            name: company_name,
            employee_count: employee_count ?? null,
            country: country ?? "US",
          })
          .select("id")
          .single();
        if (insertErr) throw insertErr;
        companyId = newCompany.id;
      }

      // Insert contact
      const { data: contact, error: cErr } = await supabase
        .from("contacts")
        .insert({
          ...contactFields,
          company_id: companyId,
          stage_changed_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (cErr) throw cErr;

      // Insert initial stage transition
      const { error: tErr } = await supabase.from("stage_transitions").insert({
        contact_id: contact.id,
        from_stage_id: null,
        to_stage_id: contactFields.current_stage_id,
      });
      if (tErr) throw tErr;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stages"] });
      qc.invalidateQueries({ queryKey: ["icpMetrics"] });
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export interface MoveStageInput {
  contact_id: string;
  from_stage_id: string;
  to_stage_id: string;
}

export function useMoveStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: MoveStageInput) => {
      // Update contact's stage
      const { error: uErr } = await supabase
        .from("contacts")
        .update({
          current_stage_id: input.to_stage_id,
          previous_stage_id: input.from_stage_id,
          stage_changed_at: new Date().toISOString(),
        })
        .eq("id", input.contact_id);
      if (uErr) throw uErr;

      // Log the transition
      const { error: tErr } = await supabase.from("stage_transitions").insert({
        contact_id: input.contact_id,
        from_stage_id: input.from_stage_id,
        to_stage_id: input.to_stage_id,
      });
      if (tErr) throw tErr;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stages"] });
      qc.invalidateQueries({ queryKey: ["icpMetrics"] });
    },
  });
}
