"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecipients, type Recipient } from "@/hooks/use-recipients";
import { useCanDeleteRecipient } from "@/hooks/use-recipient-permission";
import { DeleteRecipientDialog } from "@/components/recipients/delete-recipient-dialog";

export function RecipientsTable() {
  const router = useRouter();
  const { data: recipients, isLoading } = useRecipients();
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Recipient | null>(null);

  const canDelete = useCanDeleteRecipient();

  const filtered = recipients?.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
    );
  });

  function goToDetail(id: string) {
    router.push(`/recipients/${id}`);
  }

  return (
    <div>
      <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 sm:max-w-xs">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Channel</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3" colSpan={5}>
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))}

            {!isLoading && filtered?.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No recipients match your search.
                </td>
              </tr>
            )}

            {!isLoading &&
              filtered?.map((recipient) => (
                <tr
                  key={recipient.id}
                  onClick={() => goToDetail(recipient.id)}
                  className="cursor-pointer border-t border-border hover:bg-muted/30"
                >
                  <td className="px-4 py-3 text-foreground">
                    {recipient.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {recipient.email}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">
                    {recipient.preferredChannel}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(recipient.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className="px-4 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-0 focus-visible:ring-0">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-xs"
                          onClick={() => goToDetail(recipient.id)}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs"
                          onClick={() => goToDetail(recipient.id)}
                        >
                          Send Notification
                        </DropdownMenuItem>
                        {canDelete(recipient) && (
                          <DropdownMenuItem
                            className="text-xs"
                            variant="destructive"
                            onClick={() => setPendingDelete(recipient)}
                          >
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <DeleteRecipientDialog
        recipient={pendingDelete}
        onOpenChangeAction={(open) => !open && setPendingDelete(null)}
      />
    </div>
  );
}
