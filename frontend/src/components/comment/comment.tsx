'use client';
import { useEffect, useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { usertest } from '../../datatest.js';
import { formatTimeAgo } from '../../utils/formatIimeAgo.js'; 
import Heart from "../heart.js";

import InputComment from "./inputComment.js";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "src/redux/api/apiRequestUser.js";
import { data } from "react-router-dom";

interface CommentProps {
  comment: {
    _id: string;
    post_id: string;
    user_id: string;
    parent_id?: string | null;
    content: string;
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
  const dispatch = useDispatch();
  const userData = useSelector((state:any)=>state.user.getUserById?.data?.data)
  const Name = `${userData?.first_name ?? ''} ${userData?.last_name ?? ''}`.trim();

  
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

useEffect(() => {
  if (!comment.user_id) return;
  
  getUserById(comment.user_id, dispatch);
}, [comment.user_id, dispatch]);

  console.log("Rendering CommentList with comments:", userData);

  // const user = usertest.find((u) => u.id === comment.user_id);
  
  console.log("Name:", Name);
  return (
    <div className="w-full  ">
      {/* Header */}
      <div className="flex w-full justify-start items-center mb-4">
        <img
          src={userData?.avatar_image}
          alt="avatar"
          className="object-cover rounded-full w-[40px] h-[40px] mr-2"
        />
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[14px] text-white font-bold mr-2">
             {userData?.last_name} {userData?.first_name}
          </span>
          <span className="text-[12px] text-gray-300 mr-2">
            {formatTimeAgo(comment.created_at)}
          </span>
        </div>
        <div className="p-2 text-white cursor-pointer">
          <AiOutlineMore size={20} />
        </div>
      </div>
      <p className="text-sm text-white whitespace-pre-wrap break-words ">{comment.content}</p>
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
