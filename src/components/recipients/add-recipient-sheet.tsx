"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Mail, MessageSquare, Bell, UserPlus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreateRecipient } from "@/hooks/use-create-recipient";

const CHANNELS: {
  value: "email" | "sms" | "push";
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "email", label: "Email", icon: Mail },
  { value: "sms", label: "SMS", icon: MessageSquare },
  { value: "push", label: "Push", icon: Bell },
];

export function AddRecipientSheet({
  open,
  onOpenChangeAction,
}: {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateRecipient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredChannel, setPreferredChannel] = useState<
    "email" | "sms" | "push"
  >("email");

  const isFormValid = name.trim() !== "" && email.trim() !== "";

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setPreferredChannel("email");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid || isPending) return;

    mutate(
      {
        name,
        email,
        ...(phone.trim() ? { phone } : {}),
        preferredChannel,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["recipients"] });
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
            Add Recipient
          </p>
          <SheetTitle className="text-2xl font-semibold text-foreground">
            Add a New Recipient
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            They&apos;ll receive a welcome email right away, unless they&apos;re
            already registered.
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 pt-2">
          <div className="space-y-1.5">
            <label
              htmlFor="add-name"
              className="text-sm font-medium text-foreground"
            >
              Name
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5">
              <input
                id="add-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="add-email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5">
              <input
                id="add-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="add-phone"
              className="text-sm font-medium text-foreground"
            >
              Phone <span className="text-muted-foreground">(optional)</span>
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5">
              <input
                id="add-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 000 0000"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
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

          <Button
            type="submit"
            disabled={!isFormValid || isPending}
            className="w-full mt-6 justify-center gap-2 rounded-full"
          >
            {isPending ? "Adding..." : "Add Recipient"}
            {!isPending && <UserPlus className="h-4 w-4" />}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
