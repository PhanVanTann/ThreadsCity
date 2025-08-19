import React, { useMemo, useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { MdOutlineArrowBack } from 'react-icons/md';
import { LuSendHorizontal, LuX } from 'react-icons/lu';
import { FaImages, FaPaperclip, FaRegSmile, FaVideo } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
type ObjectId = string;

export type MessageDoc = {
  id: ObjectId;
  user_id: ObjectId;            // owner/tenant (tuỳ bạn có dùng hay không)
  send_user_id: ObjectId;
  receive_user_id: ObjectId;
  text?: string;
  image?: string;
  video?: string;
  created_at: string;           // ISO string
};

type UserLite = {
  _id: ObjectId;
  name: string;
  avatar?: string;
};

// ==== mock (thay bằng API thật) ====
const currentUserId: ObjectId = "u1";
const users: Record<string, UserLite> = {
  u1: { _id: "u1", name: "Bạn", avatar: "https://i.pravatar.cc/150?img=2" },
  u2: { _id: "u2", name: "Minh", avatar: "https://i.pravatar.cc/150?img=11" },
  u3: { _id: "u3", name: "Lan", avatar: "https://i.pravatar.cc/150?img=14" },
};

const seedMessages: MessageDoc[] = [
  {
    id: "m1",
    user_id: "u1",
    send_user_id: "u2",
    receive_user_id: "u1",
    text: "Chiều nay đi cf?",
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: "m2",
    user_id: "u1",
    send_user_id: "u1",
    receive_user_id: "u2",
    text: "Ok 3h nhé",
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: "m3",
    user_id: "u1",
    send_user_id: "u3",
    receive_user_id: "u1",
    text: "Gửi mình file thiết kế với!",
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

// ==== helpers ====
function getOtherUserId(m: MessageDoc, me: ObjectId) {
  return m.send_user_id === me ? m.receive_user_id : m.send_user_id;
}

function lastMessagePreview(m: MessageDoc) {
  if (m.text && m.text.trim()) return m.text;
  if (m.image) return "📷 Image";
  if (m.video) return "🎬 Video";
  return "(empty)";
}

// ==== UI components ====
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
  // group by otherUserId
  const convs = useMemo(() => {
    const map = new Map<ObjectId, MessageDoc[]>();
    messages.forEach((m) => {
      const other = getOtherUserId(m, me);
      if (!map.has(other)) map.set(other, []);
      map.get(other)!.push(m);
    });

    // reduce to last message
    const rows = Array.from(map.entries()).map(([otherId, arr]) => {
      const last = arr.slice().sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
      return { otherId, last };
    });

    // sort by last desc
    rows.sort((a, b) => b.last.created_at.localeCompare(a.last.created_at));
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
      {convs.length === 0 && (
        <div className="p-4 text-sm text-gray-500">Chưa có tin nhắn</div>
      )}
    </div>
  );
}



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

  // Chọn file ảnh hoặc video
  const handlePickFile = () => fileInputRef.current?.click();

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);

    if (f.type.startsWith("image/")) {
      setMediaType("image");
    } else if (f.type.startsWith("video/")) {
      setMediaType("video");
    } else {
      setMediaType(null);
    }
    setMediaFile(url);
  };

  // Gửi tin nhắn
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
        <button title="a" onClick={onBack} className="cursor-pointer">
          <MdOutlineArrowBack size={20} />
        </button>
        <img
          src={other?.avatar || "https://i.pravatar.cc/150?img=1"}
          className="w-8 h-8 rounded-full"
          alt="avatar"
        />
        <div className="font-medium text-sm">{other?.name || otherId}</div>
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
                
                {m.image && <img src={m.image} className="rounded-md mt-1 max-h-52 object-cover"  alt="a"/>}
                {m.video && (
                  <video controls className="rounded-md mt-1 max-h-52">
                    <source src={m.video} />
                  </video>
                )}
                {m.text && <div className="whitespace-pre-wrap">{m.text}</div>}
                <div className="text-[10px] opacity-70 mt-1 text-right">
                  {new Date(m.created_at).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="p-3 border-t border-gray-200 dark:border-[#2c2c2c]">
        {/* Preview media */}
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
            {mediaType === "image" && (
              <img src={mediaFile} className="max-h-40 rounded-lg border" alt="a"/>
            )}
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
          {/* Emoji */}
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
                <EmojiPicker
                  onEmojiClick={(emojiData) => setText((prev) => prev + emojiData.emoji)}
                  theme="dark"
                />
              </div>
            )}
          </div>

          {/* Nút chung cho ảnh + video */}
          <button
            type="button"
            onClick={handlePickFile}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b2b2b]"
            title="Đính kèm ảnh/video"
          >
            <FaPaperclip />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={onFileChange}
          />

          {/* Ô nhập */}
          <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Nhập tin nhắn…"
                className="flex-1 rounded-lg px-3 py-2 bg-gray-100 dark:bg-[#2b2b2b] outline-none resize-none"
                rows={1}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // tránh xuống dòng
                    handleSend();
                    }
                }}
                />

          {/* Gửi */}
          <button
            type="submit"
            className="px-3 py-2 cursor-pointer text-white rounded-lg "
            title="Gửi"
          >
            <LuSendHorizontal size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}




export default function MessageWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageDoc[]>(seedMessages);
  const [activeOther, setActiveOther] = useState<ObjectId | null>(null);

  const handleSend = (payload: { text?: string; image?: string; video?: string }) => {
    if (!activeOther) return;
    const newMsg: MessageDoc = {
      id: crypto.randomUUID(),
      user_id: currentUserId,
      send_user_id: currentUserId,
      receive_user_id: activeOther,
      ...payload,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    // TODO: POST /messages với body newMsg
  };

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
          {/* Header */}

            <div className="h-full">
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
                  <div className="p-3 font-semibold text-sm border-b border-gray-200 dark:border-[#2c2c2c]">
                        Messages
                    </div>
                    <ConversationList
                        me={currentUserId}
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
