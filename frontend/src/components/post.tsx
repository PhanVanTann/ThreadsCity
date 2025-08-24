'use client';
import React, { useMemo, useState } from 'react';
import { AiOutlineMore } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { formatTimeAgo } from '../utils/formatIimeAgo.ts';
import HeartButton from './heart';
import CommentList from './commentList';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

type Post = {
  _id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  text: string | null; // <-- chỉ 1 field string
  is_video?: boolean;
  flag: boolean;
  total_love: number;
  total_comment: number;
  created_at: string;
  status: string;
  media:[]
};

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov|m4v)$/i.test(url);

export default function Post({ post }: { post: Post }) {
  const navigate = useNavigate()
  const [openComment, setOpenComment] = useState(false);
    const currentUserId = useSelector(
    (s: any) => s.auth.login.currentUser?.user_id
  ) as string | undefined;
  // chịu trường hợp BE lỡ trả media là mảng: lấy phần tử đầu
  const mediaUrl = useMemo(() => {
    const raw = post.media as unknown;
    if (Array.isArray(raw)) return raw.find(Boolean) ?? '';
    return post.media ?? '';
  }, [post.media]);
  console.log(currentUserId,"llllll")
  const isVideo = mediaUrl ? isVideoUrl(mediaUrl) : false;
  const handleClickProfileUser = (user_id:string)=>{
      navigate(`profile/${user_id}`)
  }
  return (
    <div className="w-[700px] flex flex-col items-start mt-5 bg-gray-100 dark:bg-[#181818] gap-5 border border-[#3d3d3d] rounded-lg p-4">
      {/* Header */}
      <div className="flex w-full items-center " >
        <img
          src={post.avatar || 'https://i.pravatar.cc/150?img=1'}
          onClick={()=>{handleClickProfileUser(post.user_id)}}
          alt="avatar"
          className="object-cover rounded-full w-[40px] h-[40px] mr-2 cursor-pointer"
        />
        <div className="flex-grow flex items-center">
          <span className="text-white font-bold mr-2">
            {`${post.last_name ?? ''} ${post.first_name ?? ''}`.trim() || 'Người dùng'}
          </span>
          <span className="text-sm text-gray-300 mr-2">{formatTimeAgo(post.created_at)}</span>
        </div>
        {currentUserId==post.user_id&&(
          <div className="p-2 text-white cursor-pointer">
                  <AiOutlineMore size={20} />
                </div>
        )}
     
      </div>

      {/* Caption */}
      {post.text && (
        <div className="w-full">
          <p className="text-md font-medium text-white">{post.text}</p>
        </div>
      )}

      {/* Single media */}
      {!!mediaUrl && (
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

      {/* Actions */}
      <div>
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

        {openComment && <CommentList postId={post._id} comments={[]} onReply={() => {}} />}
      </div>
    </div>
  );
}