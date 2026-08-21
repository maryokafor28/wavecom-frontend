import { useRecipient } from "@/components/layout/recipient-context";
import { OWNER_EMAIL } from "@/lib/constants";
import type { Recipient } from "@/hooks/use-recipients";

export function useCanDeleteRecipient() {
  const { recipientId: currentRecipientId, recipient: currentRecipient } =
    useRecipient();

  const isOwnerViewer = currentRecipient?.email === OWNER_EMAIL;

  return function canDelete(recipient: Recipient) {
    return recipient.id === currentRecipientId || isOwnerViewer;
  };
}
