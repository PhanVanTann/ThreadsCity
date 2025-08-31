'use client'
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "./post";
import { getlistPost } from "src/redux/api/apiRequestPost";
import { resetListPost } from "src/redux/slice/postSlice";
export const mergeMediaToPosts = (rawPosts: any[]) => {
  return rawPosts.map((post) => ({
    ...post,
    media: [...(post.image || []), ...(post.video || [])].filter((url) => url !== ""),
  }));
};

export default function PostList() {
  const dispatch = useDispatch<any>();
  const { data, isFetching, error, nextCursor, done } = useSelector((s:any)=> s.post.getListPost);

  const items = Array.isArray(data) ? data : [];

  const sentinelRef   = useRef<HTMLDivElement|null>(null);
  const loadingRef    = useRef(false);
  const nextCursorRef = useRef<string | null>(null);
  const doneRef       = useRef(false);

  useEffect(() => {  dispatch(resetListPost()); getlistPost(dispatch) }, [dispatch]);

  useEffect(() => { loadingRef.current    = isFetching; }, [isFetching]);
  useEffect(() => { nextCursorRef.current = nextCursor ?? null; }, [nextCursor]);
  useEffect(() => { doneRef.current       = Boolean(done); }, [done]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const requestMore = async (obs: IntersectionObserver | null, target: Element | null) => {
      if (loadingRef.current || doneRef.current) return;
      if (obs && target) obs.unobserve(target);
      loadingRef.current = true;
      try {
        await getlistPost(dispatch, nextCursorRef.current || undefined);
      } finally {
        loadingRef.current = false;
        if (!doneRef.current && obs && target) obs.observe(target);
      }
    };

    const io = new IntersectionObserver(async ([entry], obs) => {
      if (entry.isIntersecting) await requestMore(obs, entry.target);
    }, { rootMargin: "0px 0px 300px 0px" });

    io.observe(el);

    const r = el.getBoundingClientRect();
    if (r.top <= window.innerHeight + 300 && !loadingRef.current && !doneRef.current) {
      setTimeout(() => requestMore(io, el), 0);
    }

    return () => io.disconnect();
  }, [dispatch]);

  if (error) return <p className="text-red-500">Lỗi tải bài viết</p>;

  return (
    <div className="flex flex-col items-center">
      {items.map((post:any) => <Post key={post._id} post={post} />)}

      {/* sentinel: hiện khi CHƯA hết dữ liệu */}
      {!done && <div ref={sentinelRef} style={{ height: 1 }} />}

      {isFetching && <p className="text-white">Đang tải thêm...</p>}
      {!isFetching && done && items.length > 0 && <p className="text-white/60 py-2">Hết bài rồi</p>}
      {!isFetching && done && items.length === 0 && <p className="text-white/60 py-2">Chưa có bài viết</p>}
    </div>
  );
}