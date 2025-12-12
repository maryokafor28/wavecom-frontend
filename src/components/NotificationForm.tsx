"use client";

import { useState } from "react";
import { notificationApi } from "@/services/api";
import { NotificationChannel } from "@/types";
import { getErrorMessage } from "@/utils/error";

interface NotificationFormProps {
  onSuccess?: (notificationId: string) => void;
}

export default function NotificationForm({ onSuccess }: NotificationFormProps) {
  const [formData, setFormData] = useState({
    recipient: "",
    message: "",
    channel: "email" as NotificationChannel,
    subject: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare data (don't send subject if not email)
      const submitData = {
        recipient: formData.recipient,
        message: formData.message,
        channel: formData.channel,
        ...(formData.channel === "email" && formData.subject
          ? { subject: formData.subject }
          : {}),
      };

      const response = await notificationApi.createNotification(submitData);

      if (response.status === "success" && response.data) {
        setSuccess(`Notification created! ID: ${response.data.id}`);

        // Reset form
        setFormData({
          recipient: "",
          message: "",
          channel: "email",
          subject: "",
        });

        // Notify parent component
        if (onSuccess) {
          onSuccess(response.data.id);
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create Notification
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Channel Selection */}
        <div>
          <label
            htmlFor="channel"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Channel
          </label>
          <select
            id="channel"
            name="channel"
            value={formData.channel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="email">📧 Email</option>
            <option value="sms">📱 SMS</option>
            <option value="push">🔔 Push Notification</option>
          </select>
        </div>

        {/* Recipient */}
        <div>
          <label
            htmlFor="recipient"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Recipient{" "}
            {formData.channel === "email"
              ? "(Email)"
              : formData.channel === "sms"
              ? "(Phone)"
              : "(Device Token)"}
          </label>
          <input
            type="text"
            id="recipient"
            name="recipient"
            value={formData.recipient}
            onChange={handleChange}
            placeholder={
              formData.channel === "email"
                ? "user@example.com"
                : formData.channel === "sms"
                ? "+1234567890"
                : "device-token-123"
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Subject (only for email) */}
        {formData.channel === "email" && (
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject (Optional)
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Email subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your notification message"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Creating..." : "Send Notification"}
        </button>
      </form>
    </div>
  );
}
