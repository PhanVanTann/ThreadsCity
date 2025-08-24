import React, { useState } from 'react';
import { FaRegSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { FiSend } from 'react-icons/fi';
import { useDispatch, useSelector } from "react-redux";
import { CreateComments } from 'src/redux/api/apiRequestComment';

interface InputCommentProps {
  post_id?: string;  
  isActive: boolean;
}

export default function CreateComment({ isActive, post_id }: InputCommentProps) {
  const [inputText, setInputText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const currentUserId = useSelector((s: any) => s.auth.login.currentUser?.user_id) as string | undefined;
  const dispatch = useDispatch();

  const handleEmojiClick = (emoji: any) => setInputText(prev => prev + emoji.emoji);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId || !post_id || !inputText.trim()) return;

    await CreateComments({ user_id: currentUserId, post_id, content: inputText.trim() }, dispatch);
    setInputText("");            // clear sau khi gửi
    setShowPicker(false);
  }

  return (
    // 🔥 Sticky ở đáy vùng scroll
    <div className="sticky w-full  bottom-0 left-0 right-0 z-10 bg-gray-100/95 dark:bg-[#181818]/95
                    backdrop-blur border-t border-[#353535]  pt-2">
      <div className="relative">
        {/* Emoji Picker nổi lên phía trên ô nhập */}
        {showPicker && (
          <div className="absolute bottom-full mb-2 left-0 z-20">
            <EmojiPicker theme="dark" width={320} height={360} onEmojiClick={handleEmojiClick} />
          </div>
        )}

        {/* Nút emoji */}
        <button
          type="button"
          className="text-xl w-[28px] dark:text-[#cfcfcf] cursor-pointer mb-2"
          onClick={() => setShowPicker(v => !v)}
          title="Chọn emoji"
        >
          <FaRegSmile size={22} />
        </button>

        {/* Form nhập & gửi */}
        <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
          <input
            type="text"
            className="w-full p-2 rounded-md bg-transparent border-b-2 border-[#353535]
                       focus:border-white/60 focus:outline-none text-gray-800 dark:text-white"
            placeholder="Nhập phản hồi..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button title="Gửi" type="submit" className="text-white cursor-pointer px-2 py-1">
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

