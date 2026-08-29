import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

type CreateRecipientInput = {
  name: string;
  email: string;
  phone?: string;
  preferredChannel?: string;
};

type Recipient = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferredChannel: string;
  createdAt: string;
};

type CreateRecipientResponse = {
  status: string;
  message: string;
  data: Recipient;
  isNew: boolean;
};

export function useCreateRecipient() {
  return useMutation({
    mutationFn: async (input: CreateRecipientInput) => {
      const res = await api.post<CreateRecipientResponse>("/api/recipients", {
        ...input,
        preferredChannel: input.preferredChannel ?? "email",
      });
      return res.data;
    },
  });
}
