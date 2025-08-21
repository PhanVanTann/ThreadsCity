import type { MessageDoc } from "./types";

export function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export function lastMessagePreview(m: MessageDoc) {
  if (m.text?.trim()) return m.text;
  if (m.image) return "📷 Image";
  if (m.video) return "🎬 Video";
  return "(empty)";
}