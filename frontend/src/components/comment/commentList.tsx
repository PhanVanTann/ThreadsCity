import Comment from "./comment";
import React, { useEffect, useMemo, useRef, useState } from "react";

type CommentItem = {
  _id: string;
  post_id: string;
  user_id: string;
  parent_id?: string | null;
  content: string;
  created_at: string;
  interact: number;
};

type Props = {
  postId: string;
  comments: CommentItem[];
  onReply: (text: string, parentId: string) => void;
};

const MAX_VISIBLE_LEVEL = 3;

export default function CommentList({ postId, comments, onReply }: Props) {
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Gom theo parent
  const byParent = useMemo(() => {
    const map = new Map<string | null, CommentItem[]>();
    for (const c of comments) {
      const p = (c.parent_id ?? null) as string | null;
      if (!map.has(p)) map.set(p, []);
      map.get(p)!.push(c);
    }
    return map;
  }, [comments]);

  // Lấy toàn bộ descendants để đếm & flatten
  const collectDescendants = (id: string): CommentItem[] => {
    const out: CommentItem[] = [];
    const stack = [...(byParent.get(id) ?? [])];
    while (stack.length) {
      const n = stack.pop()!;
      out.push(n);
      const kids = byParent.get(n._id) ?? [];
      for (const k of kids) stack.push(k);
    }
    return out;
  };
  const countDescendants = (id: string) => collectDescendants(id).length;

  // --- INIT: mặc định ẩn chỉ 1 lần ---
  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    setCollapsed(() => {
      const init: Record<string, boolean> = {};
      for (const c of comments) {
        if ((byParent.get(c._id) ?? []).length > 0) init[c._id] = true; // ẩn
      }
      return init;
    });
    didInitRef.current = true;
  }, [comments, byParent]);

  // --- AUTO-EXPAND: mở cha của comment mới thêm, nhưng bỏ qua lần đầu ---
  const prevIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const nowIds = new Set(comments.map((c) => c._id));

    // lần đầu: ghi nhận rồi thoát, tránh mở ồ ạt
    if (prevIdsRef.current.size === 0) {
      prevIdsRef.current = nowIds;
      return;
    }

    // các id mới xuất hiện
    const added = comments.filter((c) => !prevIdsRef.current.has(c._id));
    if (added.length) {
      setCollapsed((prev) => {
        const next = { ...prev };
        for (const a of added) {
          const p = a.parent_id ?? null;
          if (p) next[p] = false; // mở nhánh cha để thấy comment mới
        }
        return next;
      });
    }

    prevIdsRef.current = nowIds;
  }, [comments]);

  const handleShowPicker = (commentId: string) => {
    setActiveCommentId((cur) => (cur === commentId ? null : commentId));
  };
  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  const indentClass = (level: number) =>
    level > 1 ? "ml-4 pl-4 border-l border-[#3d3d3d]/60" : "ml-0";

  // flatten descendants tại tầng 3
  const renderFlatDescendants = (parentId: string, visibleLevel: number) => {
    const flat = collectDescendants(parentId);
    return flat.map((c) => (
      <div key={c._id} className={indentClass(visibleLevel)}>
        <Comment
          comment={c}
          onReply={onReply}
          isActive={activeCommentId === c._id}
          onShowPicker={handleShowPicker}
        />
      </div>
    ));
  };

  const renderComments = (parentId: string | null = null, level = 1): React.ReactNode => {
    const list = byParent.get(parentId) ?? [];
    return list.map((comment) => {
      const totalDesc = countDescendants(comment._id);
      const hasDesc = totalDesc > 0;
      const isCollapsed = collapsed[comment._id] ?? true; // mặc định ẩn

      let childrenNode: React.ReactNode = null;
      if (hasDesc) {
        const controlsId = `children-${comment._id}`;
        const content =
          level + 1 < MAX_VISIBLE_LEVEL
            ? renderComments(comment._id, level + 1)
            : renderFlatDescendants(comment._id, MAX_VISIBLE_LEVEL);

        childrenNode = (
          <>
            <button
              type="button"
              onClick={() => toggleCollapse(comment._id)}
              className="mt-2 ml-10 text-xs text-gray-400 hover:text-gray-200"
              aria-expanded={isCollapsed ? "false" : "true"}
              aria-controls={controlsId}
            >
              {isCollapsed ? `Hiện ${totalDesc} phản hồi` : `Ẩn ${totalDesc} phản hồi`}
            </button>
            <div id={controlsId} className={isCollapsed ? "hidden" : "block"}>
              {content}
            </div>
          </>
        );
      }

      return (
        <div key={comment._id} className={indentClass(level)}>
          <Comment
            comment={comment}
            onReply={onReply}
            isActive={activeCommentId === comment._id}
            onShowPicker={handleShowPicker}
          />
          {childrenNode}
        </div>
      );
    });
  };

  return <div>{renderComments(null, 1)}</div>;
}
