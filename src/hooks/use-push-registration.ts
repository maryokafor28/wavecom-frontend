import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "firebase/messaging";
import { api } from "@/lib/api";
import { getFirebaseMessaging, vapidKey } from "@/lib/firebase";

export function usePushRegistration(recipientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        throw new Error("This browser doesn't support push notifications.");
      }

      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        throw new Error("Push isn't supported in this browser.");
      }
      if (!vapidKey) {
        throw new Error("Push isn't configured (missing VAPID key).");
      }

      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        throw new Error(
          "Notifications are blocked. Allow them in your browser's site settings and try again.",
        );
      }
      if (permission !== "granted") {
        throw new Error("Notification permission was not granted.");
      }

      await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      const registration = await navigator.serviceWorker.ready;

      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });
      if (!token) {
        throw new Error("Could not get a push token.");
      }

      await api.patch(`/api/recipients/${recipientId}/push-token`, {
        pushToken: token,
      });

      return token;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipient", recipientId] });
    },
  });
}