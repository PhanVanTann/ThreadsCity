import Comment from "./comment";

export default function CommentList({ comments, onReply }: {
  comments: any[];
  onReply: (text: string, parentId: string) => void;
}) {
  const renderComments = (parentId: string | null = null) => {
    return comments
      .filter((c) => (c.parent_id || null) === parentId)
      .map((comment) => (
        <div key={comment._id} className="ml-4">
          <Comment comment={comment} onReply={onReply} />
          {renderComments(comment._id)}
        </div>
      ));
  };

  return <div>{renderComments()}</div>;
}
