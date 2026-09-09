"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";
import { useNotification } from "@/hooks/use-notification";

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  queued: Clock,
  processing: Clock,
  retrying: Clock,
  sent: CheckCircle2,
  delivered: CheckCircle2,
  failed: XCircle,
};

const STATUS_TONE: Record<string, string> = {
  pending: "text-muted-foreground",
  queued: "text-status-retrying",
  processing: "text-status-retrying",
  retrying: "text-status-retrying",
  sent: "text-status-delivered",
  delivered: "text-status-delivered",
  failed: "text-status-failed",
};

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "medium",
  });
}

export function RecipientTimeline({ recipientId }: { recipientId: string }) {
  const { data: notificationsData, isLoading: listLoading } = useNotifications({
    recipientId,
    limit: 1,
  });

  const lastNotification = notificationsData?.notifications?.[0];

  const { data: detail, isLoading: detailLoading } = useNotification(
    lastNotification?.id ?? null,
  );

  const isLoading = listLoading || detailLoading;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!lastNotification || !detail) {
    return (
      <p className="text-sm text-muted-foreground">
        No notifications sent to this recipient yet.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        Most recent notification — {detail.channel}
      </div>

      <ol className="space-y-4">
        {detail.statusHistory.map((entry, i) => {
          const Icon = STATUS_ICONS[entry.status] ?? Clock;
          const tone = STATUS_TONE[entry.status] ?? "text-muted-foreground";
          const isLast = i === detail.statusHistory.length - 1;

          return (
            <li key={i} className="relative flex gap-3 pb-4">
              {!isLast && (
                <span className="absolute left-2.25 top-6 h-full w-px bg-border" />
              )}
              <Icon className={cn("h-4.5 w-4.5 shrink-0", tone)} />
              <div>
                <p className="text-sm font-medium capitalize text-foreground">
                  {entry.status}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(entry.timestamp)}
                </p>
                {entry.detail && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {entry.detail}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
