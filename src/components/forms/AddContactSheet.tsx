import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddContact } from "@/hooks/use-contacts";
import { useAwarenessStages } from "@/hooks/use-awareness-stages";
import { useCompanies } from "@/hooks/use-companies";

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email().optional().or(z.literal("")),
  title: z.string().optional(),
  company_name: z.string().min(1, "Company is required"),
  employee_count: z.coerce.number().int().positive().optional().or(z.literal("")),
  country: z.string().default("US"),
  current_stage_id: z.string().min(1, "Stage is required"),
  source: z.string().optional(),
  icp_fit: z.boolean().default(true),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function AddContactSheet() {
  const [open, setOpen] = useState(false);
  const { data: stages } = useAwarenessStages();
  const { data: companies } = useCompanies();
  const addContact = useAddContact();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      title: "",
      company_name: "",
      country: "US",
      current_stage_id: "",
      source: "",
      icp_fit: true,
      notes: "",
    },
  });

  const icpFit = watch("icp_fit");

  const onSubmit = async (values: FormValues) => {
    try {
      await addContact.mutateAsync({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email || undefined,
        title: values.title || undefined,
        company_name: values.company_name,
        employee_count: typeof values.employee_count === "number" ? values.employee_count : undefined,
        country: values.country || "US",
        current_stage_id: values.current_stage_id,
        source: values.source || undefined,
        icp_fit: values.icp_fit,
        notes: values.notes || undefined,
      });
      toast.success("Contact added");
      reset();
      setOpen(false);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to add contact";
      toast.error(message);
    }
  };

  const SOURCES = ["LinkedIn", "Cold List", "Webinar", "Referral", "Website", "Other"];
  const TITLES = ["MSP Owner", "Sales Director", "vCISO Practice Lead", "IT Director", "IT Manager", "Other"];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs font-mono gap-1">
          <Plus size={14} /> Add Contact
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-mono">Add Contact</SheetTitle>
          <SheetDescription>Add a new contact to the pipeline</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="first_name" className="text-xs font-mono">First Name *</Label>
              <Input id="first_name" {...register("first_name")} className="mt-1 font-mono text-sm" />
              {errors.first_name && <p className="text-xs text-destructive mt-1">{errors.first_name.message}</p>}
            </div>
            <div>
              <Label htmlFor="last_name" className="text-xs font-mono">Last Name *</Label>
              <Input id="last_name" {...register("last_name")} className="mt-1 font-mono text-sm" />
              {errors.last_name && <p className="text-xs text-destructive mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-xs font-mono">Email</Label>
            <Input id="email" type="email" {...register("email")} className="mt-1 font-mono text-sm" />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label className="text-xs font-mono">Title</Label>
            <Select onValueChange={(v) => setValue("title", v)}>
              <SelectTrigger className="mt-1 font-mono text-sm">
                <SelectValue placeholder="Select title" />
              </SelectTrigger>
              <SelectContent>
                {TITLES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="company_name" className="text-xs font-mono">Company *</Label>
            <Input
              id="company_name"
              {...register("company_name")}
              className="mt-1 font-mono text-sm"
              list="company-suggestions"
            />
            <datalist id="company-suggestions">
              {(companies ?? []).map((c) => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
            {errors.company_name && <p className="text-xs text-destructive mt-1">{errors.company_name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="employee_count" className="text-xs font-mono">Employees</Label>
              <Input id="employee_count" type="number" {...register("employee_count")} className="mt-1 font-mono text-sm" />
            </div>
            <div>
              <Label htmlFor="country" className="text-xs font-mono">Country</Label>
              <Input id="country" {...register("country")} className="mt-1 font-mono text-sm" />
            </div>
          </div>

          <div>
            <Label className="text-xs font-mono">Stage *</Label>
            <Select onValueChange={(v) => setValue("current_stage_id", v)}>
              <SelectTrigger className="mt-1 font-mono text-sm">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {(stages ?? []).map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.current_stage_id && <p className="text-xs text-destructive mt-1">{errors.current_stage_id.message}</p>}
          </div>

          <div>
            <Label className="text-xs font-mono">Source</Label>
            <Select onValueChange={(v) => setValue("source", v)}>
              <SelectTrigger className="mt-1 font-mono text-sm">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={icpFit}
              onCheckedChange={(v) => setValue("icp_fit", v)}
            />
            <Label className="text-xs font-mono">ICP Fit</Label>
          </div>

          <div>
            <Label htmlFor="notes" className="text-xs font-mono">Notes</Label>
            <Textarea id="notes" {...register("notes")} className="mt-1 font-mono text-sm" rows={3} />
          </div>

          <Button type="submit" className="w-full font-mono" disabled={addContact.isPending}>
            {addContact.isPending ? "Adding..." : "Add Contact"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
