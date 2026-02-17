import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Lightbulb } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddStrategyItem } from "@/hooks/use-content-strategy";

const CONTENT_TYPES = [
  "Blog Post",
  "Video",
  "Webinar",
  "Case Study",
  "Guide",
  "Lead Magnet Widget",
  "Email Sequence",
  "LinkedIn Post",
  "Ad",
  "Twitter Thread",
  "Short-Form Video",
  "Infographic",
  "Other",
];

const PLATFORMS = [
  "LinkedIn",
  "Twitter",
  "Facebook",
  "Instagram",
  "YouTube",
  "TikTok",
  "Blog",
  "Email",
  "Other",
];

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  content_type: z.string().min(1, "Type is required"),
  target_stage: z.coerce.number().int().min(1).max(5),
  platform: z.string().optional(),
  scheduled_date: z.string().optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function AddContentIdeaSheet() {
  const [open, setOpen] = useState(false);
  const addItem = useAddStrategyItem();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      content_type: "",
      target_stage: 1,
      platform: "",
      scheduled_date: "",
      notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await addItem.mutateAsync({
        title: values.title,
        description: values.description || undefined,
        content_type: values.content_type,
        target_stage: values.target_stage,
        platform: values.platform || undefined,
        scheduled_date: values.scheduled_date || undefined,
        notes: values.notes || undefined,
      });
      toast.success("Content idea added");
      reset();
      setOpen(false);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to add content idea";
      toast.error(message);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-xs font-mono gap-1"
        >
          <Lightbulb size={14} /> Add Idea
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-mono">New Content Idea</SheetTitle>
          <SheetDescription>
            Add a content idea to your strategy board
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="idea-title" className="text-xs font-mono">
              Title *
            </Label>
            <Input
              id="idea-title"
              {...register("title")}
              className="mt-1 font-mono text-sm"
              placeholder='e.g. "Why CFOs Ignore Your Security Pitch"'
            />
            {errors.title && (
              <p className="text-xs text-destructive mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="idea-desc" className="text-xs font-mono">
              Description
            </Label>
            <textarea
              id="idea-desc"
              {...register("description")}
              className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px] resize-y"
              placeholder="Brief description of the content idea and angle..."
            />
          </div>

          <div>
            <Label className="text-xs font-mono">Content Type *</Label>
            <Select onValueChange={(v) => setValue("content_type", v)}>
              <SelectTrigger className="mt-1 font-mono text-sm">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.content_type && (
              <p className="text-xs text-destructive mt-1">
                {errors.content_type.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-mono">Target Stage *</Label>
            <Select
              onValueChange={(v) =>
                setValue("target_stage", parseInt(v, 10))
              }
              defaultValue="1"
            >
              <SelectTrigger className="mt-1 font-mono text-sm">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 — Unaware</SelectItem>
                <SelectItem value="2">2 — Problem Aware</SelectItem>
                <SelectItem value="3">3 — Solution Aware</SelectItem>
                <SelectItem value="4">4 — Product Aware</SelectItem>
                <SelectItem value="5">5 — Most Aware</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-mono">Platform</Label>
            <Select onValueChange={(v) => setValue("platform", v)}>
              <SelectTrigger className="mt-1 font-mono text-sm">
                <SelectValue placeholder="Select platform (optional)" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="idea-date" className="text-xs font-mono">
              Scheduled Date
            </Label>
            <Input
              id="idea-date"
              type="date"
              {...register("scheduled_date")}
              className="mt-1 font-mono text-sm"
            />
          </div>

          <div>
            <Label htmlFor="idea-notes" className="text-xs font-mono">
              Notes
            </Label>
            <textarea
              id="idea-notes"
              {...register("notes")}
              className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[60px] resize-y"
              placeholder="Any additional notes..."
            />
          </div>

          <Button
            type="submit"
            className="w-full font-mono"
            disabled={addItem.isPending}
          >
            {addItem.isPending ? "Adding..." : "Add to Board"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
