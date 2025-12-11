import axios from "axios";
import {
  Notification,
  CreateNotificationRequest,
  ApiResponse,
  NotificationListResponse,
} from "@/types";

// Base API URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Health check response type
interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp: string;
}

// API service functions
export const notificationApi = {
  // Create a new notification
  async createNotification(
    data: CreateNotificationRequest
  ): Promise<ApiResponse<{ id: string; status: string; createdAt: string }>> {
    try {
      const response = await apiClient.post("/api/notifications", data);
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      if (axios.isAxiosError(error)) {
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unexpected error occurred" };
    }
  },

  // Get single notification by ID
  async getNotification(id: string): Promise<ApiResponse<Notification>> {
    try {
      const response = await apiClient.get(`/api/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notification:", error);
      if (axios.isAxiosError(error)) {
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unexpected error occurred" };
    }
  },

  // List all notifications with optional filters
  async listNotifications(params?: {
    status?: string;
    channel?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<NotificationListResponse>> {
    try {
      const response = await apiClient.get("/api/notifications", { params });
      return response.data;
    } catch (error) {
      console.error("Error listing notifications:", error);
      if (axios.isAxiosError(error)) {
        throw error.response?.data || { message: error.message };
      }
      throw { message: "An unexpected error occurred" };
    }
  },

  // Health check
  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      const response = await apiClient.get<HealthCheckResponse>("/health");
      return response.data;
    } catch (error) {
      console.error("Health check failed:", error);
      if (axios.isAxiosError(error)) {
        throw error.response?.data || { message: error.message };
      }
      throw { message: "Health check failed" };
    }
  },
};
