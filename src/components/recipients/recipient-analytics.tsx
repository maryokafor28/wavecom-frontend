"use client";

import { Mail, MessageSquare, Bell } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { useNotificationAnalytics } from "@/hooks/use-notification-analytics";

const CHANNEL_ICONS: Record<string, React.ElementType> = {
  email: Mail,
  sms: MessageSquare,
  push: Bell,
};

export function RecipientAnalytics({ recipientId }: { recipientId: string }) {
  const { data, isLoading } = useNotificationAnalytics(recipientId);

  const channels = data?.byChannel ? Object.keys(data.byChannel) : [];

  if (!isLoading && channels.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No notification activity yet for this recipient.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Sent by Channel
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(isLoading ? ["email", "sms", "push"] : channels).map((channel) => (
            <StatCard
              key={channel}
              label={channel.toUpperCase()}
              value={data?.byChannel?.[channel] ?? 0}
              isLoading={isLoading}
              icon={CHANNEL_ICONS[channel] ?? Mail}
              tone="primary"
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Success Rate by Channel
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(isLoading ? ["email", "sms", "push"] : channels).map((channel) => (
            <StatCard
              key={channel}
              label={channel.toUpperCase()}
              value={data?.successRateByChannel?.[channel] ?? 0}
              unit="%"
              isLoading={isLoading}
              icon={CHANNEL_ICONS[channel] ?? Mail}
              tone={
                (data?.successRateByChannel?.[channel] ?? 0) >= 50
                  ? "delivered"
                  : "failed"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
