import { useState } from "react";
import { useNavigate } from "react-router";
import { FaRegCommentDots, FaUserPlus, FaEnvelope } from "react-icons/fa";

type NotificationType = "comment" | "message" | "follow";

interface Notification {
  id: string;
  type: NotificationType;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  created_at: string;
  isRead: boolean;
  link: string; // đường dẫn khi click
}

const mockData: Notification[] = [
  {
    id: "1",
    type: "comment",
    user: { id: "u2", name: "Minh", avatar: "https://i.pravatar.cc/150?img=11" },
    content: "đã bình luận vào bài viết của bạn",
    created_at: new Date().toISOString(),
    isRead: false,
    link: "/post/123#comment-567", // chuyển đến bài post id=123 và cuộn đến comment id=567
  },
  {
    id: "2",
    type: "message",
    user: { id: "u3", name: "Lan", avatar: "https://i.pravatar.cc/150?img=14" },
    content: "đã nhắn tin cho bạn",
    created_at: new Date().toISOString(),
    isRead: true,
    link: "/messages/u3", // mở chat với u3
  },
  {
    id: "3",
    type: "follow",
    user: { id: "u4", name: "Hoàng", avatar: "https://i.pravatar.cc/150?img=20" },
    content: "đã bắt đầu theo dõi bạn",
    created_at: new Date().toISOString(),
    isRead: false,
    link: "/profile/u4", // trang cá nhân của u4
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockData);
  const navigate = useNavigate();

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "comment":
        return <FaRegCommentDots className="text-blue-500" />;
      case "message":
        return <FaEnvelope className="text-green-500" />;
      case "follow":
        return <FaUserPlus className="text-pink-500" />;
      default:
        return null;
    }
  };

  const handleClick = (n: Notification) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === n.id ? { ...item, isRead: true } : item
      )
    );
    navigate(n.link); // điều hướng
  };

  return (
    <div className="w-[700px] mt-5 flex flex-col border border-[#3d3d3d] rounded-[20px] h-screen bg-gray-100 dark:bg-[#181818]">
      <div className="p-4 text-lg font-semibold border-b border-[#3d3d3d]">
        Thông báo
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#2b2b2b] transition-colors ${
              !n.isRead ? "bg-blue-50 dark:bg-[#1f2a37]" : ""
            }`}
            onClick={() => handleClick(n)}
          >
            <img
              src={n.user.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {getIcon(n.type)}
                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                  <strong>{n.user.name}</strong> {n.content}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(n.created_at).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {!n.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="p-4 text-sm text-gray-500 text-center">
            Chưa có thông báo
          </div>
        )}
      </div>
    </div>
  );
}
