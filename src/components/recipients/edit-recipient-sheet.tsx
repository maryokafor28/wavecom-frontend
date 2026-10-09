"use client";

import { useState } from "react";
import { Mail, MessageSquare, Bell, Save } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUpdateRecipient } from "@/hooks/use-update-recipient";
import type { Recipient } from "@/hooks/use-recipient";

type Channel = "email" | "sms" | "push";

const CHANNELS: { value: Channel; label: string; icon: React.ElementType }[] = [
  { value: "email", label: "Email", icon: Mail },
  { value: "sms", label: "SMS", icon: MessageSquare },
  { value: "push", label: "Push", icon: Bell },
];

export function EditRecipientSheet({
  open,
  onOpenChangeAction,
  recipient,
}: {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  recipient: Recipient;
}) {
  const { mutate, isPending, error } = useUpdateRecipient(recipient.id);

  const [name, setName] = useState(recipient.name);
  const [phone, setPhone] = useState(recipient.phone ?? "");
  const [preferredChannel, setPreferredChannel] = useState<Channel>(
    recipient.preferredChannel as Channel,
  );

  const isFormValid = name.trim() !== "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid || isPending) return;

    mutate(
      {
        name: name.trim(),
        phone: phone.trim() === "" ? null : phone.trim(),
        preferredChannel,
      },
      { onSuccess: () => onOpenChangeAction(false) },
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChangeAction}>
      <SheetContent className="border-border bg-card sm:max-w-md">
        <SheetHeader className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Edit Recipient
          </p>
          <SheetTitle className="text-2xl font-semibold text-foreground">
            Update Details
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Email can&apos;t be changed since it identifies this recipient.
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="rounded-lg border border-input bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
              {recipient.email}
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="edit-name"
              className="text-sm font-medium text-foreground"
            >
              Name
            </label>
            <div className="rounded-lg border border-input bg-background px-3 py-2.5">
              <input
                id="edit-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="edit-phone"
              className="text-sm font-medium text-foreground"
            >
              Phone <span className="text-muted-foreground">(optional)</span>
            </label>
            <div className="rounded-lg border border-input bg-background px-3 py-2.5">
              <input
                id="edit-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 706 000 0000"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Include the country code, e.g. +234.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Preferred Channel
            </label>
            <div className="flex items-center gap-1 rounded-lg border border-input bg-background p-1">
              {CHANNELS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPreferredChannel(value)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm transition-colors",
                    preferredChannel === value
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

          {error && <p className="text-sm text-destructive">{error.message}</p>}

          <Button
            type="submit"
            disabled={!isFormValid || isPending}
            className="w-full justify-center gap-2 rounded-full"
          >
            {isPending ? "Saving..." : "Save Changes"}
            {!isPending && <Save className="h-4 w-4" />}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
