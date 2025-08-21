// src/components/MessageWidget.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMessage } from "react-icons/ai";
import { MdOutlineArrowBack } from "react-icons/md";
import { LuSendHorizontal, LuX } from "react-icons/lu";
import { FaPaperclip, FaRegSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { connectChatWS } from "../lib/sw";
import { getlistFriend } from "../redux/api/apiRequestFriend";
import {createRoomChat,getHistoryChatUser,getHistoryChatReceiver} from "../redux/api/apiRequestChat"

type ObjectId = string;

type UserLite = {
  _id: ObjectId;
  name: string;
  avatar?: string | null;
};

export type MessageDoc = {
  id: ObjectId;
  user_id: ObjectId;
  send_user_id: ObjectId;
  receive_user_id: ObjectId;
  text?: string;
  image?: string;
  video?: string;
  created_at: string;
};

// ============ hooks lấy user & friend list ============

const useAuth = () => {
  const user = useSelector((s: any) => s.auth.login.currentUser?.user_id) as string | undefined;
  return { user };
};
const useRoomId = () => {
  const room_id = useSelector((s: any) => s.chat.createRoomChat.data?.room_id) as string | undefined;
  return room_id;
};
const useFriends = (user_id?: ObjectId) => {
  const dispatch = useDispatch();
  const apiData = useSelector((s: any) => s.friend.getlistFriend.data) as { success: boolean; data: any[] } | undefined;
  const [friends, setFriends] = useState<UserLite[]>([]);

  useEffect(() => {
    if (!user_id) return;
    // gọi API redux đã cấu hình
    getlistFriend(user_id, dispatch);
  }, [user_id, dispatch]);

  useEffect(() => {
    const raw = apiData?.data ?? [];
    const mapped: UserLite[] = raw.map((f: any) => ({
      _id: f.id,
      name: [f.first_name, f.last_name].filter(Boolean).join(" ").trim() || f.id,
      avatar: f.avatar ?? null,
    }));
    setFriends(mapped);
  }, [apiData]);

  return friends;
};

// ============ helpers UI ============

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
function lastMessagePreview(m: MessageDoc) {
  if (m.text?.trim()) return m.text;
  if (m.image) return "📷 Image";
  if (m.video) return "🎬 Video";
  return "(empty)";
}

// ============ list hội thoại từ friend list ============

function ConversationList({
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
  const dispatch = useDispatch()
  const handleClick = async (otherId: string) => {
    // gọi API tạo room
    const data = {
      user_id1: me,
      user_id2: otherId,
    };
    
    try {
      createRoomChat(data, dispatch); 
      onSelect(otherId);
    } catch (err) {
      console.error("createRoomChat error:", err);
    }
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

    const r = friends.map((f) => {
      const last = lastOf(f._id);
      const lastOrSeed: MessageDoc =
        last ||
        ({
          id: `seed-${f._id}`,
          user_id: me,
          send_user_id: f._id,
          receive_user_id: me,
          text: "Bắt đầu chat…",
          created_at: new Date(0).toISOString(),
        } as MessageDoc);
      return { other: f, last: lastOrSeed };
    });

    r.sort((a, b) => b.last.created_at.localeCompare(a.last.created_at));
    return r;
  }, [friends, messages, me]);

  return (
    <div>
      {rows.map(({ other, last }) => {
        const active = selectedId === other._id;
        return (
          <div
            key={other._id}
            onClick={() => handleClick(other._id)}
            className={`flex gap-3 p-3 cursor-pointer transition-colors ${
              active ? "bg-gray-100 dark:bg-[#2b2b2b]" : "hover:bg-gray-100 dark:hover:bg-[#2b2b2b]"
            }`}
          >
            <img
              src={other.avatar || "https://i.pravatar.cc/150?u=" + other._id}
              alt="avatar"
              className="object-cover rounded-full w-10 h-10"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{other.name}</span>
                <span className="text-[11px] text-gray-500">{timeAgo(last.created_at)}</span>
              </div>
              <span className="block text-[12px] text-gray-500 truncate">{lastMessagePreview(last)}</span>
            </div>
          </div>
        );
      })}
      {rows.length === 0 && (
        <div className="p-4 text-sm text-gray-500">Chưa có bạn bè. Hãy kết bạn để bắt đầu chat.</div>
      )}
    </div>
  );
}

// ============ cửa sổ chat ============

function ChatWindow({
  me,
  other,
  allMessages,
  onSend,
  onBack,
}: {
  me: ObjectId;
  other: UserLite;
  allMessages: MessageDoc[];
  onSend: (p: { text?: string; image?: string; video?: string }) => void;
  onBack: () => void;
}) {
  const [text, setText] = useState("");
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const meId = String(me);
  const thread = useMemo(() => (
    allMessages
      .filter(m =>
        (String(m.send_user_id) === meId && String(m.receive_user_id) === String(other._id)) ||
        (String(m.send_user_id) === String(other._id) && String(m.receive_user_id) === meId)
      )
      .sort((a,b)=> a.created_at.localeCompare(b.created_at))
  ), [allMessages, meId, other._id]);

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    if (f.type.startsWith("image/")) setMediaType("image");
    else if (f.type.startsWith("video/")) setMediaType("video");
    else setMediaType(null);
    setMediaFile(url);
  };

  const sendNow = () => {
    const t = text.trim();
    if (!t && !mediaFile) return;
    onSend({
      text: t || undefined,
      image: mediaType === "image" ? mediaFile || undefined : undefined,
      video: mediaType === "video" ? mediaFile || undefined : undefined,
    });
    setText("");
    setMediaFile(null);
    setMediaType(null);
    setShowEmoji(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 flex items-center gap-2 p-3 border-b border-gray-200 dark:border-[#2c2c2c]">
        <button onClick={onBack} className="cursor-pointer">
          <MdOutlineArrowBack size={20} />
        </button>
        <img src={other.avatar || "https://i.pravatar.cc/150?u=" + other._id} className="w-8 h-8 rounded-full" />
        <div className="font-medium text-sm">{other.name}</div>
      </div>

      <div className="flex-1 min-h-0 p-3 overflow-y-auto space-y-2">
        {thread.map((m) => {
          const mine = m.send_user_id === meId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${
                  mine
                    ? "bg-[#a1a1a1] text-white rounded-br-sm"
                    : "bg-gray-100 dark:bg-[#2b2b2b] text-gray-900 dark:text-gray-100 rounded-bl-sm"
                }`}
              >
                {m.image && <img src={m.image} className="rounded-md mt-1 max-h-52 object-cover" />}
                {m.video && (
                  <video controls className="rounded-md mt-1 max-h-52">
                    <source src={m.video} />
                  </video>
                )}
                {m.text && <div className="whitespace-pre-wrap">{m.text}</div>}
                <div className="text-[10px] opacity-70 mt-1 text-right">
                  {new Date(m.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 p-3 border-t border-gray-200 dark:border-[#2c2c2c]">
        {mediaFile && (
          <div className="mb-2 relative inline-block">
            <button
              className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full p-1"
              onClick={() => {
                setMediaFile(null);
                setMediaType(null);
              }}
              title="Xoá đính kèm"
            >
              <LuX size={14} />
            </button>
            {mediaType === "image" && <img src={mediaFile} className="max-h-40 rounded-lg border" />}
            {mediaType === "video" && (
              <video controls className="max-h-40 rounded-lg border">
                <source src={mediaFile} />
              </video>
            )}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendNow();
          }}
          className="flex items-end gap-1"
        >
          <div className="relative">
            <button type="button" onClick={() => setShowEmoji((s) => !s)} className="p-2 rounded-lg hover:bg-gray-100">
              <FaRegSmile />
            </button>
            {showEmoji && (
              <div className="absolute bottom-10 left-0 z-10">
                <EmojiPicker onEmojiClick={(e) => setText((prev) => prev + e.emoji)} theme="dark" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => (document.querySelector<HTMLInputElement>("#filePicker")?.click())}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Đính kèm ảnh/video"
          >
            <FaPaperclip />
          </button>
          <input id="filePicker" type="file" accept="image/*,video/*" hidden onChange={onFileChange} />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập tin nhắn…"
            className="flex-1 rounded-lg px-3 py-2 bg-gray-100 dark:bg-[#2b2b2b] outline-none resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendNow();
              }
            }}
          />
          <button type="button" onClick={sendNow} className="px-3 py-2 cursor-pointer text-white rounded-lg">
            <LuSendHorizontal size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

// ============ Widget chính ============
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
  const historyRes = useSelector((s: any) => s.chat.getHistoryChat?.data);
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

    // user là current
    getHistoryChatUser(
      { room_id: roomId, user_id: currentUserId },
      dispatch
    );

    // phía receiver = bạn đang mở
    getHistoryChatReceiver(
      { room_id: roomId, user_id: currentUserId },
      dispatch
    );
  }, [activeOther, roomId, currentUserId, dispatch]);

  // Merge 2 kết quả history -> messages
  useEffect(() => {
  const uList = (historyRes?.success ? historyRes.data : []) || [];
  const rList = (historyRecvRes?.success ? historyRecvRes.data : []) || [];
  const merged = [...uList, ...rList];

  const hist: MessageDoc[] = merged.map((m: any) => ({
    id: (m._id ? String(m._id) : `${m.created_at}-${m.send_id}-${m.text ?? ""}`), // key ổn định
    user_id: String(currentUserId!),
    send_user_id: String(m.send_id),
    receive_user_id: String(m.receiver_id),
    text: m.text || undefined,
    image: m.media?.image || undefined,
    video: m.media?.video || undefined,
    created_at: new Date(m.created_at).toISOString(),
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
    arr.sort((a, b) => a.created_at.localeCompare(b.created_at));
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
                  other={otherUser as UserLite}
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
