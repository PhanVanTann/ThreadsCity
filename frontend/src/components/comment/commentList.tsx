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

  // Map parent -> children
  const byParent = useMemo(() => {
    const map = new Map<string | null, CommentItem[]>();
    for (const c of comments) {
      const p = (c.parent_id ?? null) as string | null;
      if (!map.has(p)) map.set(p, []);
      map.get(p)!.push(c);
    }
    return map;
  }, [comments]);

  // Map child -> parent (để mở toàn bộ ancestors khi có comment mới)
  const parentOf = useMemo(() => {
    const m: Record<string, string | null> = {};
    for (const c of comments) m[c._id] = c.parent_id ?? null;
    return m;
  }, [comments]);

  // Thu thập toàn bộ descendants để đếm & flatten
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

  // --- INIT: mặc định ẩn các nhánh có con (chạy 1 lần) ---
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

  // --- Ref tới từng comment DOM để scroll ---
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const setNodeRef = (id: string) => (el: HTMLDivElement | null) => {
    nodeRefs.current[id] = el;
  };

  // id cần scroll sau khi render
  const pendingScrollIdRef = useRef<string | null>(null);

  // --- AUTO-EXPAND + đánh dấu cần scroll khi có comment mới ---
  const prevIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const nowIds = new Set(comments.map((c) => c._id));

    // Lần đầu: ghi nhận rồi thoát
    if (prevIdsRef.current.size === 0) {
      prevIdsRef.current = nowIds;
      return;
    }

    // Tìm các id mới
    const added = comments.filter((c) => !prevIdsRef.current.has(c._id));
    if (added.length) {
      const newest = added[added.length - 1]; // ưu tiên mới nhất
      // Mở toàn bộ ancestors của comment mới
      setCollapsed((prev) => {
        const next = { ...prev };
        let p = parentOf[newest._id];
        while (p) {
          next[p] = false; // mở cha
          p = parentOf[p];
        }
        return next;
      });
      // Sau khi mở nhánh, đánh dấu sẽ scroll tới comment mới
      pendingScrollIdRef.current = newest._id;
    }

    prevIdsRef.current = nowIds;
  }, [comments, parentOf]);

  // Khi collapsed hoặc comments thay đổi (sau khi render), thực hiện scroll
  useEffect(() => {
    const id = pendingScrollIdRef.current;
    if (!id) return;

    // Đợi 1 frame cho layout ổn định
    requestAnimationFrame(() => {
      const el = nodeRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      pendingScrollIdRef.current = null;
    });
  }, [comments, collapsed]);

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
      <div key={c._id} ref={setNodeRef(c._id)} className={indentClass(visibleLevel)}>
        <Comment
          comment={c}
          onReply={onReply}
          isActive={activeCommentId === c._id}
          onShowPicker={handleShowPicker}
        />
      </div>
    ));
  };

  const renderComments = (
    parentId: string | null = null,
    level = 1
  ): React.ReactNode => {
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
              {isCollapsed
                ? `Hiện ${totalDesc} phản hồi`
                : `Ẩn ${totalDesc} phản hồi`}
            </button>
            <div id={controlsId} className={isCollapsed ? "hidden" : "block"}>
              {content}
            </div>
          </>
        );
      }

      return (
        <div key={comment._id} ref={setNodeRef(comment._id)} className={indentClass(level)}>
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
