"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipientsTable } from "@/components/recipients/recipients-table";
import { AddRecipientSheet } from "@/components/recipients/add-recipient-sheet";

export default function RecipientsPage() {
  const [addRecipientOpen, setAddRecipientOpen] = useState(false);

  return (
    <main className="p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Recipients</h1>

        <Button
          size="sm"
          onClick={() => setAddRecipientOpen(true)}
          className="gap-2"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add Recipient
        </Button>
      </div>

      <div className="mt-6">
        <RecipientsTable />
      </div>

      <AddRecipientSheet
        open={addRecipientOpen}
        onOpenChangeAction={setAddRecipientOpen}
      />
    </main>
  );
}
