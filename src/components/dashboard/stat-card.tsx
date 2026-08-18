import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatCardTone = "primary" | "delivered" | "retrying" | "failed";

const TONE_CLASSES: Record<StatCardTone, string> = {
  primary: "text-primary",
  delivered: "text-status-delivered",
  retrying: "text-status-retrying",
  failed: "text-status-failed",
};

export function StatCard({
  label,
  value,
  unit,
  isLoading,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  unit?: string;
  isLoading: boolean;
  icon: React.ElementType;
  tone?: StatCardTone;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4 shrink-0", TONE_CLASSES[tone])} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>

      {isLoading ? (
        <Skeleton className="mt-4 h-8 w-20" />
      ) : (
        <p className="mt-3 flex items-baseline gap-1 text-2xl font-semibold text-foreground">
          {value}
          {unit && (
            <span className="text-sm font-medium text-muted-foreground">
              {unit}
            </span>
          )}
        </p>
      )}
    </div>
  );
}
