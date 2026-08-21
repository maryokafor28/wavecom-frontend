import { RecipientsTable } from "@/components/recipients/recipients-table";

export default function RecipientsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-foreground">Recipients</h1>
      <div className="mt-6">
        <RecipientsTable />
      </div>
    </main>
  );
}
