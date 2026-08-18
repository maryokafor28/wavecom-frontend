"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Hash,
  CheckCircle2,
  Clock,
  RotateCw,
  AlertTriangle,
  TrendingUp,
  Timer,
  RefreshCcw,
  Zap,
} from "lucide-react";

import { api } from "@/lib/api";
import { useNotificationStats } from "@/hooks/use-notification-stats";
import { StatCard } from "@/components/dashboard/stat-card";
import { ApiStatusCard } from "@/components/dashboard/api-status-card";
import { QuickSendSheet } from "@/components/dashboard/quick-send-sheet";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [quickSendOpen, setQuickSendOpen] = useState(false);

  const { isLoading, isError } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await api.get("/health");
      return response.data;
    },
  });

  const { data: stats, isLoading: statsLoading } = useNotificationStats();

  return (
    <main className="p-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor your notification activity and performance.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setQuickSendOpen(true)}
          className="gap-2"
        >
          <Zap className="h-3.5 w-3.5" />
          Quick Send
        </Button>
      </div>

      {/* Status Overview */}
      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Status Overview
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            label="Total Notifications"
            value={stats?.total ?? 0}
            isLoading={statsLoading}
            icon={Hash}
            tone="primary"
          />

          <StatCard
            label="Delivered"
            value={stats?.delivered ?? 0}
            isLoading={statsLoading}
            icon={CheckCircle2}
            tone="delivered"
          />

          <StatCard
            label="Queued"
            value={stats?.queued ?? 0}
            isLoading={statsLoading}
            icon={Clock}
            tone="retrying"
          />

          <StatCard
            label="Processing"
            value={stats?.processing ?? 0}
            isLoading={statsLoading}
            icon={RotateCw}
            tone="retrying"
          />

          <StatCard
            label="Failed"
            value={stats?.failed ?? 0}
            isLoading={statsLoading}
            icon={AlertTriangle}
            tone="failed"
          />
        </div>
      </section>

      {/* Performance */}
      <section className="mt-8 border-t border-border pt-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Performance
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            label="Delivery Rate"
            value={stats?.deliveryRate ?? 0}
            unit="%"
            isLoading={statsLoading}
            icon={TrendingUp}
            tone="primary"
          />

          <StatCard
            label="Average Delivery Time"
            value={(stats?.avgDeliveryTimeMs ?? 0).toLocaleString()}
            unit="ms"
            isLoading={statsLoading}
            icon={Timer}
            tone="primary"
          />

          <StatCard
            label="Retry Rate"
            value={stats?.retryRate ?? 0}
            unit="%"
            isLoading={statsLoading}
            icon={RefreshCcw}
            tone="primary"
          />
        </div>
      </section>

      {/* System */}
      <section className="mt-8 border-t border-border pt-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          System
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ApiStatusCard isLoading={isLoading} isError={isError} />
        </div>
      </section>

      {/* Quick Send */}
      <QuickSendSheet
        open={quickSendOpen}
        onOpenChangeAction={setQuickSendOpen}
      />
    </main>
  );
}
