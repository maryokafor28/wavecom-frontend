import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Recipient = {
  id: string;
  name: string;
  email: string;
  preferredChannel: string;
  createdAt: string;
};

type GetRecipientResponse = {
  status: string;
  data: Recipient;
};

export function useRecipientQuery(recipientId: string | null) {
  return useQuery({
    queryKey: ["recipient", recipientId],
    queryFn: async () => {
      const res = await api.get<GetRecipientResponse>(
        `/api/recipients/${recipientId}`,
      );
      return res.data.data;
    },
    enabled: !!recipientId,
  });
}
