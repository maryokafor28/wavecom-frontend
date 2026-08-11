import { api } from "@/lib/api";

export default async function Home() {
  const response = await api.get("/health");
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-semibold text-foreground">WaveCom</h1>
      <br /> <p className="font-mono text-foreground"></p>
      Monospace text in JetBrains Mono{" "}
      <p className="font-sans text-foreground">Body text in inter </p>
      <p>{response.data.message}</p>
    </main>
  );
}
