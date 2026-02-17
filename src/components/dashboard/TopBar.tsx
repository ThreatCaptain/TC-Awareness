import { DateRange } from "@/data/types";

const ranges: { value: DateRange; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "all", label: "All Time" },
];

interface TopBarProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  theme: "dark" | "light";
  onThemeToggle: () => void;
}

export function TopBar({ dateRange, onDateRangeChange, theme, onThemeToggle }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-mono text-xs font-bold">TC</span>
          </div>
          <h1 className="font-mono text-sm font-semibold tracking-wider text-foreground uppercase">
            Awareness Tracker
          </h1>
        </div>
        <span className="text-muted-foreground text-xs font-mono">v1.0</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 rounded border border-border bg-card p-0.5">
          {ranges.map(r => (
            <button
              key={r.value}
              onClick={() => onDateRangeChange(r.value)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                dateRange === r.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button
          onClick={onThemeToggle}
          className="h-7 w-7 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-xs"
          title="Toggle theme"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}
