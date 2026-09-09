import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Notification = {
  id: string;
  recipient: string;
  recipientId: string | null;
  channel: string;
  status: string;
  provider: string | null;
  attempts: number;
  latency: number | null;
  createdAt: string;
  sentAt?: string;
  failedAt?: string;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type NotificationsResponse = {
  status: string;
  data: {
    notifications: Notification[];
    pagination: Pagination;
  };
};

type UseNotificationsOptions = {
  recipientId?: string;
  limit?: number;
  page?: number;
};

export function useNotifications({
  recipientId,
  limit,
  page,
}: UseNotificationsOptions = {}) {
  return useQuery({
    queryKey: ["notifications", { recipientId, limit, page }],
    queryFn: async () => {
      const res = await api.get<NotificationsResponse>("/api/notifications", {
        params: {
          ...(recipientId ? { recipientId } : {}),
          ...(limit ? { limit } : {}),
          ...(page ? { page } : {}),
        },
      });
      return res.data.data;
    },
  });
}
