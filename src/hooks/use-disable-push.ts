import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteToken } from "firebase/messaging";
import { api } from "@/lib/api";
import { getFirebaseMessaging } from "@/lib/firebase";

export function useDisablePush(recipientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Invalidate this browser's token with Firebase. If that fails, still
      // clear it on the server so the UI doesn't get stuck.
      try {
        const messaging = await getFirebaseMessaging();
        if (messaging) await deleteToken(messaging);
      } catch (error) {
        console.warn("Could not delete the browser push token", error);
      }

      await api.delete(`/api/recipients/${recipientId}/push-token`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipient", recipientId] });
    },
  });
}