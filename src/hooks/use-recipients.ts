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

type RecipientsResponse = {
  status: string;
  data: Recipient[];
};

export function useRecipients() {
  return useQuery({
    queryKey: ["recipients"],
    queryFn: async () => {
      const res = await api.get<RecipientsResponse>("/api/recipients");
      return res.data.data;
    },
  });
}
