"use client";

import { createContext, useContext, useState } from "react";
import { useRecipientQuery, type Recipient } from "@/hooks/use-recipient";
import {
  getStoredRecipientId,
  getGuestMode,
  setGuestMode,
} from "@/lib/recipient-storage";

type DataScope = "mine" | "all";

type RecipientContextValue = {
  recipientId: string | null;
  recipient: Recipient | null;
  isLoading: boolean;
  isGuest: boolean;
  showIdentificationModal: boolean;
  setRecipientId: (id: string) => void;
  continueAsGuest: () => void;
  requireIdentification: () => void;
  dataScope: DataScope;
  toggleDataScope: () => void;
};

const RecipientContext = createContext<RecipientContextValue | null>(null);

export function RecipientProvider({ children }: { children: React.ReactNode }) {
  const [recipientId, setRecipientId] = useState<string | null>(() =>
    getStoredRecipientId(),
  );
  const [isGuest, setIsGuest] = useState<boolean>(() => getGuestMode());
  const [forceModalOpen, setForceModalOpen] = useState(false);

  const { data: recipient, isLoading } = useRecipientQuery(recipientId);
  const [dataScope, setDataScope] = useState<DataScope>("mine");

  function continueAsGuest() {
    console.log("guest clicked");
    setGuestMode(true);
    setIsGuest(true);
    setForceModalOpen(false);
  }
  function toggleDataScope() {
    setDataScope((prev) => (prev === "mine" ? "all" : "mine"));
  }

  function requireIdentification() {
    // Used later by actions (e.g. Quick Send) that need a real
    // identity even if the visitor is currently in guest mode.
    setForceModalOpen(true);
  }

  function handleSetRecipientId(id: string) {
    clearGuestOnIdentify();
    setRecipientId(id);
  }

  function clearGuestOnIdentify() {
    setGuestMode(false);
    setIsGuest(false);
    setForceModalOpen(false);
  }

  const showIdentificationModal = (!recipientId && !isGuest) || forceModalOpen;

  return (
    <RecipientContext.Provider
      value={{
        recipientId,
        recipient: recipient ?? null,
        isLoading: !!recipientId && isLoading,
        isGuest,
        showIdentificationModal,
        dataScope,
        setRecipientId: handleSetRecipientId,
        continueAsGuest,
        requireIdentification,
        toggleDataScope,
      }}
    >
      {children}
    </RecipientContext.Provider>
  );
}

export function useRecipient() {
  const ctx = useContext(RecipientContext);
  if (!ctx) {
    throw new Error("useRecipient must be used within RecipientProvider");
  }
  return ctx;
}
