import React, { useMemo, useState, useRef, useEffect } from "react";
import { connectChatWS } from "../lib/sw"; // ✅ đúng: ws
import { AiOutlineMessage } from "react-icons/ai";
import { MdOutlineArrowBack } from "react-icons/md";
import { LuSendHorizontal, LuX } from "react-icons/lu";
import { FaPaperclip, FaRegSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

type ObjectId = string;

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

type UserLite = {
  _id: ObjectId;
  name: string;
  avatar?: string;
};

// ==== TEST CỨNG THEO YÊU CẦU ====
const ROOM_ID: ObjectId = "6899aa39d2a417b8d15ac3ad";
const USER1: ObjectId = "6891f46fc8037f0507a22f1f";
const USER2: ObjectId = "6896f2040d8ae3b3c114a531";

// 👉 ĐỔI GIỮA USER1 / USER2 ĐỂ TEST 2 TAB
const currentUserId: ObjectId = USER1;

const users: Record<string, UserLite> = {
  [USER1]: { _id: USER1, name: "User1", avatar: "https://i.pravatar.cc/150?img=2" },
  [USER2]: { _id: USER2, name: "User2", avatar: "https://i.pravatar.cc/150?img=11" },
};

const seedMessages: MessageDoc[] = [];

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

// ==== List cuộc hội thoại (2 người nên chỉ 1 dòng) ====
function ConversationList({
  me,
  messages,
  onSelect,
  selectedId,
}: {
  me: ObjectId;
  messages: MessageDoc[];
  onSelect: (otherId: ObjectId) => void;
  selectedId?: ObjectId | null;
}) {
  const convs = useMemo(() => {
    const map = new Map<ObjectId, MessageDoc[]>();
    messages.forEach((m) => {
      const other = getOtherUserId(m, me);
      if (!map.has(other)) map.set(other, []);
      map.get(other)!.push(m);
    });
    const rows = Array.from(map.entries()).map(([otherId, arr]) => {
      const last = arr.slice().sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
      return { otherId, last };
    });
    rows.sort((a, b) => b.last.created_at.localeCompare(a.last.created_at));
    // Nếu chưa có message nào, vẫn show đối phương để click
    if (rows.length === 0) {
      const otherId = me === USER1 ? USER2 : USER1;
      rows.push({
        otherId,
        last: {
          id: "seed",
          user_id: me,
          send_user_id: otherId,
          receive_user_id: me,
          text: "Bắt đầu chat…",
          created_at: new Date().toISOString(),
        } as MessageDoc,
      });
    }
    return rows;
  }, [me, messages]);

  return (
    <div className="border-b border-gray-200 dark:border-[#2c2c2c]">
      {convs.map(({ otherId, last }) => {
        const u = users[otherId];
        const active = selectedId === otherId;
        return (
          <div
            key={otherId}
            onClick={() => onSelect(otherId)}
            className={`flex gap-3 p-3 cursor-pointer transition-colors ${
              active ? "bg-gray-100 dark:bg-[#2b2b2b]" : "hover:bg-gray-100 dark:hover:bg-[#2b2b2b]"
            }`}
          >
            <img
              src={u?.avatar || "https://i.pravatar.cc/150?img=1"}
              alt="avatar"
              className="object-cover rounded-full w-10 h-10"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{u?.name || otherId}</span>
                <span className="text-[11px] text-gray-500">{timeAgo(last.created_at)}</span>
              </div>
              <span className="block text-[12px] text-gray-500 truncate">
                {lastMessagePreview(last)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==== Cửa sổ chat (giữ nguyên từ code của bạn, rút gọn imports) ====
function ChatWindow({
  me,
  otherId,
  allMessages,
  onSend,
  onBack,
}: {
  me: ObjectId;
  otherId: ObjectId;
  allMessages: MessageDoc[];
  onSend: (payload: { text?: string; image?: string; video?: string }) => void;
  onBack: () => void;
}) {
  const [text, setText] = useState("");
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const thread = useMemo(
    () =>
      allMessages
        .filter(
          (m) =>
            (m.send_user_id === me && m.receive_user_id === otherId) ||
            (m.send_user_id === otherId && m.receive_user_id === me)
        )
        .sort((a, b) => a.created_at.localeCompare(b.created_at)),
    [allMessages, me, otherId]
  );

  const other = users[otherId];

  const handlePickFile = () => fileInputRef.current?.click();

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
      <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-[#2c2c2c]">
        <button title="back" onClick={onBack} className="cursor-pointer">
          <MdOutlineArrowBack size={20} />
        </button>
        <img src={other?.avatar} className="w-8 h-8 rounded-full" alt="avatar" />
        <div className="font-medium text-sm">{other?.name || otherId}</div>
      </div>

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

export default function MessageWidget() {
  const [isOpen, setIsOpen] = useState(true); // mở sẵn cho test
  const [messages, setMessages] = useState<MessageDoc[]>(seedMessages);
  const [activeOther, setActiveOther] = useState<ObjectId | null>(USER2); // mặc định chat với USER2

  const wsRef = useRef<ReturnType<typeof connectChatWS> | null>(null);

  useEffect(() => {
    if (!activeOther) return;

    wsRef.current = connectChatWS({
      roomId: ROOM_ID,
      userId: currentUserId,
      onOpen: () => console.log("WS open", ROOM_ID),
      onMessage: (data: any) => {
        // Nếu BE broadcast lại cho cả phòng → bỏ echo của chính mình
        if (data.send_id === currentUserId) return;

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
  }, [activeOther]);

  const handleSend = (payload: { text?: string; image?: string; video?: string }) => {
    if (!activeOther || !wsRef.current) return;

    // Optimistic UI
    const newMsg: MessageDoc = {
      id: crypto.randomUUID(),
      user_id: currentUserId,
      send_user_id: currentUserId,
      receive_user_id: activeOther,
      ...payload,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);

    // Gửi WS thật
    wsRef.current.send({
      send_id: currentUserId,
      receiver_id: activeOther,
      text: payload.text,
      media: { image: payload.image, video: payload.video },
    });
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen((s) => !s)}
        className="fixed cursor-pointer flex justify-center items-center bottom-5 right-5 w-12 h-12 rounded-full bg-gray-100 dark:bg-[#1d1d1d] shadow-lg"
      >
        <AiOutlineMessage size={24} />
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-5 w-[320px] h-[480px] bg-white dark:bg-[#181818] shadow-2xl rounded-xl overflow-hidden border border-gray-200 dark:border-[#2c2c2c]">
          <div className="p-3 font-semibold text-sm border-b border-gray-200 dark:border-[#2c2c2c]">Messages</div>

          {activeOther ? (
            <ChatWindow
              me={currentUserId}
              otherId={activeOther}
              allMessages={messages}
              onSend={handleSend}
              onBack={() => setActiveOther(null)}
            />
          ) : (
            <div className="h-full overflow-y-auto">
              <ConversationList
                me={currentUserId}
                messages={messages}
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