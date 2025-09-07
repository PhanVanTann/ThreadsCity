import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FaRegCommentDots, FaUserPlus, FaHeart } from "react-icons/fa";
import { FaRegCommentAlt } from "react-icons/fa";
import { getListNotification, markAsReadNotification } from "src/redux/api/apiRequestNotification";
import NotificationSkeleton from "../components/NotificationSkeleton";
import { BsFileEarmarkPost } from "react-icons/bs";

type NotiType = "comment" | "like" | "censorship" | "follow" | "message";

export default function Notifications() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data = [], isFetching } = useSelector(
    (s: any) => s.notification.getListNotification || { data: [], isFetching: false }
  );
  const currentUser = useSelector((s: any) => s.auth.login.currentUser?.user_id);

  const [showSkeleton, setShowSkeleton] = useState(true);

  // Track các id đã mark-read trong session này (để render ẩn dot/nhạt màu ngay lập tức)
  const [readLocal, setReadLocal] = useState<Set<string>>(new Set());
  // Lưu timeout trên từng item để không mark-read ngay khi hover nhanh
  const hoverTimers = useRef<Record<string, number>>({});

  // fetch khi mount
  useEffect(() => {
    if (currentUser) getListNotification(currentUser, dispatch);
    const timer = setTimeout(() => setShowSkeleton(false), 1500);
    return () => clearTimeout(timer);
  }, [currentUser, dispatch]);

  const getIcon = (type: NotiType) => {
    switch (type) {
      case "comment":
        return <FaRegCommentDots className="text-blue-500 shrink-0" />;
      case "message":
        return <FaRegCommentAlt className="text-green-500 shrink-0" />;
      case "censorship":
        return <BsFileEarmarkPost className="text-white-500 shrink-0" />;
      case "follow":
        return <FaUserPlus className="text-pink-500 shrink-0" />;
      case "like":
        return <FaHeart className="text-red-500 shrink-0" />;
      default:
        return null;
    }
  };

  // Chuẩn hoá is_read
  const isUnread = useCallback((n: any) => {
    const v = n?.is_read;
    if (v === false) return true;
    if (v === 0) return true;
    if (v === "0") return true;
    if (v === "false") return true;
    if (v === null || typeof v === "undefined") return true;
    return false;
  }, []);

  // Lấy id string an toàn
  const getId = (n: any) => String(n?.id ?? n?._id ?? "");

  // Đánh dấu đã đọc (gọi API + optimistic UI)
  const doMarkRead = useCallback(
    (n: any) => {
      const id = getId(n);
      if (!id || !currentUser) return;

      // Nếu trong store đã đọc hoặc trong session đã đọc → thôi
      if (!isUnread(n) || readLocal.has(id)) return;

      // Optimistic: cập nhật session để UI phản ánh ngay
      setReadLocal((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      // Gọi API (không await để UI không trễ)
      markAsReadNotification({ notification_id: id, user_id: currentUser }, dispatch);
    },
    [currentUser, dispatch, isUnread, readLocal]
  );

  // Hover handlers
  const handleMouseEnter = (n: any) => {
    const id = getId(n);
    if (!id) return;

    // Nếu đã đọc theo store hoặc theo session → bỏ qua
    if (!isUnread(n) || readLocal.has(id)) return;

    // Set timer 400ms, nếu vẫn còn hover thì mark-read
    clearTimeout(hoverTimers.current[id]);
    // @ts-ignore
    hoverTimers.current[id] = window.setTimeout(() => {
      doMarkRead(n);
      // dọn timer
      clearTimeout(hoverTimers.current[id]);
      delete hoverTimers.current[id];
    }, 400);
  };

  const handleMouseLeave = (n: any) => {
    const id = getId(n);
    if (!id) return;
    clearTimeout(hoverTimers.current[id]);
    delete hoverTimers.current[id];
  };

  const handleClick = (n: any) => {
    if (!n) return;

  
    const id = getId(n);
    if (id && isUnread(n) && !readLocal.has(id)) {
      doMarkRead(n);
    }

    if (n.type === "follow") {
      navigate(`/profile/${n.actor.actor_id}`);
    } else if (["post", "comment", "like"].includes(n.type)) {
      navigate(`/postcomment/${n.resource_id}`);
    }
  };

  const isReadEffective = (n: any) => {
    const id = getId(n);
    // “đã đọc” nếu: store báo đã đọc hoặc session đã đọc
    return !isUnread(n) || readLocal.has(id);
  };

  return (
    <div className="w-[700px] mt-5 flex flex-col border border-[#3d3d3d] rounded-[20px] h-screen bg-gray-100 dark:bg-[#181818]">
      <div className="p-4 text-lg font-semibold border-b border-[#3d3d3d]">Thông báo</div>

      <div className="flex-1 overflow-y-auto scroll-dark">
        {(isFetching && showSkeleton) && <NotificationSkeleton items={6} />}

        {(!isFetching || !showSkeleton) && data.map((n: any) => {
          const id = getId(n);
          const readNow = isReadEffective(n);

          return (
            <div
              key={id}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#2b2b2b] transition-colors ${
                !readNow ? "bg-blue-50 dark:bg-[#1f2a37]" : ""
              }`}
              onMouseEnter={() => handleMouseEnter(n)}
              onMouseLeave={() => handleMouseLeave(n)}
              onClick={() => handleClick(n)}
            >
              <img
                src={n.actor?.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {getIcon(n.type as NotiType)}
                  <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                    <strong>{n.actor?.name}</strong> {n.message}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(n.created_at).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {!readNow && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
            </div>
          );
        })}

        {(!isFetching || !showSkeleton) && data.length === 0 && (
          <div className="p-4 text-sm text-gray-500 text-center">Chưa có thông báo</div>
        )}
      </div>
    </div>
  );
}
