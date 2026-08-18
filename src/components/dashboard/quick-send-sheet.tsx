"use client";

import { useState } from "react";
import { Mail, MessageSquare, Bell, Send } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useCreateNotification,
  type NotificationChannel,
} from "@/hooks/use-create-notification";
import { useRecipient } from "@/components/layout/recipient-context";

const CHANNELS: {
  value: NotificationChannel;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "email", label: "Email", icon: Mail },
  { value: "sms", label: "SMS", icon: MessageSquare },
  { value: "push", label: "Push", icon: Bell },
];

export function QuickSendSheet({
  open,
  onOpenChangeAction,
}: {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}) {
  const { isGuest, requireIdentification } = useRecipient();
  const { mutate, isPending, reset } = useCreateNotification();

  const [channel, setChannel] = useState<NotificationChannel>("email");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const isFormValid = recipient.trim() !== "" && message.trim() !== "";

  function resetForm() {
    setChannel("email");
    setRecipient("");
    setSubject("");
    setMessage("");
    reset();
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
        recipient,
        channel,
        message,
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
            Quick Send
          </p>
          <SheetTitle className="text-2xl font-semibold text-foreground">
            Send a Notification
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Send a one-off notification to any email, phone, or device token —
            no saved recipient needed.
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Channel
            </label>
            <div className="flex items-center gap-1 rounded-lg border border-input bg-background p-1">
              {CHANNELS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setChannel(value)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm transition-colors",
                    channel === value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="recipient"
              className="text-sm font-medium text-foreground"
            >
              Recipient
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5">
              <input
                id="recipient"
                type="text"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={
                  channel === "email"
                    ? "jane@example.com"
                    : channel === "sms"
                      ? "+1 555 000 0000"
                      : "device-token-..."
                }
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {channel === "email" && (
            <div className="space-y-1.5">
              <label
                htmlFor="subject"
                className="text-sm font-medium text-foreground"
              >
                Subject
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5">
                <input
                  id="subject"
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
              htmlFor="message"
              className="text-sm font-medium text-foreground"
            >
              Message
            </label>
            <div className="rounded-lg border border-input bg-background px-3 py-2.5">
              <textarea
                id="message"
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
            {isPending ? "Sending..." : "Send Notification"}
            {!isPending && <Send className="h-4 w-4" />}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
