import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddContent, useUpdateContent } from "@/hooks/use-content";

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
  "Other",
];

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  content_type: z.string().min(1, "Type is required"),
  target_stage_from: z.coerce.number().int().min(1).max(5).nullable().optional(),
  target_stage_to: z.coerce.number().int().min(1).max(5).nullable().optional(),
  url: z.string().url().optional().or(z.literal("")),
  views: z.coerce.number().int().min(0).default(0),
  engagements: z.coerce.number().int().min(0).default(0),
  stage_moves: z.coerce.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  published_at: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export interface ContentEditData {
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
}

interface ContentFormSheetProps {
  editData?: ContentEditData | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ContentFormSheet({ editData, open: controlledOpen, onOpenChange: controlledOnOpenChange }: ContentFormSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalOpen;

  const isEdit = !!editData;
  const addContent = useAddContent();
  const updateContent = useUpdateContent();

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
      title: "",
      content_type: "",
      target_stage_from: null,
      target_stage_to: null,
      url: "",
      views: 0,
      engagements: 0,
      stage_moves: 0,
      is_active: true,
      published_at: "",
    },
  });

  useEffect(() => {
    if (editData && open) {
      reset({
        title: editData.title,
        content_type: editData.content_type,
        target_stage_from: editData.target_stage_from,
        target_stage_to: editData.target_stage_to,
        url: editData.url ?? "",
        views: editData.views,
        engagements: editData.engagements,
        stage_moves: editData.stage_moves,
        is_active: editData.is_active ?? true,
        published_at: editData.published_at ?? "",
      });
    } else if (!open) {
      reset();
    }
  }, [editData, open, reset]);

  const isActive = watch("is_active");

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        title: values.title,
        content_type: values.content_type,
        target_stage_from: values.target_stage_from ?? null,
        target_stage_to: values.target_stage_to ?? null,
        url: values.url || undefined,
        views: values.views,
        engagements: values.engagements,
        stage_moves: values.stage_moves,
        is_active: values.is_active,
        published_at: values.published_at || undefined,
      };

      if (isEdit && editData) {
        await updateContent.mutateAsync({ id: editData.id, ...payload });
        toast.success("Content updated");
      } else {
        await addContent.mutateAsync(payload);
        toast.success("Content added");
      }
      reset();
      onOpenChange(false);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to save content";
      toast.error(message);
    }
  };

  const isPending = addContent.isPending || updateContent.isPending;
  const STAGES = ["1", "2", "3", "4", "5"];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {!controlledOnOpenChange && (
        <SheetTrigger asChild>
          <Button size="sm" variant="outline" className="text-xs font-mono gap-1">
            <Plus size={14} /> Add Content
          </Button>
        </SheetTrigger>
      )}
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-mono">{isEdit ? "Edit Content" : "Add Content"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Update content piece details" : "Add a new content piece"}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title" className="text-xs font-mono">Title *</Label>
            <Input id="title" {...register("title")} className="mt-1 font-mono text-sm" />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label className="text-xs font-mono">Type *</Label>
            <Select
              onValueChange={(v) => setValue("content_type", v)}
              defaultValue={editData?.content_type}
            >
              <SelectTrigger className="mt-1 font-mono text-sm">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.content_type && <p className="text-xs text-destructive mt-1">{errors.content_type.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-mono">Stage From</Label>
              <Select
                onValueChange={(v) => setValue("target_stage_from", parseInt(v, 10))}
                defaultValue={editData?.target_stage_from?.toString()}
              >
                <SelectTrigger className="mt-1 font-mono text-sm">
                  <SelectValue placeholder="From" />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s} value={s}>Stage {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-mono">Stage To</Label>
              <Select
                onValueChange={(v) => setValue("target_stage_to", parseInt(v, 10))}
                defaultValue={editData?.target_stage_to?.toString()}
              >
                <SelectTrigger className="mt-1 font-mono text-sm">
                  <SelectValue placeholder="To" />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s} value={s}>Stage {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="url" className="text-xs font-mono">URL</Label>
            <Input id="url" {...register("url")} className="mt-1 font-mono text-sm" placeholder="https://" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="views" className="text-xs font-mono">Views</Label>
              <Input id="views" type="number" {...register("views")} className="mt-1 font-mono text-sm" />
            </div>
            <div>
              <Label htmlFor="engagements" className="text-xs font-mono">Engagements</Label>
              <Input id="engagements" type="number" {...register("engagements")} className="mt-1 font-mono text-sm" />
            </div>
            <div>
              <Label htmlFor="stage_moves" className="text-xs font-mono">Stage Moves</Label>
              <Input id="stage_moves" type="number" {...register("stage_moves")} className="mt-1 font-mono text-sm" />
            </div>
          </div>

          <div>
            <Label htmlFor="published_at" className="text-xs font-mono">Published Date</Label>
            <Input id="published_at" type="date" {...register("published_at")} className="mt-1 font-mono text-sm" />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={isActive}
              onCheckedChange={(v) => setValue("is_active", v)}
            />
            <Label className="text-xs font-mono">Active</Label>
          </div>

          <Button type="submit" className="w-full font-mono" disabled={isPending}>
            {isPending ? "Saving..." : isEdit ? "Update Content" : "Add Content"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
