import { useState } from "react";
import { toast } from "sonner";
import { Link2, Unlink, Users } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  useSocialPlatforms,
  useTogglePlatformConnection,
} from "@/hooks/use-social-platforms";

const PLATFORM_ICONS: Record<string, string> = {
  LinkedIn: "in",
  Twitter: "X",
  Facebook: "fb",
  Instagram: "ig",
  YouTube: "yt",
  TikTok: "tk",
};

const PLATFORM_COLORS: Record<string, string> = {
  LinkedIn: "text-[#0A66C2]",
  Twitter: "text-foreground",
  Facebook: "text-[#1877F2]",
  Instagram: "text-[#E4405F]",
  YouTube: "text-[#FF0000]",
  TikTok: "text-foreground",
};

export function ConnectPlatformSheet() {
  const [open, setOpen] = useState(false);
  const { data: platforms, isLoading } = useSocialPlatforms();
  const toggleConnection = useTogglePlatformConnection();

  const handleToggle = (id: string, currentlyConnected: boolean) => {
    toggleConnection.mutate(
      { id, is_connected: !currentlyConnected },
      {
        onSuccess: () => {
          toast.success(
            currentlyConnected
              ? "Platform disconnected"
              : "Platform connected"
          );
        },
        onError: () => toast.error("Failed to update connection"),
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-xs font-mono gap-1"
        >
          <Link2 size={14} /> Platforms
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-mono">Social Platforms</SheetTitle>
          <SheetDescription>
            Connect your social platforms to track content metrics automatically
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          {isLoading ? (
            <p className="text-xs font-mono text-muted-foreground">
              Loading platforms...
            </p>
          ) : (
            (platforms ?? []).map((platform) => (
              <div
                key={platform.id}
                className={`flex items-center gap-3 rounded border p-3 transition-colors ${
                  platform.is_connected
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded flex items-center justify-center text-xs font-mono font-bold ${
                    platform.is_connected
                      ? "bg-primary/15"
                      : "bg-muted/50"
                  } ${PLATFORM_COLORS[platform.platform_name] ?? "text-foreground"}`}
                >
                  {PLATFORM_ICONS[platform.platform_name] ??
                    platform.platform_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-foreground">
                    {platform.platform_name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {platform.account_handle}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {platform.is_connected && (
                    <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                      <Users size={10} />
                      {platform.followers_count.toLocaleString()}
                    </div>
                  )}
                  <Switch
                    checked={platform.is_connected}
                    onCheckedChange={() =>
                      handleToggle(platform.id, platform.is_connected)
                    }
                  />
                </div>
              </div>
            ))
          )}
          <div className="border-t border-border pt-3 mt-4">
            <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
              Connected platforms will automatically pull engagement metrics for
              posted content. OAuth integration coming soon — for now, metrics
              can be updated manually or via the API.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
