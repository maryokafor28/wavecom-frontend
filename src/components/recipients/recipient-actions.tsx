"use client";

import { useState } from "react";
import { Mail, MessageSquare, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipientSendSheet } from "@/components/recipients/recipient-send-sheet";
import type { NotificationChannel } from "@/hooks/use-create-notification";
import type { Recipient } from "@/hooks/use-recipient";

export function RecipientActions({ recipient }: { recipient: Recipient }) {
  const [activeChannel, setActiveChannel] =
    useState<NotificationChannel | null>(null);

  const actions: {
    channel: NotificationChannel;
    label: string;
    icon: React.ElementType;
    target: string | undefined;
    disabledReason: string;
  }[] = [
    {
      channel: "email",
      label: "Send Email",
      icon: Mail,
      target: recipient.email,
      disabledReason: "",
    },
    {
      channel: "sms",
      label: "Send SMS",
      icon: MessageSquare,
      target: recipient.phone,
      disabledReason: "No phone number set",
    },
    {
      channel: "push",
      label: "Send Push",
      icon: Bell,
      target: undefined,
      disabledReason: "Push not registered",
    },
  ];

  const active = actions.find((a) => a.channel === activeChannel);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {actions.map(
          ({ channel, label, icon: Icon, target, disabledReason }) => (
            <div
              key={channel}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {channel.toUpperCase()}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={!target}
                onClick={() => setActiveChannel(channel)}
                className="mt-4 w-full"
              >
                {label}
              </Button>

              {!target && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {disabledReason}
                </p>
              )}
            </div>
          ),
        )}
      </div>

      {active && active.target && (
        <RecipientSendSheet
          open={!!activeChannel}
          onOpenChangeAction={(open) => !open && setActiveChannel(null)}
          channel={active.channel}
          recipient={recipient}
          target={active.target}
        />
      )}
    </div>
  );
}
