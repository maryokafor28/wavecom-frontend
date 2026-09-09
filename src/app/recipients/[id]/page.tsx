"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecipientQuery } from "@/hooks/use-recipient";
import { RecipientOverview } from "@/components/recipients/recipient-overview";
import { RecipientHistory } from "@/components/recipients/recipient-history";
import { RecipientTimeline } from "@/components/recipients/recipient-timeline";
import { cn } from "@/lib/utils";

type Tab = "overview" | "history" | "timeline" | "analytics" | "actions";

const TABS: { value: Tab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "history", label: "History" },
  { value: "timeline", label: "Timeline" },
  { value: "analytics", label: "Analytics" },
  { value: "actions", label: "Actions" },
];

export default function RecipientDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const recipientId = params.id;

  const { data: recipient, isLoading } = useRecipientQuery(recipientId);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <main className="p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/recipients")}
        className="gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Recipients
      </Button>

      <div className="mt-4">
        {isLoading ? (
          <>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-foreground">
              {recipient?.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {recipient?.email}
            </p>
          </>
        )}
      </div>

      <div className="mt-6 border-b border-border">
        <nav className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                activeTab === tab.value
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "overview" && recipient && (
          <RecipientOverview recipient={recipient} />
        )}
        {activeTab === "history" && recipient && (
          <RecipientHistory recipientId={recipient.id} />
        )}
        {activeTab === "timeline" && recipient && (
          <RecipientTimeline recipientId={recipient.id} />
        )}
        {activeTab === "analytics" && (
          <p className="text-muted-foreground">
            Analytics content coming soon.
          </p>
        )}
        {activeTab === "actions" && (
          <p className="text-muted-foreground">Actions content coming soon.</p>
        )}
      </div>
    </main>
  );
}
