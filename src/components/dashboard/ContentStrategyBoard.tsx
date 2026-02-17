import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Lightbulb,
  Loader2,
  CalendarClock,
  CheckCircle2,
  GripVertical,
  Trash2,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import type {
  ContentStrategyItem,
  ContentStatus,
  AwarenessStage,
} from "@/data/types";
import { STAGE_META, CONTENT_STATUS_META } from "@/data/types";
import {
  useContentStrategy,
  useUpdateStrategyStatus,
  useDeleteStrategyItem,
} from "@/hooks/use-content-strategy";
import { useSocialMetricsForItem } from "@/hooks/use-social-platforms";

const STATUS_COLUMNS: { id: ContentStatus; label: string; icon: React.ElementType }[] = [
  { id: "idea", label: "Ideas", icon: Lightbulb },
  { id: "in_progress", label: "In Progress", icon: Loader2 },
  { id: "scheduled", label: "Scheduled", icon: CalendarClock },
  { id: "posted", label: "Posted", icon: CheckCircle2 },
];

const STAGE_NUMBER_TO_SLUG: Record<number, AwarenessStage> = {
  1: "unaware",
  2: "problem",
  3: "solution",
  4: "product",
  5: "most",
};

// ──────────────────── Droppable Column ────────────────────
function KanbanColumn({
  status,
  items,
  label,
  icon: Icon,
  onViewMetrics,
}: {
  status: ContentStatus;
  items: ContentStrategyItem[];
  label: string;
  icon: React.ElementType;
  onViewMetrics: (item: ContentStrategyItem) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded border min-h-[300px] transition-colors ${
        isOver
          ? "border-primary bg-primary/5"
          : "border-border bg-card/50"
      }`}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Icon
          size={14}
          className={CONTENT_STATUS_META[status].color}
        />
        <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="ml-auto text-xs font-mono text-muted-foreground bg-muted/50 px-1.5 rounded">
          {items.length}
        </span>
      </div>
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[460px]">
          {items.map((item) => (
            <SortableCard
              key={item.id}
              item={item}
              onViewMetrics={onViewMetrics}
            />
          ))}
          {items.length === 0 && (
            <div className="text-xs text-muted-foreground font-mono text-center py-8 opacity-50">
              Drop items here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// ──────────────────── Sortable Card ────────────────────
function SortableCard({
  item,
  onViewMetrics,
}: {
  item: ContentStrategyItem;
  onViewMetrics: (item: ContentStrategyItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });
  const deleteItem = useDeleteStrategyItem();

  const stageMeta =
    STAGE_META[STAGE_NUMBER_TO_SLUG[item.target_stage] ?? "unaware"];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded border border-border bg-card p-2.5 group hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start gap-1.5">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing shrink-0"
        >
          <GripVertical size={12} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-foreground leading-tight truncate">
            {item.title}
          </p>
          {item.description && (
            <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-snug">
              {item.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${stageMeta.color}`}
            />
            <span className="text-[10px] font-mono text-muted-foreground">
              {stageMeta.label}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/60">
              {item.content_type}
            </span>
            {item.platform && (
              <span className="text-[10px] font-mono text-primary/70">
                {item.platform}
              </span>
            )}
            {item.scheduled_date && (
              <span className="text-[10px] font-mono text-stage-product">
                {item.scheduled_date}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {item.status === "posted" && (
            <button
              onClick={() => onViewMetrics(item)}
              className="text-muted-foreground hover:text-primary p-0.5"
              title="View metrics"
            >
              <BarChart3 size={11} />
            </button>
          )}
          <button
            onClick={() => {
              deleteItem.mutate(item.id, {
                onSuccess: () => toast.success("Item removed"),
                onError: () => toast.error("Failed to remove"),
              });
            }}
            className="text-muted-foreground hover:text-destructive p-0.5"
            title="Delete"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────── Drag Overlay Card ────────────────────
function DragOverlayCard({ item }: { item: ContentStrategyItem }) {
  const stageMeta =
    STAGE_META[STAGE_NUMBER_TO_SLUG[item.target_stage] ?? "unaware"];

  return (
    <div className="rounded border border-primary bg-card p-2.5 shadow-xl shadow-primary/10 w-[260px]">
      <div className="flex items-start gap-1.5">
        <GripVertical size={12} className="mt-0.5 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-foreground leading-tight truncate">
            {item.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${stageMeta.color}`}
            />
            <span className="text-[10px] font-mono text-muted-foreground">
              {stageMeta.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────── Metrics Popover ────────────────────
function MetricsPopover({
  item,
  onClose,
}: {
  item: ContentStrategyItem;
  onClose: () => void;
}) {
  const { data: metrics, isLoading } = useSocialMetricsForItem(item.id);

  return (
    <div className="rounded border border-border bg-card p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-mono font-medium text-foreground truncate max-w-[240px]">
          {item.title}
        </h4>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          Close
        </button>
      </div>
      {isLoading ? (
        <p className="text-xs text-muted-foreground font-mono">Loading...</p>
      ) : !metrics || metrics.length === 0 ? (
        <p className="text-xs text-muted-foreground font-mono">
          No metrics available. Connect a platform to track performance.
        </p>
      ) : (
        <div className="space-y-3">
          {metrics.map((m) => (
            <div key={m.id} className="border-t border-border pt-2 first:border-0 first:pt-0">
              <p className="text-[10px] font-mono text-primary mb-1.5">
                {m.platform_name} {m.account_handle}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Impressions", value: m.impressions },
                  { label: "Reach", value: m.reach },
                  { label: "Likes", value: m.likes },
                  { label: "Comments", value: m.comments },
                  { label: "Shares", value: m.shares },
                  { label: "Clicks", value: m.clicks },
                  { label: "Eng. Rate", value: `${m.engagement_rate}%` },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[9px] font-mono text-muted-foreground uppercase">
                      {stat.label}
                    </p>
                    <p className="text-xs font-mono text-foreground">
                      {typeof stat.value === "number"
                        ? stat.value.toLocaleString()
                        : stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────── Main Board ────────────────────
interface ContentStrategyBoardProps {
  stageFilter: number | null;
  onStageFilterChange: (stage: number | null) => void;
}

export function ContentStrategyBoard({
  stageFilter,
  onStageFilterChange,
}: ContentStrategyBoardProps) {
  const { data: items, isLoading } = useContentStrategy(stageFilter);
  const updateStatus = useUpdateStrategyStatus();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [metricsItem, setMetricsItem] = useState<ContentStrategyItem | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const columns = useMemo(() => {
    const grouped: Record<ContentStatus, ContentStrategyItem[]> = {
      idea: [],
      in_progress: [],
      scheduled: [],
      posted: [],
    };
    for (const item of items ?? []) {
      if (grouped[item.status]) {
        grouped[item.status].push(item);
      }
    }
    return grouped;
  }, [items]);

  const activeItem = useMemo(
    () => (items ?? []).find((i) => i.id === activeId) ?? null,
    [items, activeId]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Visual feedback handled by isOver in KanbanColumn
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return;

    const itemId = active.id as string;

    // Determine the target column. `over.id` could be a column id or another card id
    let targetStatus: ContentStatus | null = null;

    if (["idea", "in_progress", "scheduled", "posted"].includes(over.id as string)) {
      targetStatus = over.id as ContentStatus;
    } else {
      // Dropped on a card — find which column that card belongs to
      const overItem = (items ?? []).find((i) => i.id === over.id);
      if (overItem) targetStatus = overItem.status;
    }

    if (!targetStatus) return;

    const draggedItem = (items ?? []).find((i) => i.id === itemId);
    if (!draggedItem || draggedItem.status === targetStatus) return;

    updateStatus.mutate(
      { id: itemId, status: targetStatus },
      {
        onSuccess: () => {
          toast.success(
            `Moved to ${CONTENT_STATUS_META[targetStatus!].label}`
          );
        },
        onError: () => toast.error("Failed to move item"),
      }
    );
  };

  if (isLoading) {
    return (
      <section className="px-6 py-4">
        <div className="h-8 bg-muted/30 rounded animate-pulse mb-3" />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-muted/20 rounded animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-4" id="content-strategy">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Content Strategy Board
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={stageFilter ?? ""}
              onChange={(e) =>
                onStageFilterChange(e.target.value ? Number(e.target.value) : null)
              }
              className="appearance-none bg-muted/30 border border-border rounded px-2.5 py-1 pr-6 text-xs font-mono text-foreground cursor-pointer hover:bg-muted/50 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Stages</option>
              <option value="1">Stage 1 — Unaware</option>
              <option value="2">Stage 2 — Problem Aware</option>
              <option value="3">Stage 3 — Solution Aware</option>
              <option value="4">Stage 4 — Product Aware</option>
              <option value="5">Stage 5 — Most Aware</option>
            </select>
            <ChevronDown
              size={10}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-3">
          {STATUS_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              status={col.id}
              items={columns[col.id]}
              label={col.label}
              icon={col.icon}
              onViewMetrics={setMetricsItem}
            />
          ))}
        </div>
        <DragOverlay>
          {activeItem ? <DragOverlayCard item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>

      {metricsItem && (
        <div className="mt-3">
          <MetricsPopover
            item={metricsItem}
            onClose={() => setMetricsItem(null)}
          />
        </div>
      )}
    </section>
  );
}
