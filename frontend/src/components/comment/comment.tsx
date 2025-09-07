'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineMore } from 'react-icons/ai';
import { formatTimeAgo } from '../../utils/formatIimeAgo.js';
import InputComment from './inputComment.js';
import { useDispatch, useSelector } from 'react-redux';
import { getUserByCommentId } from '../../redux/api/apiRequestUser.js';

interface StoreAny { [k: string]: any; }
interface CommentModel {
  _id: string; post_id: string; user_id: string;
  parent_id?: string | null; content: string;
  created_at: string; interact: number;
}
type CommentProps = {
  comment: CommentModel;
  onReply?: (text: string, parentId: string) => void;
  isActive: boolean;             // giữ lại nếu bạn cần cho logic khác
  onShowPicker: (commentId: string) => void; // nếu còn dùng outside
};

function CommentComponent({ comment, onReply, isActive, onShowPicker }: CommentProps) {
  const dispatch = useDispatch();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);      // ✅ quản lý emoji picker tại đây
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  const user = useSelector((s: StoreAny) => s.user.getUserByCommentId.data?.[comment._id]);

  useEffect(() => {
    if (!user && comment.user_id && comment._id) {
      // @ts-ignore
      dispatch(getUserByCommentId(comment.user_id, comment._id));
    }
  }, [user, comment.user_id, comment._id, dispatch]);

  const timeAgo = useMemo(() => formatTimeAgo(comment.created_at), [comment.created_at]);

  const { avatar, fullName } = useMemo(() => {
    const first = user?.first_name ?? '';
    const last  = user?.last_name ?? '';
    return {
      avatar: user?.avatar || '../../../public/Facebook-Avatar_3.png',
      fullName: `${last} ${first}`.trim() || 'Người dùng',
    };
  }, [user]);

  const mention = useMemo(() => (fullName ? `@${fullName} ` : ''), [fullName]);

  const handleEmojiClick = useCallback((emoji: any) => {
    setReplyText((prev) => prev + emoji.emoji);
  }, []);

  const handleReplySubmit = useCallback(() => {
    const text = replyText.trim();
    if (!text || !onReply) return;
    onReply(text, comment._id);
    setReplyText('');
    setShowReply(false);
    setPickerOpen(false);         // đóng picker sau khi gửi
  }, [replyText, onReply, comment._id]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReplySubmit();
    }
  }, [handleReplySubmit]);

  // mở ô reply + chèn/đổi mention
 const openReplyWithMention = useCallback(() => {
    setShowReply(true);
    setPickerOpen(false);

    setReplyText((prev) => {
      if (!mention) return prev;

      const trimmed = prev.replace(/^\s+/, '');
      let next = prev;

      if (trimmed.startsWith(mention)) {
        next = prev; // đã có đúng mention
      } else if (trimmed.startsWith('@')) {
        const firstSpace = trimmed.indexOf(' ');
        const rest = firstSpace > -1 ? trimmed.slice(firstSpace + 1) : '';
        next = `${mention}${rest}`;
      } else {
        next = `${mention}${prev || ''}`;
      }

      // Đặt caret sau khi state cập nhật & textarea đã mount
      queueMicrotask(() => {
        const el = editorRef.current;
        if (!el) return;
        el.focus();
        const pos = next.startsWith(mention) ? mention.length : next.length;
        el.setSelectionRange(pos, pos);
      });

      return next;
    });
  }, [mention]);

  // toggle picker
  const handleSetShowPicker = useCallback(() => {
    setPickerOpen(v => !v);
    onShowPicker?.(comment._id); // nếu bạn vẫn muốn báo ra ngoài
  }, [onShowPicker, comment._id]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex w-full justify-start items-center mb-2">
        <img src={avatar} alt="avatar" className="object-cover rounded-full w-[30px] h-[30px] mr-2" loading="lazy" />
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[14px] text-white font-bold mr-2">{fullName}</span>
          <span className="text-[12px] text-gray-300 mr-2">{timeAgo}</span>
        </div>
      
      </div>

      {/* Content */}
      <p className="text-[14px] text-white whitespace-pre-wrap break-words">{comment.content}</p>

      {/* Actions */}
      <div className="text-sm text-gray-400 mt-1 flex gap-3 items-center mb-2 hover:text-gray-200">
        <button
          type="button"
          className="text-xs hover:underline"
          onClick={openReplyWithMention}
          aria-expanded={showReply ? 'true' : 'false'}
          aria-controls={`reply-${comment._id}`}
        >
          Trả lời
        </button>
        {comment.interact > 0 && (
          <span className="text-xs text-gray-300">{comment.interact} phản hồi</span>
        )}
      </div>

      {/* Reply box */}
      {showReply && (
        <div id={`reply-${comment._id}`} role="region" aria-labelledby={`reply-btn-${comment._id}`} className="mt-2 ml-4 relative">
         <InputComment
            replyText={replyText}
            setReplyText={setReplyText}
            ref={editorRef}   
            handleReplySubmit={handleReplySubmit}
            handleEmojiClick={handleEmojiClick}
            handleSetShowPicker={handleSetShowPicker}
            showPicker={pickerOpen}   // <- quản lý ở Comment
            autoFocus
          />

        </div>
      )}
    </div>
  );
}

export default React.memo(CommentComponent);
