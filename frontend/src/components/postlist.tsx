'use client'
import React, { useEffect ,useMemo} from "react";
import Post from "./post"; // Component con

import { useDispatch, useSelector } from "react-redux";
import { getlistPost } from "src/redux/api/apiRequestPost";

export const mergeMediaToPosts = (rawPosts: any[]) => {
  return rawPosts.map((post) => ({
    ...post,
    media: [...(post.image || []), ...(post.video || [])].filter((url) => url !== ""),
  }));
};
export default function PostList() {
   const dispatch = useDispatch();
  const { data, isFetching, error } = useSelector((state: any) => state.post.getListPost);

  useEffect(() => {
    getlistPost(dispatch);  // gọi API 1 lần khi mount
  }, [dispatch]);
    const postsSorted = useMemo(() => {
    const arr = Array.isArray(data?.data) ? data.data : [];
    return [...arr].sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [data]);

   if (isFetching) return <p className="text-white">Đang tải...</p>;
  if (error) return <p className="text-red-500">Lỗi tải bài viết</p>;
  if (!data) return null;
  return (
    <div className="flex flex-col items-center">
      {postsSorted.map((post:any) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}
