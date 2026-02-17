import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateLeadMagnet } from "@/hooks/use-update-lead-magnet";

const schema = z.object({
  total_beta_signups: z.coerce.number().int().min(0),
  signups_this_period: z.coerce.number().int().min(0),
  activated_count: z.coerce.number().int().min(0),
  total_leads_generated: z.coerce.number().int().min(0),
  beta_target: z.coerce.number().int().min(1),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface UpdateLeadMagnetSheetProps {
  currentData?: {
    betaSignups: number;
    leadsGenerated: number;
    goal: number;
  };
}

export function UpdateLeadMagnetSheet({ currentData }: UpdateLeadMagnetSheetProps) {
  const [open, setOpen] = useState(false);
  const updateMetrics = useUpdateLeadMagnet();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      total_beta_signups: currentData?.betaSignups ?? 0,
      signups_this_period: 0,
      activated_count: 0,
      total_leads_generated: currentData?.leadsGenerated ?? 0,
      beta_target: currentData?.goal ?? 50,
      notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await updateMetrics.mutateAsync(values);
      toast.success("Lead magnet metrics updated");
      reset();
      setOpen(false);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to update metrics";
      toast.error(message);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs font-mono gap-1">
          <Pencil size={12} /> Update Metrics
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="font-mono">Update Lead Magnet Metrics</SheetTitle>
          <SheetDescription>Record today's metrics snapshot</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="total_beta_signups" className="text-xs font-mono">Total Beta Signups</Label>
            <Input
              id="total_beta_signups"
              type="number"
              {...register("total_beta_signups")}
              className="mt-1 font-mono text-sm"
            />
            {errors.total_beta_signups && <p className="text-xs text-destructive mt-1">{errors.total_beta_signups.message}</p>}
          </div>

          <div>
            <Label htmlFor="signups_this_period" className="text-xs font-mono">Signups This Period</Label>
            <Input
              id="signups_this_period"
              type="number"
              {...register("signups_this_period")}
              className="mt-1 font-mono text-sm"
            />
          </div>

          <div>
            <Label htmlFor="activated_count" className="text-xs font-mono">Activated Count</Label>
            <Input
              id="activated_count"
              type="number"
              {...register("activated_count")}
              className="mt-1 font-mono text-sm"
            />
          </div>

          <div>
            <Label htmlFor="total_leads_generated" className="text-xs font-mono">Total Leads Generated</Label>
            <Input
              id="total_leads_generated"
              type="number"
              {...register("total_leads_generated")}
              className="mt-1 font-mono text-sm"
            />
          </div>

          <div>
            <Label htmlFor="beta_target" className="text-xs font-mono">Beta Target</Label>
            <Input
              id="beta_target"
              type="number"
              {...register("beta_target")}
              className="mt-1 font-mono text-sm"
            />
            {errors.beta_target && <p className="text-xs text-destructive mt-1">{errors.beta_target.message}</p>}
          </div>

          <div>
            <Label htmlFor="notes" className="text-xs font-mono">Notes</Label>
            <Textarea id="notes" {...register("notes")} className="mt-1 font-mono text-sm" rows={2} />
          </div>

          <Button type="submit" className="w-full font-mono" disabled={updateMetrics.isPending}>
            {updateMetrics.isPending ? "Saving..." : "Update Metrics"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
