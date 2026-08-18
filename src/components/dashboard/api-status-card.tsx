import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function ApiStatusCard({
  isLoading,
  isError,
}: {
  isLoading: boolean;
  isError: boolean;
}) {
  const status = isLoading ? "checking" : isError ? "down" : "healthy";

  const statusText = {
    checking: "Checking...",
    healthy: "Healthy",
    down: "Unreachable",
  }[status];

  const dotClass = {
    checking: "bg-muted-foreground",
    healthy: "bg-status-delivered",
    down: "bg-status-failed",
  }[status];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 shrink-0 text-primary" />
        <span className="text-sm text-muted-foreground">API Status</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            dotClass,
            status === "healthy" && "animate-pulse",
          )}
        />
        <p className="text-2xl font-semibold text-foreground">{statusText}</p>
      </div>
    </div>
  );
}
