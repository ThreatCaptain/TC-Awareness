import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMoveStage } from "@/hooks/use-contacts";
import { useAwarenessStages } from "@/hooks/use-awareness-stages";

export interface MoveStageTarget {
  contactId: string;
  contactName: string;
  currentStageId: string;
  currentStageName: string;
}

interface MoveStageDialogProps {
  target: MoveStageTarget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MoveStageDialog({ target, open, onOpenChange }: MoveStageDialogProps) {
  const [selectedStageId, setSelectedStageId] = useState<string>("");
  const { data: stages } = useAwarenessStages();
  const moveStage = useMoveStage();

  const handleSubmit = async () => {
    if (!target || !selectedStageId) return;
    if (selectedStageId === target.currentStageId) {
      toast.error("Contact is already in that stage");
      return;
    }

    try {
      await moveStage.mutateAsync({
        contact_id: target.contactId,
        from_stage_id: target.currentStageId,
        to_stage_id: selectedStageId,
      });
      const newStageName = stages?.find((s) => s.id === selectedStageId)?.name ?? "new stage";
      toast.success(`Moved ${target.contactName} to ${newStageName}`);
      setSelectedStageId("");
      onOpenChange(false);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to move contact";
      toast.error(message);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="font-mono">Move Stage</SheetTitle>
          <SheetDescription>
            Move {target?.contactName ?? "contact"} to a different stage
          </SheetDescription>
        </SheetHeader>
        {target && (
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs font-mono text-muted-foreground">Contact</Label>
              <p className="text-sm font-mono font-medium mt-1">{target.contactName}</p>
            </div>

            <div>
              <Label className="text-xs font-mono text-muted-foreground">Current Stage</Label>
              <p className="text-sm font-mono font-medium mt-1">{target.currentStageName}</p>
            </div>

            <div>
              <Label className="text-xs font-mono">New Stage</Label>
              <Select onValueChange={setSelectedStageId} value={selectedStageId}>
                <SelectTrigger className="mt-1 font-mono text-sm">
                  <SelectValue placeholder="Select new stage" />
                </SelectTrigger>
                <SelectContent>
                  {(stages ?? [])
                    .filter((s) => s.id !== target.currentStageId)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full font-mono gap-2"
              disabled={!selectedStageId || moveStage.isPending}
            >
              {moveStage.isPending ? "Moving..." : (
                <>
                  Move <ArrowRight size={14} />
                </>
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
