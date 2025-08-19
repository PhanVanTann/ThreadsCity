// src/components/MessageWidget.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectChatWS } from "../lib/sw"; // 👉 dùng ws, KHÔNG phải sw
import { AiOutlineMessage } from "react-icons/ai";
import { MdOutlineArrowBack } from "react-icons/md";
import { LuSendHorizontal, LuX } from "react-icons/lu";
import { FaPaperclip, FaRegSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { getlistFriend } from "../redux/api/apiRequestFriend";


type ObjectId = string;

export type MessageDoc = {
  id: ObjectId;
  user_id: ObjectId; // tenant/owner nếu có
  send_user_id: ObjectId;
  receive_user_id: ObjectId;
  text?: string;
  image?: string;
  video?: string;
  created_at: string; // ISO string
};

type UserLite = {
  _id: ObjectId;
  name: string;
  avatar?: string;
};
// ====== Lấy friend list từ API ======
const useFriends = (user_id?: ObjectId) => {
  const dispatch = useDispatch()
  const [friends, setFriends] = useState<UserLite[]>([]);
  const [loading, setLoading] = useState(false);
  const data = useSelector((state: any) => state.friend.getlistFriend.data)
  const dataReal = data.data
  console.log(dataReal)
  useEffect(()=>{
    if (!user_id) return;
    
    getlistFriend(user_id,dispatch);
    
  },[])
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    
    try {
      console.log('112')
      if (dataReal.length !== 0) console.log('dell cos')
        
        const items = (dataReal).map((f: any) => ({
          
          _id: f.id,
          name: [f.first_name, f.last_name].filter(Boolean).join(" ").trim(),
          avatar: f.avatar ,
        }));
        console.log('item',items)
      if (mounted) setFriends(items);
    } catch (e) {
      console.error("getlistFriend error:", e);
      if (mounted) setFriends([]);
    } finally {
      if (mounted) setLoading(false);
    }
    
    return () => {
      mounted = false;
    };
  }, [dataReal]);

  return { friends, loading };
};
// ====== Lấy dữ liệu từ Redux ======
const useAuth = () => {
  const user = useSelector((s: any) => s.auth.login.currentUser.user_id);
  console.log("user",user)
  return { user };
};


const useContacts = (): UserLite[] => {
  const contacts = useSelector((s: any) => s.chat?.contacts) as UserLite[] | undefined;
  return contacts ?? [];
};

// ====== Helpers ======
function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
function getOtherUserId(m: MessageDoc, me: ObjectId) {
  return m.send_user_id === me ? m.receive_user_id : m.send_user_id;
}
function lastMessagePreview(m: MessageDoc) {
  if (m.text && m.text.trim()) return m.text;
  if (m.image) return "📷 Image";
  if (m.video) return "🎬 Video";
  return "(empty)";
}

// ====== Conversation List ======
function ConversationList({
  me,
  messages,
  friends,
  onSelect,
  selectedId,
}: {
  me: ObjectId;
  messages: MessageDoc[];
  friends: UserLite[];
  onSelect: (otherId: ObjectId) => void;
  selectedId?: ObjectId | null;
}) {
  // Tạo các row từ friend list + last message (nếu có)
  const rows = useMemo(() => {
    const getLast = (otherId: ObjectId) =>
      messages
        .filter(
          (m) =>
            (m.send_user_id === me && m.receive_user_id === otherId) ||
            (m.send_user_id === otherId && m.receive_user_id === me)
        )
        .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

    const r = friends.map((f) => {
      const last = getLast(f._id);
      const lastOrSeed: MessageDoc =
        last ||
        ({
          id: `seed-${f._id}`,
          user_id: me,
          send_user_id: f._id,
          receive_user_id: me,
          text: "Bắt đầu chat…",
          created_at: new Date(0).toISOString(), // để sort xuống dưới nếu chưa chat
        } as MessageDoc);

      return { other: f, last: lastOrSeed };
    });

    r.sort((a, b) => b.last.created_at.localeCompare(a.last.created_at));
    return r;
  }, [friends, me, messages]);

  return (
    <div className="border-b border-gray-200 dark:border-[#2c2c2c]">
      {rows.map(({ other, last }) => {
        const active = selectedId === other._id;
        return (
          <div
            key={other._id}
            onClick={() => onSelect(other._id)}
            className={`flex gap-3 p-3 cursor-pointer transition-colors ${
              active
                ? "bg-gray-100 dark:bg-[#2b2b2b]"
                : "hover:bg-gray-100 dark:hover:bg-[#2b2b2b]"
            }`}
          >
            <img
              src={other?.avatar || "https://i.pravatar.cc/150?img=1"}
              alt="avatar"
              className="object-cover rounded-full w-10 h-10"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{other?.name || other._id}</span>
                <span className="text-[11px] text-gray-500">
                  {timeAgo(last.created_at)}
                </span>
              </div>
              <span className="block text-[12px] text-gray-500 truncate">
                {lastMessagePreview(last)}
              </span>
            </div>
          </div>
        );
      })}
      {rows.length === 0 && (
        <div className="p-4 text-sm text-gray-500">
          Chưa có bạn bè. Hãy kết bạn để bắt đầu chat.
        </div>
      )}
    </div>
  );
}

// ====== Chat Window ======
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
  onSend: (payload: { text?: string; image?: string; video?: string }) => void;
  onBack: () => void;
}) {
  const [text, setText] = useState("");
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const thread = useMemo(
    () =>
      allMessages
        .filter(
          (m) =>
            (m.send_user_id === me && m.receive_user_id === other._id) ||
            (m.send_user_id === other._id && m.receive_user_id === me)
        )
        .sort((a, b) => a.created_at.localeCompare(b.created_at)),
    [allMessages, me, other._id]
  );

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    if (f.type.startsWith("image/")) setMediaType("image");
    else if (f.type.startsWith("video/")) setMediaType("video");
    else setMediaType(null);
    setMediaFile(url);
  };

  const handleSend = () => {
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
    <div className="flex flex-col justify-center h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-[#2c2c2c]">
        <button title="Quay lại" onClick={onBack} className="cursor-pointer">
          <MdOutlineArrowBack size={20} />
        </button>
        <img src={other?.avatar || "https://i.pravatar.cc/150?img=1"} className="w-8 h-8 rounded-full" alt="avatar" />
        <div className="font-medium text-sm">{other?.name || other._id}</div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {thread.map((m) => {
          const mine = m.send_user_id === me;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${
                  mine
                    ? "bg-[#a1a1a1] text-white rounded-br-sm"
                    : "bg-gray-100 dark:bg-[#2b2b2b] text-gray-900 dark:text-gray-100 rounded-bl-sm"
                }`}
              >
                {m.image && <img src={m.image} className="rounded-md mt-1 max-h-52 object-cover" alt="img" />}
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

      {/* Composer */}
      <div className="p-3 border-t border-gray-200 dark:border-[#2c2c2c]">
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
            {mediaType === "image" && <img src={mediaFile} className="max-h-40 rounded-lg border" alt="preview" />}
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
            handleSend();
          }}
          className="flex items-end gap-1"
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmoji((s) => !s)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b2b2b]"
              title="Emoji"
            >
              <FaRegSmile />
            </button>
            {showEmoji && (
              <div className="absolute bottom-10 left-0 z-10">
                <EmojiPicker onEmojiClick={(emojiData) => setText((prev) => prev + emojiData.emoji)} theme="dark" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => (document.querySelector<HTMLInputElement>("#filePicker")?.click())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b2b2b]"
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
                handleSend();
              }
            }}
          />

          <button type="submit" className="px-3 py-2 cursor-pointer text-white rounded-lg" title="Gửi">
            <LuSendHorizontal size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

// ====== Widget chính ======
export default function MessageWidget() {
  const { user } = useAuth();
  const currentUserId = user as ObjectId | undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageDoc[]>([]);
  const [activeOther, setActiveOther] = useState<ObjectId | null>(null);

  const { friends } = useFriends(currentUserId);  // ✅ lấy friend list
  const wsRef = useRef<ReturnType<typeof connectChatWS> | null>(null);

  // Nếu chưa đăng nhập -> không render chat
  if (!currentUserId) {
    return null; // ✅ đừng `return` trống
  }

  const roomId = activeOther
    ? [currentUserId, activeOther].sort().join("_")
    : undefined;

  useEffect(() => {
    if (!activeOther || !currentUserId || !roomId) return;

    wsRef.current = connectChatWS({
      roomId,
      userId: currentUserId,
      onOpen: () => console.log("WS open", roomId),
      onMessage: (data: any) => {
        if (data.send_id === currentUserId) return; // bỏ echo

        const newMsg: MessageDoc = {
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
          (newMsg.send_user_id === currentUserId && newMsg.receive_user_id === activeOther) ||
          (newMsg.send_user_id === activeOther && newMsg.receive_user_id === currentUserId);

        if (inThread) setMessages((prev) => [...prev, newMsg]);
      },
      onClose: () => console.log("WS closed"),
      onError: (e) => console.warn("WS error", e),
    });

    return () => wsRef.current?.close();
  }, [activeOther, currentUserId, roomId]);

  const handleSend = (payload: { text?: string; image?: string; video?: string }) => {
    if (!activeOther || !wsRef.current || !currentUserId) return;

    // optimistic UI
    const newMsg: MessageDoc = {
      id: crypto.randomUUID(),
      user_id: currentUserId,
      send_user_id: currentUserId,
      receive_user_id: activeOther,
      ...payload,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);

    wsRef.current.send({
      send_id: currentUserId,
      receiver_id: activeOther,
      text: payload.text,
      media: { image: payload.image, video: payload.video },
    });
  };

  const otherUser = activeOther
    ? friends.find((c) => c._id === activeOther) || { _id: activeOther, name: activeOther }
    : undefined;

  return (
    <div className="relative">
      {/* FAB */}
      <div
        onClick={() => setIsOpen((s) => !s)}
        className="fixed cursor-pointer flex justify-center items-center bottom-5 right-5 w-12 h-12 rounded-full bg-gray-100 dark:bg-[#1d1d1d] shadow-lg"
      >
        <AiOutlineMessage size={24} />
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-5 w-[320px] h-[480px] bg-white dark:bg-[#181818] shadow-2xl rounded-xl overflow-hidden border border-gray-200 dark:border-[#2c2c2c]">
          <div className="p-3 font-semibold text-sm border-b border-gray-200 dark:border-[#2c2c2c]">
            Messages
          </div>

          {activeOther && otherUser ? (
            <ChatWindow
              me={currentUserId}
              other={otherUser}
              allMessages={messages}
              onSend={handleSend}
              onBack={() => setActiveOther(null)}
            />
          ) : (
            <div className="h-full overflow-y-auto">
              <ConversationList
                me={currentUserId}
                messages={messages}
                friends={friends}        
                selectedId={activeOther}
                onSelect={setActiveOther}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}