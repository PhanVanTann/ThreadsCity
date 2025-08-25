import React, { useState } from 'react';
import { FaRegSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
 import { FiSend } from 'react-icons/fi';
interface InputCommentProps {
  replyText: string;
  setReplyText: (text: string) => void;
  handleReplySubmit: () => void;
  handleEmojiClick: (emoji: any) => void;
  handleSetShowPicker: () => void;
  isActive: boolean;
}

export default function InputComment({ replyText,
  setReplyText,
  handleReplySubmit,
  handleEmojiClick,
  handleSetShowPicker,
  isActive
}: InputCommentProps) {
// Điều khiển hiển thị emoji picker

 

 

 

  return (
    <div className="mt-2 flex flex-col relative">
      {/* Emoji Picker sẽ hiển thị nếu isActive và showPicker là true */}
      {isActive  && (
        <div className="absolute bottom-30 z-10">
          <EmojiPicker
            theme="dark"
            width={400}
            height={380}
            onEmojiClick={handleEmojiClick}  // Gọi hàm khi emoji được chọn
          />
        </div>
      )}

      {/* Nút chọn emoji */}
      <button
        type="button"
        className="text-xl  w-[28px] dark:text-[#4d4d4d] cursor-pointer"
        onClick={handleSetShowPicker}  // Toggle emoji picker
        tabIndex={-1}
        title="Chọn emoji"
      >
        <FaRegSmile size={20} />
      </button>
        <div className='w-full flex '>
                <input
                        type='text'
                        className="w-full p-2 mb-4 border-b-2 border-[#353535] focus:border-b-2 focus:border-[#fff]/60 focus:outline-none text-gray-700 dark:text-white"
                        placeholder="Nhập phản hồi..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}  // Cập nhật nội dung khi thay đổi
                    />

                    {/* Nút gửi phản hồi */}
                    <button
                        title='add comment'
                        className="text-white cursor-pointer mt-1 px-2 py-1 text-xs w-fit"
                        onClick={handleReplySubmit}  // Gửi phản hồi
                    >
                      <FiSend size={20} />
                    </button>
                        </div>
                    {/* Textarea để nhập phản hồi */}
                    
    </div>
  );
}
