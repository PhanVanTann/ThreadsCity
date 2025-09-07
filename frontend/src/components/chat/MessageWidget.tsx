import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMessage } from "react-icons/ai";
import { connectChatWS } from "../../lib/sw";
import { getHistoryChatUser, getHistoryChatReceiver } from "../../redux/api/apiRequestChat";
import { useAuth, useRoomId, useFriends } from "./hooks";
import type { ObjectId, MessageDoc } from "./types";
import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";
import { useClickOutside } from "src/hook/useClickOutside";

import { getListNotification, markAsReadNotification } from "src/redux/api/apiRequestNotification";
import { useLocation } from "react-router-dom";

export default function MessageWidget() {
  const { user } = useAuth();
  const room_id = useRoomId();
  const currentUserId = user as ObjectId | undefined;
  const friends = useFriends(currentUserId);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageDoc[]>([]);
  const [activeOther, setActiveOther] = useState<ObjectId | null>(null);

  const btnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const wsThreadRef = useRef<ReturnType<typeof connectChatWS> | null>(null);
  const wsInboxRef  = useRef<ReturnType<typeof connectChatWS> | null>(null);
  const fetchedRef  = useRef(false);
  const fetchDebounceRef = useRef<number | null>(null);
  const markingAllRef = useRef(false);
  const markingByActorRef = useRef<Record<string, boolean>>({});

  const location = useLocation();
  const onNotiPage = location.pathname.startsWith("/notifications");

  if (!currentUserId) return null;
  const roomId = room_id as ObjectId | undefined;

  // ---- lấy LIST NOTIFICATION từ store (giống Sidebar) ----
  const { data: notiData = [] } = useSelector(
    (s: any) => s.notification.getListNotification || { data: [], isFetching: false }
  );

  // Helpers
  const isUnread = (n: any) => {
    const v = n?.is_read;
    if (v === false) return true;
    if (v === 0) return true;
    if (v === "0") return true;
    if (v === "false") return true;
    if (v === null || typeof v === "undefined") return true;
    return false;
  };
  const getId = (n: any) => String(n?.id ?? n?._id ?? "");
  const getActorId = (n: any) => String(n?.actor?.actor_id ?? "");

  // Lọc noti kiểu "message" & chưa đọc
  const unreadMsgNotis = useMemo(
    () => (Array.isArray(notiData) ? notiData.filter((n: any) => n?.type === "message" && isUnread(n)) : []),
    [notiData]
  );

  // Quyết định hiển thị chấm đỏ
  const showBadge = unreadMsgNotis.length > 0;

  // Fetch noti khi mount (giống Sidebar)
  useEffect(() => {
    if (!currentUserId) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getListNotification(currentUserId, dispatch);
  }, [currentUserId, dispatch]);

  // WS "inbox theo user" → khi có tin đến thì fetch noti (throttle) nếu KHÔNG ở trang /notifications
  useEffect(() => {
    if (!currentUserId) return;
    const inboxChannel = `inbox:${currentUserId}`; // đổi nếu BE dùng tên khác
    wsInboxRef.current?.close();
    wsInboxRef.current = connectChatWS({
      roomId: inboxChannel,
      userId: currentUserId,
      onOpen: () => console.log("WS(inbox) open", inboxChannel),
      onMessage: (data: any) => {
        if (String(data.send_id) === String(currentUserId)) return; // bỏ tự echo
        if (onNotiPage) return; // tránh gây re-render trang thông báo
        if (fetchDebounceRef.current) return;
        // @ts-ignore
        fetchDebounceRef.current = window.setTimeout(() => {
          getListNotification(currentUserId, dispatch);
          if (fetchDebounceRef.current) {
            clearTimeout(fetchDebounceRef.current);
            fetchDebounceRef.current = null;
          }
        }, 300);
      },
      onClose: () => console.log("WS(inbox) closed"),
      onError: (e) => console.warn("WS(inbox) error", e),
    });
    return () => wsInboxRef.current?.close();
  }, [currentUserId, dispatch, onNotiPage]);

  // ---- PHẦN CHAT GIỮ NGUYÊN ----
  useEffect(() => { setMessages([]); }, [activeOther]);

  const historyRes = useSelector((s: any) => s.chat.getHistoryChatUser?.data);
  const historyRecvRes = useSelector((s: any) => s.chat.getHistoryChatReceiver?.data);

  useEffect(() => {
    if (!activeOther || !roomId || !currentUserId) return;
    getHistoryChatUser({ room_id: roomId, user_id: currentUserId }, dispatch);
    getHistoryChatReceiver({ room_id: roomId, user_id: currentUserId }, dispatch);
  }, [activeOther, roomId, currentUserId, dispatch]);

  useEffect(() => {
    const uList = (historyRes?.success ? historyRes.data : []) || [];
    const rList = (historyRecvRes?.success ? historyRecvRes.data : []) || [];
    const merged = [...uList, ...rList];
    const hist: MessageDoc[] = merged.map((m: any) => ({
      id: (m._id ? String(m._id) : `${m.created_at}-${m.send_id}-${m.text ?? ""}`),
      user_id: String(currentUserId!),
      send_user_id: String(m.send_id),
      receive_user_id: String(m.receiver_id),
      text: m.text || undefined,
      image: m.media?.image || undefined,
      video: m.media?.video || undefined,
      created_at: m.created_at,
    }));
    setMessages((prev) => {
      const map = new Map<string, MessageDoc>();
      for (const it of prev) {
        const k = it.id || `${it.created_at}-${it.send_user_id}-${it.text ?? ""}`;
        map.set(k, it);
      }
      for (const it of hist) {
        const k = it.id || `${it.created_at}-${it.send_user_id}-${it.text ?? ""}`;
        map.set(k, it);
      }
      const arr = Array.from(map.values());
      arr.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      return arr;
    });
  }, [historyRes, historyRecvRes, currentUserId]);

  // WS cho thread đang mở (chat realtime trong cửa sổ)
  useEffect(() => {
    if (!activeOther || !roomId || !currentUserId) return;
    wsThreadRef.current?.close();
    wsThreadRef.current = connectChatWS({
      roomId,
      userId: currentUserId,
      onOpen: () => console.log("WS(thread) open", roomId),
      onMessage: (data: any) => {
        if (String(data.send_id) === String(currentUserId)) return;
        const msg: MessageDoc = {
          id: crypto.randomUUID(),
          user_id: currentUserId,
          send_user_id: data.send_id,
          receive_user_id: data.receiver_id,
          text: data.text,
          image: data.media?.image,
          video: data.media?.video,
          created_at: new Date().toISOString(),
        };
        const inThread =
          (msg.send_user_id === String(currentUserId) && msg.receive_user_id === String(activeOther)) ||
          (msg.send_user_id === String(activeOther) && msg.receive_user_id === String(currentUserId));
        if (inThread) setMessages((prev) => [...prev, msg]);
      },
      onClose: () => console.log("WS(thread) closed"),
      onError: (e) => console.warn("WS(thread) error", e),
    });
    return () => wsThreadRef.current?.close();
  }, [activeOther, roomId, currentUserId]);

  // Gửi tin
  const handleSend = (p: { text?: string; image?: string; video?: string }) => {
    if (!activeOther || !wsThreadRef.current || !currentUserId) return;
    const optimistic: MessageDoc = {
      id: crypto.randomUUID(),
      user_id: currentUserId,
      send_user_id: currentUserId,
      receive_user_id: activeOther,
      ...p,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    wsThreadRef.current.send({
      send_id: currentUserId,
      receiver_id: activeOther,
      text: p.text,
      media: { image: p.image, video: p.video },
    });
  };

  const otherUser =
    activeOther && (friends.find((f) => f._id === activeOther) || { _id: activeOther, name: activeOther });

  useClickOutside([btnRef, menuRef], () => setIsOpen(false), {
    enabled: isOpen,
    onEscape: () => setIsOpen(false),
  });

  

  // 1) Khi mở modal chat (isOpen=true) → mark read TẤT CẢ noti type:"message" chưa đọc (chỉ khi KHÔNG ở trang /notifications)
  useEffect(() => {
    if (!isOpen || !currentUserId) return;
    if (markingAllRef.current) return;
    const unread = unreadMsgNotis;
    if (unread.length === 0) return;

    markingAllRef.current = true;
    // gọi lần lượt (API markAsReadNotification dạng từng chiếc giống Sidebar)
    (async () => {
      for (const n of unread) {
        const id = getId(n);
        if (id) {
          await markAsReadNotification({ notification_id: id, user_id: currentUserId }, dispatch);
        }
      }
      await getListNotification(currentUserId, dispatch); // reload store để badge tắt ngay
      markingAllRef.current = false;
    })();
  }, [isOpen, onNotiPage, currentUserId, unreadMsgNotis, dispatch]);

  // 2) Khi chọn 1 người (activeOther) trong modal → mark read các noti message từ actor đó (nếu không đứng ở trang /notifications)
  useEffect(() => {
    if (!isOpen || !activeOther ||  !currentUserId) return;
    const key = String(activeOther);
    if (markingByActorRef.current[key]) return;

    const list = unreadMsgNotis.filter((n: any) => getActorId(n) === key);
    if (list.length === 0) return;

    markingByActorRef.current[key] = true;
    (async () => {
      for (const n of list) {
        const id = getId(n);
        if (id) {
          await markAsReadNotification({ notification_id: id, user_id: currentUserId }, dispatch);
        }
      }
      await getListNotification(currentUserId, dispatch);
      markingByActorRef.current[key] = false;
    })();
  }, [isOpen, activeOther, onNotiPage, currentUserId, unreadMsgNotis, dispatch]);

  // ============================================================================

  return (
    <div className="relative">
      {/* Nút mở */}
      <div
        ref={btnRef}
        onClick={() => setIsOpen((s) => !s)}
        className="fixed z-1000 cursor-pointer flex justify-center items-center bottom-5 right-5 w-12 h-12 rounded-full bg-gray-100 dark:bg-[#1d1d1d] shadow-lg"
      >
        <AiOutlineMessage size={24} />
        {showBadge && (
          <div className="w-[8px] h-[8px] rounded-full top-1 right-1 bg-[#ff0000] absolute z-20" />
        )}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-1001 bottom-20 right-5 w-[330px] h-[500px] bg-white dark:bg-[#181818] shadow-2xl rounded-xl overflow-hidden border border-gray-200 dark:border-[#2c2c2c]"
        >
          <div className="h-full flex flex-col">
            <div className="shrink-0 p-3 font-semibold text-sm border-b border-gray-200 dark:border-[#2c2c2c]">
              Messages
            </div>

            {activeOther && otherUser ? (
              <div className="flex-1 min-h-0">
                <ChatWindow
                  me={currentUserId}
                  other={otherUser}
                  allMessages={messages}
                  onSend={handleSend}
                  onBack={() => setActiveOther(null)}
                />
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto">
                <ConversationList
                  me={currentUserId}
                  friends={friends}
                  messages={messages}
                  selectedId={activeOther}
                  onSelect={setActiveOther}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
