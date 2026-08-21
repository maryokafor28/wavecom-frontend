import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useDeleteRecipient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/recipients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipients"] });
    },
  });
}
