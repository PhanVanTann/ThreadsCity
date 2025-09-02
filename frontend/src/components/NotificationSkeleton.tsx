import React from "react";

export default function NotificationSkeleton({
  items = 5,
  className = "",
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-[#2b2b2b]"
        >
          {/* Avatar giả */}
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />

          {/* Nội dung giả */}
          <div className="flex-1 min-w-0">
            <div className="h-3 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
            <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-600 rounded" />
          </div>

          {/* Dot chưa đọc giả */}
          <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  );
}
