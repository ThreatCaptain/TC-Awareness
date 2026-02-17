import { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Target,
  Magnet,
  Settings,
  Kanban,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: BarChart3, label: "Pipeline", id: "pipeline" },
  { icon: FileText, label: "Content", id: "content" },
  { icon: Kanban, label: "Strategy", id: "content-strategy" },
  { icon: Target, label: "ICP Fit", id: "icp" },
  { icon: Magnet, label: "Lead Magnets", id: "magnets" },
  { icon: Settings, label: "Settings", id: "settings" },
];

export function NavRail() {
  const [active, setActive] = useState("dashboard");
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav
      className="flex flex-col items-center border-r border-border bg-sidebar py-4 gap-1 w-12 shrink-0"
      onMouseLeave={() => setHovered(null)}
    >
      {navItems.map(item => (
        <div key={item.id} className="relative">
          <button
            onClick={() => setActive(item.id)}
            onMouseEnter={() => setHovered(item.id)}
            className={`h-9 w-9 flex items-center justify-center rounded transition-colors ${
              active === item.id
                ? "bg-primary/15 text-primary"
                : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
            }`}
          >
            <item.icon size={18} strokeWidth={1.5} />
          </button>
          {hovered === item.id && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 whitespace-nowrap bg-card border border-border px-2 py-1 rounded text-xs font-mono text-foreground shadow-lg">
              {item.label}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
