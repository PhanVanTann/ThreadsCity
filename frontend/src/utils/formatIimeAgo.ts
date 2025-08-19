export function formatTimeAgo(dateInput: string | Date): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Không rõ thời gian";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Nếu thời gian nằm trong tương lai
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

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}