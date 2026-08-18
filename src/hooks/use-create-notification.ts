import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type NotificationChannel = "email" | "sms" | "push";

type CreateNotificationInput = {
  recipient: string;
  channel: NotificationChannel;
  message: string;
  subject?: string;
};

type Notification = {
  id: string;
  recipient: string;
  channel: string;
  status: string;
  createdAt: string;
};

type CreateNotificationResponse = {
  status: string;
  message: string;
  data: Notification;
};

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateNotificationInput) => {
      const res = await api.post<CreateNotificationResponse>(
        "/api/notifications",
        input,
      );
      return res.data.data;
    },
    onSuccess: () => {
      // Dashboard stat cards should reflect the new notification immediately.
      queryClient.invalidateQueries({ queryKey: ["notification-stats"] });
    },
  });
}
