import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type NotificationStats = {
  total: number;
  delivered: number;
  queued: number;
  processing: number;
  failed: number;
  deliveryRate: number;
  avgDeliveryTimeMs: number;
  retryRate: number;
};

type NotificationStatsResponse = {
  status: string;
  data: NotificationStats;
};

export function useNotificationStats(recipientId?: string | null) {
  return useQuery({
    queryKey: ["notification-stats", recipientId ?? "all"],
    queryFn: async () => {
      const res = await api.get<NotificationStatsResponse>(
        "/api/notifications/stats",
        {
          params: recipientId ? { recipientId } : undefined,
        },
      );
      return res.data.data;
    },
  });
}
