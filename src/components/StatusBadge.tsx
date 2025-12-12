import { NotificationStatus } from "@/types";

interface StatusBadgeProps {
  status: NotificationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "queued":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "sent":
        return "bg-green-100 text-green-700 border-green-300";
      case "failed":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return "⏳";
      case "queued":
        return "📋";
      case "processing":
        return "⚙️";
      case "sent":
        return "✅";
      case "failed":
        return "❌";
      default:
        return "❓";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles()}`}
    >
      <span>{getStatusIcon()}</span>
      <span className="capitalize">{status}</span>
    </span>
  );
}
