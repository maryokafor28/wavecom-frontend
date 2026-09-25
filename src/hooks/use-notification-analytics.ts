import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type NotificationAnalytics = {
  perHour: { hour: string; count: number }[];
  byChannel: Record<string, number>;
  successRateByChannel: Record<string, number>;
};

type NotificationAnalyticsResponse = {
  status: string;
  data: NotificationAnalytics;
};

export function useNotificationAnalytics(recipientId?: string) {
  return useQuery({
    queryKey: ["notification-analytics", recipientId ?? "all"],
    queryFn: async () => {
      const res = await api.get<NotificationAnalyticsResponse>(
        "/api/notifications/analytics",
        {
          params: recipientId ? { recipientId } : undefined,
        },
      );
      return res.data.data;
    },
  });
}
