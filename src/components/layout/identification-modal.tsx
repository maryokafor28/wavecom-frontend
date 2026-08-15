"use client";

import { useState } from "react";
import { User, Mail, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRecipient } from "@/components/layout/recipient-context";
import { useCreateRecipient } from "@/hooks/use-create-recipient";
import { setStoredRecipientId } from "@/lib/recipient-storage";

export function IdentificationModal() {
  const { showIdentificationModal, setRecipientId, continueAsGuest } =
    useRecipient();
  const { mutate, isPending } = useCreateRecipient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const isFormValid = name.trim() !== "" && email.trim() !== "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid || isPending) return;

    mutate(
      { name, email },
      {
        onSuccess: (response) => {
          setStoredRecipientId(response.data.id);
          setRecipientId(response.data.id);
          // response.isNew tells you whether this was a fresh signup
          // or a returning recipient — available if you want to show
          // a different message for either case later.
        },
      },
    );
  }

  return (
    <Dialog open={showIdentificationModal} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="border-border bg-card sm:max-w-lg"
      >
        <DialogHeader className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Get Started
          </p>
          <DialogTitle className="text-2xl font-semibold text-foreground">
            See Your Own Personalized Dashboard
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Just your name and email no password required. You&apos;ll get a
            welcome email right away.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              Your name
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                id="name"
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
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Your email
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || isPending}
            className="w-full justify-center gap-2 rounded-full"
          >
            {isPending ? "Setting up..." : "Continue"}
            {!isPending && <ArrowRight className="h-4 w-4" />}
          </Button>

          <button
            type="button"
            onClick={continueAsGuest}
            className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Just exploring? Continue as guest
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
