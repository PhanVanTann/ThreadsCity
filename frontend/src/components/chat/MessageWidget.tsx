import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMessage } from "react-icons/ai";
import { connectChatWS } from "../../lib/sw";
import { getHistoryChatUser, getHistoryChatReceiver } from "../../redux/api/apiRequestChat";
import { useAuth, useRoomId, useFriends } from "./hooks";
import type { ObjectId, MessageDoc } from "./types";
import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";

export default function MessageWidget() {
   const { user } = useAuth();
    const room_id = useRoomId();                     // <- hook của bạn
    const currentUserId = user as ObjectId | undefined;
    const friends = useFriends(currentUserId);
  
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<MessageDoc[]>([]);
    const [activeOther, setActiveOther] = useState<ObjectId | null>(null);
  
    const dispatch = useDispatch();
    const wsRef = useRef<ReturnType<typeof connectChatWS> | null>(null);
  
    // Kết quả 2 API history (nhớ đúng slice/path của bạn)
    const historyRes = useSelector((s: any) => s.chat.getHistoryChatUser?.data);
    const historyRecvRes = useSelector((s: any) => s.chat.getHistoryChatReceiver?.data);
  
    if (!currentUserId) return null;
  
    const roomId = room_id as ObjectId | undefined;
  
    // Đổi bạn → clear UI ngay
    useEffect(() => {
      setMessages([]);
    }, [activeOther]);
  
    // Load history 2 phía
    useEffect(() => {
      if (!activeOther || !roomId || !currentUserId) return;
  
      getHistoryChatUser(
        { room_id: roomId, user_id: currentUserId },
        dispatch
      );
  
      getHistoryChatReceiver(
        { room_id: roomId, user_id: currentUserId },
        dispatch
      );
    }, [activeOther, roomId, currentUserId, dispatch]);
  
    // Merge 2 kết quả history -> messages
    useEffect(() => {
    const uList = (historyRes?.success ? historyRes.data : []) || [];
    console.log("uList",uList)
    const rList = (historyRecvRes?.success ? historyRecvRes.data : []) || [];
    console.log("rList",rList)
    const merged = [...uList, ...rList];
    console.log("datamerge",merged)
  
    const hist: MessageDoc[] = merged.map((m: any) => ({
  id: (m._id ? String(m._id) : `${m.created_at}-${m.send_id}-${m.text ?? ""}`),
  user_id: String(currentUserId!),
  send_user_id: String(m.send_id),
  receive_user_id: String(m.receiver_id),
  text: m.text || undefined,
  image: m.media?.image || undefined,
  video: m.media?.video || undefined,
  created_at: m.created_at
}));
    setMessages(prev => {
      // 1) put prev vào map (giữ optimistic đang hiển thị)
      const map = new Map<string, MessageDoc>();
      for (const it of prev) {
        const k = it.id || `${it.created_at}-${it.send_user_id}-${it.text ?? ""}`;
        map.set(k, it);
      }
      // 2) trộn history vào (ghi đè nếu trùng key)
      for (const it of hist) {
        const k = it.id || `${it.created_at}-${it.send_user_id}-${it.text ?? ""}`;
        map.set(k, it);
      }
      // 3) sort theo thời gian
      const arr = Array.from(map.values());
        arr.sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      return arr;
    });
  }, [historyRes, historyRecvRes, currentUserId]);
  
    // WebSocket: đóng cũ, mở mới theo roomId & activeOther
    useEffect(() => {
      if (!activeOther || !roomId || !currentUserId) return;
  
      wsRef.current?.close(); // đóng socket cũ nếu có
  
      wsRef.current = connectChatWS({
        roomId,
        userId: currentUserId,
        onOpen: () => console.log("WS open", roomId),
        onMessage: (data: any) => {
          // bỏ echo của chính mình (BE broadcast)
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
  
          // chỉ push nếu đúng thread đang mở
          const inThread =
      (msg.send_user_id === String(currentUserId) && msg.receive_user_id === String(activeOther)) ||
      (msg.send_user_id === String(activeOther) && msg.receive_user_id === String(currentUserId));
  
    if (inThread) setMessages(prev => [...prev, msg]);
        },
        onClose: () => console.log("WS closed"),
        onError: (e) => console.warn("WS error", e),
      });
  
      return () => wsRef.current?.close();
    }, [activeOther, roomId, currentUserId]);
  
    // Gửi tin
    const handleSend = (p: { text?: string; image?: string; video?: string }) => {
      if (!activeOther || !wsRef.current || !currentUserId) return;
  
      // optimistic UI
      const optimistic: MessageDoc = {
        id: crypto.randomUUID(),
        user_id: currentUserId,
        send_user_id: currentUserId,
        receive_user_id: activeOther,
        ...p,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);
  
      wsRef.current.send({
        send_id: currentUserId,
        receiver_id: activeOther,
        text: p.text,
        media: { image: p.image, video: p.video },
      });
    };
  
    const otherUser =
      activeOther && (friends.find((f) => f._id === activeOther) || { _id: activeOther, name: activeOther });
  
    return (
      <div className="relative">
        {/* Nút mở */}
        <div
          onClick={() => setIsOpen((s) => !s)}
          className="fixed cursor-pointer flex justify-center items-center bottom-5 right-5 w-12 h-12 rounded-full bg-gray-100 dark:bg-[#1d1d1d] shadow-lg"
        >
          <AiOutlineMessage size={24} />
        </div>
  
        {isOpen && (
          <div className="fixed bottom-20 right-5 w-[330px] h-[500px] bg-white dark:bg-[#181818] shadow-2xl rounded-xl overflow-hidden border border-gray-200 dark:border-[#2c2c2c]">
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
                    onSelect={setActiveOther} // click để mở phòng
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
}