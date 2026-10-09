import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Recipient } from "@/hooks/use-recipient";

type UpdateRecipientInput = {
  name?: string;
  phone?: string | null;
  preferredChannel?: string;
};

type UpdateRecipientResponse = {
  status: string;
  message: string;
  data: Recipient;
};

export function useUpdateRecipient(recipientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateRecipientInput) => {
      const res = await api.patch<UpdateRecipientResponse>(
        `/api/recipients/${recipientId}`,
        input,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipient", recipientId] });
      queryClient.invalidateQueries({ queryKey: ["recipients"] });
    },
  });
}
