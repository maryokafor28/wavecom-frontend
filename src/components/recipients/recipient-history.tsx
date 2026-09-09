"use client";

import { useState } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";

type StatusTone = "delivered" | "retrying" | "failed";

const STATUS_CONFIG: Record<
  string,
  { icon: React.ElementType; tone: StatusTone }
> = {
  sent: { icon: CheckCircle2, tone: "delivered" },
  delivered: { icon: CheckCircle2, tone: "delivered" },
  failed: { icon: XCircle, tone: "failed" },
  queued: { icon: Clock, tone: "retrying" },
  processing: { icon: Clock, tone: "retrying" },
  retrying: { icon: Clock, tone: "retrying" },
};

const TONE_CLASSES: Record<StatusTone, string> = {
  delivered: "text-status-delivered",
  retrying: "text-status-retrying",
  failed: "text-status-failed",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function RecipientHistory({ recipientId }: { recipientId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotifications({
    recipientId,
    page,
    limit: 10,
  });

  const notifications = data?.notifications;
  const pagination = data?.pagination;

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Channel</th>
              <th className="px-4 py-3 font-medium">Attempts</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3" colSpan={4}>
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))}

            {!isLoading && notifications?.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No notifications sent to this recipient yet.
                </td>
              </tr>
            )}

            {!isLoading &&
              notifications?.map((n) => {
                const config = STATUS_CONFIG[n.status] ?? {
                  icon: Clock,
                  tone: "retrying" as StatusTone,
                };
                const Icon = config.icon;

                return (
                  <tr key={n.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 capitalize text-foreground">
                        <Icon
                          className={cn("h-4 w-4", TONE_CLASSES[config.tone])}
                        />
                        {n.status}
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">
                      {n.channel}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {n.attempts}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(n.createdAt)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {pagination.page} of {pagination.totalPages} (
            {pagination.total} total)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
