'use client';
import React, { forwardRef, useState } from 'react';
import { FaRegSmile } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';

type Props = {
  replyText: string;
  setReplyText: (v: string) => void;
  handleReplySubmit: () => void;
  handleEmojiClick: (e: any) => void;
  handleSetShowPicker: () => void;
  showPicker: boolean;     // control từ cha
  autoFocus?: boolean;
};

const InputComment = forwardRef<HTMLTextAreaElement, Props>(function InputComment(
  { replyText, setReplyText, handleReplySubmit, handleEmojiClick, handleSetShowPicker, showPicker, autoFocus },
  ref
) {
  const [isComposing, setIsComposing] = useState(false);
  const canSend = replyText.trim().length > 0;

  // Enter = gửi, Shift+Enter = xuống dòng (hỗ trợ IME)
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReplySubmit();
    }
  };

  // style dùng lại cho mirror & textarea (phải KHỚP padding/line-height/font)
  const fieldBase =
    'p-2 rounded-md border border-[#3a3a3a] bg-transparent ' +
    'text-[15px] leading-6 text-gray-900 dark:text-white ' +
    'focus:outline-none focus:border-white/60';

  return (
    <div className="mt-2 relative">
      {/* Emoji picker: nổi phía trên, bám vào container này */}
      {showPicker && (
        <div id="emoji-panel" className="absolute bottom-full mb-2 left-0 z-20">
          <EmojiPicker theme="dark" width={320} height={360} onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div className="flex items-start gap-2">
        {/* Nút Emoji */}
        <button
          type="button"
          className="mt-1 flex h-[28px] w-[28px] items-center justify-center text-xl dark:text-[#cfcfcf] hover:opacity-90"
          onClick={handleSetShowPicker}
          aria-haspopup="dialog"
          aria-expanded={showPicker ? 'true' : 'false'}
          aria-controls="emoji-panel"
          title="Chọn emoji"
        >
          <FaRegSmile size={22} />
        </button>

        <div className="relative flex-1">
          <div
            className={`invisible whitespace-pre-wrap break-words min-h-[40px] ${fieldBase}`}
          >
            {(replyText || '') + '\n'}
          </div>

          <textarea
            ref={ref}
            rows={1}
            className={`absolute inset-0 w-full p-2 border-b-2 border-[#353535] focus:border-[#fff]/60 focus:outline-none
                     text-gray-800 dark:text-white bg-transparent resize-none max-h-40  overflow-hidden ${fieldBase}`}
            placeholder="Nhập phản hồi..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={onKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            autoFocus={autoFocus}
            aria-label="Nội dung phản hồi"
          />
        </div>

        {/* Nút Gửi */}
        <button
          type="button"
          title="Gửi phản hồi"
          className="mt-1 px-2 py-1 text-white disabled:opacity-50"
          onClick={handleReplySubmit}
          disabled={!canSend}
          aria-disabled={!canSend}
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
});

export default InputComment;
