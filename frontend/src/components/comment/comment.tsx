'use client';
import { useEffect, useMemo, useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { formatTimeAgo } from '../../utils/formatIimeAgo.js'; 
import Heart from "../heart.js";
import InputComment from "./inputComment.js";
import { useDispatch, useSelector } from "react-redux";
import { getUserByCommentId } from "../../redux/api/apiRequestUser.js";
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
  isActive: boolean;
  onShowPicker: (commentId: string) => void;
}

export default function Comment({ comment, onReply, isActive, onShowPicker }: CommentProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const dispatch = useDispatch();
   const user = useSelector(
    (s: any) => s.user.getUserByCommentId.data?.[comment._id]
  );
  
useEffect(() => {
    if (comment.user_id && comment._id) {
      // @ts-ignore nếu bạn chưa định nghĩa AppDispatch
      dispatch(getUserByCommentId(comment.user_id, comment._id));
    }
  }, [comment.user_id, comment._id, dispatch]);

  const { avatar, fullName } = useMemo(() => {
    const first = user?.first_name ?? "";
    const last  = user?.last_name ?? "";
    return {
      avatar: user?.avatar ,
      fullName: `${last} ${first}`.trim(),
    };
  }, [user]);

  const handleSetShowPicker = () => onShowPicker(comment._id);
  const handleEmojiClick = (emoji: any) => setReplyText(prev => prev + emoji.emoji);

  const handleReplySubmit = () => {
    if (replyText.trim() && onReply) {
      onReply(replyText, comment._id);
      setReplyText("");
      setShowReply(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex w-full justify-start items-center mb-4">
        <img
          src={avatar}
          alt="avatar"
          className="object-cover rounded-full w-[30px] h-[30px] mr-2"
        />
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[14px] text-white font-bold mr-2">
            {fullName || "Người dùng"}
          </span>
          <span className="text-[12px] text-gray-300 mr-2">
            {formatTimeAgo(comment.created_at)}
          </span>
        </div>
        <div className="p-2 text-white cursor-pointer">
          <AiOutlineMore size={20} />
        </div>
      </div>

      <p className="text-sm text-white whitespace-pre-wrap break-words">
        {comment.content}
      </p>

      <div className="text-sm text-white mt-1 flex gap-2">
        <Heart postId={comment.post_id} size="text-sm" />
        <button className="text-xs" onClick={() => setShowReply(!showReply)}>
          Trả lời
        </button>
        {comment.interact > 0 && (
          <span /* bạn có thể mở danh sách phản hồi ở đây */>
            {comment.interact} phản hồi
          </span>
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
