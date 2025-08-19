import Comment from "./comment";
import { useState } from "react";
export default function CommentList({postId, comments, onReply }: { postId:string; comments: any[]; onReply: (text: string, parentId: string) => void; }) {
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  // Hàm để bật hoặc tắt emoji picker cho comment
  const handleShowPicker = (commentId: string) => {
    // Nếu commentId trùng với activeCommentId, tắt emoji picker
    if (activeCommentId === commentId) {
      setActiveCommentId(null);
    } else {
      // Nếu không, mở emoji picker cho comment mới và tắt emoji picker cho comment trước đó
      setActiveCommentId(commentId);
    }
  };

  const renderComments = (parentId: string | null = null) => {
    return comments
      .filter((c) => (c.parent_id || null) === parentId)
      .map((comment) => (
        <div key={comment._id} className={comment.parent_id ? "pl-4 ml-4" : "ml-4"}>
          <Comment
            comment={comment}
            onReply={onReply}
            isActive={activeCommentId === comment._id}  // Kiểm tra xem comment có đang mở emoji picker không
            onShowPicker={handleShowPicker}  // Truyền hàm để bật/tắt emoji picker
          />
          {renderComments(comment._id)}
        </div>
      ));
  };
  const totalComments = comments.filter((comment) => comment.post_id === postId).length;
  return <div>{renderComments()}</div>;
}
