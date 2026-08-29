import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Recipient = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferredChannel: string;
  createdAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type RecipientsResponse = {
  status: string;
  data: Recipient[];
  pagination: Pagination;
};

export function useRecipients(page: number, limit: number = 10) {
  return useQuery({
    queryKey: ["recipients", page, limit],
    queryFn: async () => {
      const res = await api.get<RecipientsResponse>("/api/recipients", {
        params: { page, limit },
      });
      return res.data;
    },
  });
}
