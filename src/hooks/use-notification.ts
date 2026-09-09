import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type StatusHistoryEntry = {
  status: string;
  timestamp: string;
  detail?: string;
};

export type NotificationDetail = {
  id: string;
  recipient: string;
  recipientId: string | null;
  message: string;
  channel: string;
  subject?: string;
  status: string;
  attempts: number;
  maxAttempts: number;
  lastAttemptAt?: string;
  sentAt?: string;
  failedAt?: string;
  error?: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
};

type NotificationDetailResponse = {
  status: string;
  data: NotificationDetail;
};

export function useNotification(notificationId: string | null) {
  return useQuery({
    queryKey: ["notification", notificationId],
    queryFn: async () => {
      const res = await api.get<NotificationDetailResponse>(
        `/api/notifications/${notificationId}`,
      );
      return res.data.data;
    },
    enabled: !!notificationId,
  });
}
