import { useState } from "react";
import { ContentRow, STAGE_META } from "@/data/types";
import { ArrowUpDown } from "lucide-react";

type SortKey = keyof ContentRow;

interface ContentTableProps {
  rows: ContentRow[];
}

export function ContentTable({ rows }: ContentTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") {
      return sortAsc ? av - bv : bv - av;
    }
    return sortAsc
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const cols: { key: SortKey; label: string; align?: string }[] = [
    { key: "title", label: "Content" },
    { key: "type", label: "Type" },
    { key: "stageTarget", label: "Stage" },
    { key: "views", label: "Views", align: "text-right" },
    { key: "engagements", label: "Engagements", align: "text-right" },
    { key: "stageMoves", label: "Stage Moves", align: "text-right" },
    { key: "conversionPct", label: "Conv %", align: "text-right" },
  ];

  return (
    <section className="px-6 py-4">
      <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
        Content Performance
      </h2>
      <div className="rounded border border-border overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {cols.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-3 py-2 text-left text-muted-foreground font-medium cursor-pointer hover:text-foreground select-none ${col.align || ""}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown size={10} className={sortKey === col.key ? "text-primary" : "opacity-30"} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(row => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2 text-foreground max-w-[240px] truncate">{row.title}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.type}</td>
                <td className="px-3 py-2">
                  <span className={`inline-block h-2 w-2 rounded-sm mr-1.5 ${STAGE_META[row.stageTarget].color}`} />
                  <span className="text-muted-foreground">{STAGE_META[row.stageTarget].label}</span>
                </td>
                <td className="px-3 py-2 text-right text-foreground">{row.views.toLocaleString()}</td>
                <td className="px-3 py-2 text-right text-foreground">{row.engagements.toLocaleString()}</td>
                <td className="px-3 py-2 text-right text-foreground">{row.stageMoves}</td>
                <td className="px-3 py-2 text-right">
                  <span className={row.conversionPct >= 10 ? "text-stage-most" : "text-foreground"}>
                    {row.conversionPct.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
