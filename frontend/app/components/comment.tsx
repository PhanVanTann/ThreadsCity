'use client';
import { useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { usertest } from '../datatest';
import { formatTimeAgo } from '../utils/formatIimeAgo'; 
import Heart from "./heart";

import InputComment from "./inputComment";

interface CommentProps {
  comment: {
    _id: string;
    post_id: string;
    user_id: string;
    parent_id?: string | null;
    text: string;
    created_at: string;
    interact: number;
  };
  onReply?: (text: string, parentId: string) => void;
  isActive: boolean;  // Prop để kiểm tra xem emoji picker có đang mở không
  onShowPicker: (commentId: string) => void;  // Prop để toggle emoji picker
}

export default function Comment({ comment, onReply, isActive, onShowPicker }: CommentProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [getNameRep, setGetNameRep] = useState<string>("");

  const handleSetShowPicker = () => {
    onShowPicker(comment._id);  // Gọi hàm từ component cha để toggle emoji picker
  };

  const handleEmojiClick = (emoji: any) => {
    setReplyText((prev) => prev + emoji.emoji);
  };

  const handleReplySubmit = () => {
    if (replyText.trim() && onReply) {
      onReply(replyText, comment._id);
      setReplyText("");
      setShowReply(false);
    }
  };

  const handleGetNameRep = (name: string) => {
    setGetNameRep(name);
    setReplyText(`@${name} `);
    setShowReply(true); // mở khung reply
  };

  const user = usertest.find((u) => u.id === comment.user_id);
  const Name = `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim();

  return (
    <div className="w-full p-2 ">
      {/* Header */}
      <div className="flex w-full justify-start items-center">
        <img
          src={user?.avatar_image}
          alt="avatar"
          className="object-cover rounded-full w-[40px] h-[40px] mr-2"
        />
        <div className="flex items-center">
          <span className="text-white font-bold mr-2">
            {user?.first_name} {user?.last_name}
          </span>
          <span className="text-sm text-gray-300 mr-2">
            {formatTimeAgo(comment.created_at)}
          </span>
        </div>
        <div className="p-2 text-white cursor-pointer">
          <AiOutlineMore size={20} />
        </div>
      </div>
      <p className="text-sm text-white">{comment.text}</p>
      <div className="text-sm text-white mt-1 flex gap-2">
        <Heart postId={comment.post_id} size="text-sm" />
        
        <button
          className="text-xs"
          onClick={() => setShowReply(!showReply)}
        >
          Trả lời
        </button>
        {comment.interact > 0 && (
          <span onClick={() => handleGetNameRep(Name)}>{comment.interact} phản hồi</span>
        )}
      </div>

      {showReply && (
       <InputComment 
          replyText={replyText}
          setReplyText={setReplyText}
          handleReplySubmit={handleReplySubmit}
          handleEmojiClick={handleEmojiClick}
          handleSetShowPicker={handleSetShowPicker}
          isActive={isActive}
          />
      )}
    </div>
  );
}
