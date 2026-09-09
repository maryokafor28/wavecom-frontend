"use client";

import { Mail, Phone, Radio, Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/hooks/use-notifications";
import { useNotificationStats } from "@/hooks/use-notification-stats";
import type { Recipient } from "@/hooks/use-recipient";

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function RecipientOverview({ recipient }: { recipient: Recipient }) {
  const { data: notificationsData, isLoading: lastNotifLoading } =
    useNotifications({ recipientId: recipient.id, limit: 1 });

  const { data: stats, isLoading: statsLoading } = useNotificationStats(
    recipient.id,
  );

  const lastNotification = notificationsData?.notifications?.[0];

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-muted-foreground">
          Basic Info
        </h3>

        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-primary" />
            <div>
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd className="text-sm text-foreground">{recipient.email}</dd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-primary" />
            <div>
              <dt className="text-xs text-muted-foreground">Phone</dt>
              <dd className="text-sm text-foreground">
                {recipient.phone || "Not set"}
              </dd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 shrink-0 text-primary" />
            <div>
              <dt className="text-xs text-muted-foreground">
                Preferred Channel
              </dt>
              <dd className="text-sm capitalize text-foreground">
                {recipient.preferredChannel}
              </dd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 shrink-0 text-primary" />
            <div>
              <dt className="text-xs text-muted-foreground">Push</dt>
              <dd className="text-sm text-foreground">Not registered</dd>
            </div>
          </div>
        </dl>
      </div>

      {/* At-a-glance summary */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-muted-foreground">Snapshot</h3>

        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Last Notification</dt>
            {lastNotifLoading ? (
              <Skeleton className="mt-1 h-5 w-16" />
            ) : (
              <dd className="mt-1 text-sm font-medium text-foreground">
                {lastNotification
                  ? formatRelativeTime(lastNotification.createdAt)
                  : "—"}
              </dd>
            )}
          </div>

          <div>
            <dt className="text-xs text-muted-foreground">Last Status</dt>
            {lastNotifLoading ? (
              <Skeleton className="mt-1 h-5 w-16" />
            ) : (
              <dd className="mt-1 text-sm font-medium capitalize text-foreground">
                {lastNotification?.status ?? "—"}
              </dd>
            )}
          </div>

          <div>
            <dt className="text-xs text-muted-foreground">
              Total Notifications
            </dt>
            {statsLoading ? (
              <Skeleton className="mt-1 h-5 w-10" />
            ) : (
              <dd className="mt-1 text-sm font-medium text-foreground">
                {stats?.total ?? 0}
              </dd>
            )}
          </div>

          <div>
            <dt className="text-xs text-muted-foreground">Average Delivery</dt>
            {statsLoading ? (
              <Skeleton className="mt-1 h-5 w-16" />
            ) : (
              <dd className="mt-1 text-sm font-medium text-foreground">
                {(stats?.avgDeliveryTimeMs ?? 0).toLocaleString()} ms
              </dd>
            )}
          </div>
        </dl>
      </div>
    </div>
  );
}
