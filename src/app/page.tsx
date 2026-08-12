"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function Home() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await api.get("/health");
      return response.data;
    },
  });

  if (isLoading) {
    return <p>checking wavecom...</p>;
  }
  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <main>
      <h1>wavecom </h1>
      <p>{data.message}</p>
    </main>
  );
}
