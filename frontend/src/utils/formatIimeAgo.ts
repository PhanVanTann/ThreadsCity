export function formatTimeAgo(dateInput: string | Date): string {
  const date = new Date(dateInput);

  // ép về giờ VN (+7)
  const vnTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  if (isNaN(vnTime.getTime())) return "Không rõ thời gian";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - vnTime.getTime()) / 1000);

  if (diffInSeconds < 0) return "Vừa xong";

  const seconds = diffInSeconds;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);
  const weeks = Math.floor(seconds / 604800);

  if (seconds < 60) return `${seconds} giây trước`;
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  if (weeks < 3) return `${weeks} tuần trước`;

  return vnTime.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}