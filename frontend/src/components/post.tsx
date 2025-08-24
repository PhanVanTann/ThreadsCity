'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlineMore } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { formatTimeAgo } from '../utils/formatIimeAgo.js';
import HeartButton from './heart';
import CommentList from '../components/comment/commentList.js';

import CreateComment from './comment/createComment.js';
import { useDispatch, useSelector } from "react-redux";
import { CreateComments, GetComments } from "src/redux/api/apiRequestComment";


type Post = {
  _id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  text: string | null;
  media: string | null;     // <-- chỉ 1 field string
  is_video?: boolean;
  flag: boolean;
  total_love: number;
  total_comment: number;
  created_at: string;
  status: string;
};

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov|m4v)$/i.test(url);

export default function Post({ post }: { post: Post }) {
  const [openComment, setOpenComment] = useState(false);
  const dispatch = useDispatch();
  const [fetched, setFetched] = useState(false);
  const commentsState = useSelector(
    (s: any) => s.comment.byPost?.[post._id]
  ) || { data: null, isFetching: false, error: false, success: false };

  const { data, isFetching, error, success } = commentsState;
  const comments: any[] = data?.data ?? [];
  const currentUserId = useSelector((s:any) => s.auth.login.currentUser?.user_id) as string | undefined;

  console.log("comments", comments);
  // chịu trường hợp BE lỡ trả media là mảng: lấy phần tử đầu
  const mediaUrl = useMemo(() => {
    const raw = post.media as unknown;
    if (Array.isArray(raw)) return raw.find(Boolean) ?? '';
    return post.media ?? '';
  }, [post.media]);

  const isVideo = mediaUrl ? isVideoUrl(mediaUrl) : false;

useEffect(() => {
  if (!openComment) return;
  if (success) return; // đã có trong cache thì khỏi fetch
  GetComments(post._id, dispatch);
}, [openComment, fetched, post._id, dispatch]);

const handleReply = async (text: string, parentId: string) => {
  // if (!currentUserId) {
  //   toast.error("Vui lòng đăng nhập lại");
  //   return;
  // }
  if (!text.trim()) return;

  await CreateComments(
    {
      user_id: currentUserId,
      post_id: post._id,     // id bài post hiện tại
      content: text.trim(),
      parent_id: parentId,   // QUAN TRỌNG: id của comment bạn đang reply
    },
    dispatch
  );
  
};
useEffect(() => {
  if (!openComment) return;
  const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenComment(false);
  window.addEventListener("keydown", onKey);
  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";
 
  return () => {
    window.removeEventListener("keydown", onKey);
    document.body.style.overflow = prev;
  };
}, [openComment]);




  return (
    <div className="w-[700px] relative flex flex-col items-start mt-5 bg-gray-100 dark:bg-[#181818] gap-5 border border-[#3d3d3d] rounded-lg p-4">
      {/* Header */}
      <div className="flex w-full items-center">
        <img
          src={post.avatar || 'https://i.pravatar.cc/150?img=1'}
          alt="avatar"
          className="object-cover rounded-full w-[40px] h-[40px] mr-2"
        />
        <div className="flex-grow flex items-center">
          <span className="text-white font-bold mr-2">
            {`${post.last_name ?? ''} ${post.first_name ?? ''}`.trim() || 'Người dùng'}
          </span>
          <span className="text-sm text-gray-300 mr-2">{formatTimeAgo(post.created_at)}</span>
        </div>
        <div className="p-2 text-white cursor-pointer">
          <AiOutlineMore size={20} />
        </div>
      </div>
      {/* content */}
      <div className="w-full flex flex-col gap-3">
           {post.text && (
        <div className="w-full">
          <p className="text-md font-medium text-white">{post.text}</p>
        </div>
      )}

      {/* Single media */}
      {mediaUrl && (
        <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-lg">
          {isVideo ? (
            <video controls className="w-full rounded-lg">
              <source src={mediaUrl} />
              Trình duyệt không hỗ trợ video.
            </video>
          ) : (
            <img src={mediaUrl} alt="media" className="w-full rounded-lg" />
          )}
        </div>
      )}
      </div>
      {/* Caption */}
     

      {/* Actions */}
      <div className=' w-full flex flex-col'>
        <div className="flex gap-5">
          <HeartButton postId={post._id} size="text-xl" />
          <div className="flex items-center gap-1 text-gray-300">
            <button
              title="Bình luận"
              className="text-gray-300 h-[20px]"
              onClick={() => setOpenComment(v => !v)}
            >
              <FaRegComment size={20} />
            </button>
            <span className="text-[20px]">{post.total_comment}</span>
          </div>
        </div>
      </div>
{openComment && (
  <div
    className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center "
    onMouseDown={(e) => {
      const box = (e.currentTarget.querySelector("#comment-modal") as HTMLDivElement) || null;
      if (box && !box.contains(e.target as Node)) setOpenComment(false); // click nền → đóng
    }}
  >
   <div
  id="comment-modal"
 className={`w-full bg-gray-100 dark:bg-[#181818] border border-[#3d3d3d] rounded-lg
             h-[90vh] flex flex-col ${mediaUrl.length > 0 ? 'max-w-[1300px]' : 'max-w-[700px]'}`}
>
  {/* Header */}
  <div className="shrink-0 p-3 border-b border-[#3d3d3d] flex justify-between">
    <h3 className="font-semibold">Bình luận</h3>
    <button onClick={() => setOpenComment(false)}>Đóng</button>
  </div>
    <div className='w-full h-full flex gap-3 p-4 overflow-hidden'>
      {/* Media */}
    {mediaUrl.length > 0 && (
        isVideo ? (
          <video controls className="w-full max-w-[70%] rounded-lg ">
            <source src={mediaUrl} />
          </video>
        ) : (
          <img src={mediaUrl} className="w-full max-w-[80%] rounded-lg " />
        )
      )}

            
          
  {/* VÙNG CUỘN */}
          <div className=
          {` flex flex-col h-full overflow-y-auto   scroll-dark ${mediaUrl.length > 0 ? 'w-[30%]' : 'w-full'}`}>
               <div className="flex w-full items-center">
                  <img
                    src={post.avatar || 'https://i.pravatar.cc/150?img=1'}
                    alt="avatar"
                    className="object-cover rounded-full w-[40px] h-[40px] mr-2"
                  />
                  <div className="flex-grow flex items-center">
                    <span className="text-white font-bold mr-2">
                      {`${post.last_name ?? ''} ${post.first_name ?? ''}`.trim() || 'Người dùng'}
                    </span>
                    <span className="text-sm text-gray-300 mr-2">{formatTimeAgo(post.created_at)}</span>
                  </div>
                  <div className="p-2 text-white cursor-pointer">
                    <AiOutlineMore size={20} />
                  </div>
                </div>
              {post.text && (
                <div className="w-full py-4 border-b border-[#3d3d3d]">
                  <p className="text-md font-medium text-white">{post.text}</p>
                </div>
              )}
                  <div className=' w-full flex flex-col'>
              <div className="flex gap-5">
                <HeartButton postId={post._id} size="text-xl" />
                <div className="flex items-center gap-1 text-gray-300">
                  <button
                    title="Bình luận"
                    className="text-gray-300 h-[20px]"
                    
                  >
                    <FaRegComment size={20} />
                  </button>
                  <span className="text-[20px]">{post.total_comment}</span>
                </div>
              </div>
            </div>
            
              <div className='h-full'>
         {isFetching ? (
            <div className="text-white p-5">Đang tải bình luận...</div>
          ) : error ? (
            <div className="text-red-400 p-5">Lỗi tải bình luận</div>
          ) : comments.length > 0 ? (
              <CommentList
                    postId={post._id}
                    comments={comments}
                    onReply={handleReply}    
                  />          
          ) : (
            <div className="text-white p-5">Chưa có bình luận nào</div>
          )}

              </div>
              {/* CreateComment là con của vùng scroll để sticky hoạt động */}
              <CreateComment post_id={post._id} isActive={openComment} />
          </div>
  </div>
</div>

  </div>
)}


    </div>
  );
}