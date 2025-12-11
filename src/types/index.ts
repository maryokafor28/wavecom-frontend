// Notification channels
export type NotificationChannel = "email" | "sms" | "push";

// Notification status
export type NotificationStatus =
  | "pending"
  | "queued"
  | "processing"
  | "sent"
  | "failed";

// Notification object (from API)
export interface Notification {
  id: string;
  recipient: string;
  message: string;
  channel: NotificationChannel;
  subject?: string;
  status: NotificationStatus;
  attempts: number;
  maxAttempts?: number;
  lastAttemptAt?: string;
  sentAt?: string;
  failedAt?: string;
  error?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}

// Create notification request
export interface CreateNotificationRequest {
  recipient: string;
  message: string;
  channel: NotificationChannel;
  subject?: string;
  metadata?: Record<string, any>;
}

// API response wrapper
export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
  error?: string;
}

// List response with pagination
export interface NotificationListResponse {
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
