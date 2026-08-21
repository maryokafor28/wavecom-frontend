"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteRecipient } from "@/hooks/use-delete-recipient";
import type { Recipient } from "@/hooks/use-recipients";

export function DeleteRecipientDialog({
  recipient,
  onOpenChangeAction,
  onDeletedAction,
}: {
  recipient: Recipient | null;
  onOpenChangeAction: (open: boolean) => void;
  onDeletedAction?: () => void;
}) {
  const { mutate: deleteRecipient, isPending } = useDeleteRecipient();

  function confirmDelete() {
    if (!recipient) return;
    deleteRecipient(recipient.id, {
      onSuccess: () => {
        onOpenChangeAction(false);
        onDeletedAction?.();
      },
    });
  }

  return (
    <AlertDialog open={!!recipient} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete recipient?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">
              {recipient?.name}
            </span>{" "}
            ({recipient?.email}). Their past notifications will remain, but will
            no longer be linked to a recipient. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
