"use client";

import { useState, useEffect, useCallback } from "react";
import { notificationApi } from "@/services/api";
import { Notification } from "@/types";
import StatusBadge from "./StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { getErrorMessage } from "@/utils/error";

interface NotificationListProps {
  refreshTrigger?: number;
}

export default function NotificationList({
  refreshTrigger,
}: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = filter !== "all" ? { status: filter } : {};
      const response = await notificationApi.listNotifications(params);

      if (response.status === "success" && response.data) {
        setNotifications(response.data.notifications);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, refreshTrigger]);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return "📧";
      case "sms":
        return "📱";
      case "push":
        return "🔔";
      default:
        return "📨";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>

        {/* Filter Dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="queued">Queued</option>
          <option value="processing">Processing</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">No notifications found</p>
          <p className="text-sm mt-2">
            Create your first notification using the form above
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {getChannelIcon(notification.channel)}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {notification.recipient}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <StatusBadge status={notification.status} />
              </div>

              <p className="text-gray-700 text-sm mb-2">
                {notification.message}
              </p>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Attempts: {notification.attempts}</span>
                {notification.sentAt && (
                  <span className="text-green-600">
                    Sent{" "}
                    {formatDistanceToNow(new Date(notification.sentAt), {
                      addSuffix: true,
                    })}
                  </span>
                )}
                {notification.error && (
                  <span className="text-red-600" title={notification.error}>
                    Error: {notification.error.substring(0, 30)}...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
