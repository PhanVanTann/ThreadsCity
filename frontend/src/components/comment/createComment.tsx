'use client';
import React, { useState } from 'react';
import { FaRegSmile } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { CreateComments } from 'src/redux/api/apiRequestComment';

interface CreateCommentProps {
  post_id?: string;
  isActive: boolean;
}

export default function CreateComment({ isActive, post_id }: CreateCommentProps) {
  const [inputText, setInputText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [pending, setPending] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const currentUserId = useSelector((s: any) => s.auth.login.currentUser?.user_id) as string | undefined;
  const dispatch = useDispatch();

  const pickerOpen = isActive && showPicker;
  const canSend = !!currentUserId && !!post_id && inputText.trim().length > 0 && !pending;

  const handleEmojiClick = (emoji: any) => setInputText((prev) => prev + emoji.emoji);

  const doSubmit = async () => {
    if (!canSend) return;
    try {
      setPending(true);
      await CreateComments({ user_id: currentUserId, post_id, content: inputText.trim() }, dispatch);
      setInputText('');
      setShowPicker(false);
    } finally {
      setPending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doSubmit();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Enter = gửi
      void doSubmit();
    }
    // Shift+Enter: không chặn -> xuống dòng
  };

  return (
    <div className="sticky  bottom-0 left-0 right-0 z-10 bg-gray-100/95 dark:bg-[#181818]/95 backdrop-blur border-t border-[#353535] pt-2">
      <div className="relative">
        {/* Emoji Picker */}
        {pickerOpen && (
          <div id="emoji-panel" className="absolute bottom-full mb-2 left-0 z-20">
            <EmojiPicker theme="dark" width={320} height={360} onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex items-start gap-2">
          {/* Nút emoji */}
          <button
            type="button"
            className="mt-1 flex h-[28px] w-[28px] items-center justify-center text-xl dark:text-[#cfcfcf] hover:opacity-90"
            onClick={() => setShowPicker((v) => !v)}
            aria-haspopup="dialog"
            aria-expanded={pickerOpen ? 'true' : 'false'}
            aria-controls="emoji-panel"
            title="Chọn emoji"
            disabled={!isActive}
          >
            <FaRegSmile size={22} />
          </button>

          <div className="relative flex-1 max-h-[400px]">
            <div
              className="invisible whitespace-pre-wrap break-words p-2 rounded-md border-b-2 border-[#353535] text-base leading-6
                         text-gray-800 dark:text-white"
            >
              {(inputText || '') + '\n'} 
            </div>

            <textarea
              rows={1}
              className="absolute inset-0 h-full  w-full resize-none  overflow-y bg-transparent p-2
                         rounded-md border-b-2 border-[#353535] focus:border-white/60 focus:outline-none
                         text-gray-800 dark:text-white "
              placeholder="Viết bình luận..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={onKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              aria-label="Nội dung bình luận"
            />
          </div>

          {/* Nút gửi */}
          <button
            title="Gửi"
            type="submit"
            className="mt-1 px-2 py-1 text-white disabled:opacity-50"
            disabled={!canSend}
            aria-disabled={!canSend}
          >
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
