import React, { useMemo, useState,useEffect,useRef } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { LuSendHorizontal, LuX } from "react-icons/lu";
import { FaPaperclip, FaRegSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import type { ObjectId, UserLite, MessageDoc } from "./types";

export default function ChatWindow({
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
    const listRef = useRef<HTMLDivElement | null>(null);
   const bottomRef = useRef<HTMLDivElement | null>(null);
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
     useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [thread.length, other._id]);
  
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
  
        <div ref={listRef} className="flex-1 min-h-0 p-3 overflow-y-auto space-y-2">
          {thread.map((m) => {
            const mine = String(m.send_user_id) === meId;
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
                   {new Date(m.created_at).toLocaleTimeString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                  })}
                    </div>
                </div>
              </div>
            );
          })}
           <div ref={bottomRef} />
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