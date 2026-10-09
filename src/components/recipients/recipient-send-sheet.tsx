"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  useCreateNotification,
  type NotificationChannel,
} from "@/hooks/use-create-notification";
import { useRecipient } from "@/components/layout/recipient-context";
import type { Recipient } from "@/hooks/use-recipient";

const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  email: "Email",
  sms: "SMS",
  push: "Push",
};

export function RecipientSendSheet({
  open,
  onOpenChangeAction,
  channel,
  recipient,
  target,
}: {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  channel: NotificationChannel;
  recipient: Recipient;
  target: string;
}) {
  const { isGuest, requireIdentification } = useRecipient();
  const { mutate, isPending } = useCreateNotification();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const isFormValid = message.trim() !== "";

  function resetForm() {
    setSubject("");
    setMessage("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid || isPending) return;

    if (isGuest) {
      requireIdentification();
      return;
    }

    mutate(
      {
        recipient: target,
        channel,
        message,
        recipientId: recipient.id,
        ...(channel === "email" && subject ? { subject } : {}),
      },
      {
        onSuccess: () => {
          resetForm();
          onOpenChangeAction(false);
        },
      },
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChangeAction}>
      <SheetContent className="border-border bg-card sm:max-w-md">
        <SheetHeader className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Send {CHANNEL_LABELS[channel]}
          </p>
          <SheetTitle className="text-2xl font-semibold text-foreground">
            Message {recipient.name}
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            This notification will be linked to {recipient.name}&apos;s history,
            timeline, and analytics.
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">To</label>
            <div className="rounded-lg border border-input bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
              {target}
            </div>
          </div>

          {channel === "email" && (
            <div className="space-y-1.5">
              <label
                htmlFor="send-subject"
                className="text-sm font-medium text-foreground"
              >
                Subject
              </label>
              <div className="rounded-lg border border-input bg-background px-3 py-2.5">
                <input
                  id="send-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Quick update"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="send-message"
              className="text-sm font-medium text-foreground"
            >
              Message
            </label>
            <div className="rounded-lg border border-input bg-background px-3 py-2.5">
              <textarea
                id="send-message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
                className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || isPending}
            className="w-full justify-center gap-2 rounded-full"
          >
            {isPending ? "Sending..." : `Send ${CHANNEL_LABELS[channel]}`}
            {!isPending && <Send className="h-4 w-4" />}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
