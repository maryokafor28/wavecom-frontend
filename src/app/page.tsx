"use client";

import { useState } from "react";
import NotificationForm from "@/components/NotificationForm";
import NotificationList from "@/components/NotificationList";
import { useRefreshTrigger } from "@/hooks/useRefreshTrigger";
import { useSmartRefresh } from "@/hooks/useSmartRefresh";

export default function Home() {
  const { trigger, refresh } = useRefreshTrigger();
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false); // Disabled by default
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds default

  // Smart auto-refresh - only when tab is visible, longer interval
  useSmartRefresh(
    () => {
      refresh();
    },
    {
      interval: refreshInterval,
      enabled: autoRefreshEnabled,
      onlyWhenVisible: true, // Don't refresh hidden tabs
    }
  );

  const handleNotificationCreated = (notificationId: string) => {
    console.log("Notification created:", notificationId);
    // Refresh immediately when new notification created
    refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                WaveCom Notification System
              </h1>
              <p className="text-gray-600 mt-1">
                Scalable notification delivery for enterprise
              </p>
            </div>

            {/* Auto-refresh controls */}
            <div className="flex items-center gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefreshEnabled}
                  onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Auto-refresh</span>
              </label>

              {autoRefreshEnabled && (
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10000}>10s</option>
                  <option value={30000}>30s</option>
                  <option value={60000}>1min</option>
                </select>
              )}

              <button
                onClick={refresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                🔄 Refresh Now
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <NotificationForm onSuccess={handleNotificationCreated} />
          </div>

          {/* Right Column - List */}
          <div className="lg:col-span-2">
            <NotificationList refreshTrigger={trigger} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>Built with Next.js, Express, MongoDB & RabbitMQ</p>
            <p>WaveCom © 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
