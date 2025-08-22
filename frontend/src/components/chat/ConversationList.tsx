import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { createRoomChat } from "../../redux/api/apiRequestChat";
import { timeAgo, lastMessagePreview } from "./helpers";
import type { ObjectId, UserLite, MessageDoc } from "./types";

export default function ConversationList({
  me,
  friends,
  messages,
  selectedId,
  onSelect,
}: {
  me: ObjectId;
  friends: UserLite[];
  messages: MessageDoc[];
  selectedId?: ObjectId | null;
  onSelect: (otherId: ObjectId) => void;
}) {
  const dispatch = useDispatch();

  const handleClick = (otherId: string) => {
    createRoomChat({ user_id1: me, user_id2: otherId }, dispatch);
    onSelect(otherId);
  };

  const rows = useMemo(() => {
    const lastOf = (otherId: ObjectId) =>
      messages
        .filter(
          (m) =>
            (m.send_user_id === me && m.receive_user_id === otherId) ||
            (m.send_user_id === otherId && m.receive_user_id === me)
        )
        .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

    return friends
      .map((f) => ({
        other: f,
        last:
          lastOf(f._id) ||
          ({
            id: `seed-${f._id}`,
            user_id: me,
            send_user_id: f._id,
            receive_user_id: me,
            text: "Bắt đầu chat…",
            created_at: new Date(0).toISOString(),
          } as MessageDoc),
      }))
      .sort((a, b) => b.last.created_at.localeCompare(a.last.created_at));
  }, [friends, messages, me]);

  if (!friends || friends.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Chưa có bạn bè. Hãy kết bạn để bắt đầu chat.
      </div>
    );
  }

  return (
    <div>
      {rows.map(({ other, last }) => (
        <div
          key={other._id}
          onClick={() => handleClick(other._id)}
          className={`flex gap-3 p-3 cursor-pointer transition-colors ${
            selectedId === other._id ? "bg-gray-100 dark:bg-[#2b2b2b]" : "hover:bg-gray-100 dark:hover:bg-[#2b2b2b]"
          }`}
        >
          <img
            src={other.avatar || "https://i.pravatar.cc/150?u=" + other._id}
            className="object-cover rounded-full w-10 h-10"
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <span className="text-sm font-medium">{other.name}</span>
              <span className="text-[11px] text-gray-500">
                {timeAgo(last.created_at)}
              </span>
            </div>
            <span className="block text-[12px] text-gray-500 truncate">
              {lastMessagePreview(last)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}