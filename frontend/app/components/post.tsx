'use client';
import React, { useState } from 'react';
import { AiOutlineMore } from 'react-icons/ai';
import  {formatTimeAgo}  from '../utils/formatIimeAgo'; // Adjust the import path as necessary
import HeartButton from './heart';
import CommentList from './commentList';
import { FaRegComment } from 'react-icons/fa';
import totalComments from './commentList';
import { mockComments,usertest } from '../datatest'; // Adjust the import path as necessary
// Assuming you have a utility function for formatting time
type Post = {
  id: string;
  user_id: string;
  text: string;
  media: string[];
  flag: boolean;
  total_love: number;
  total_comment: number;
  created_at: string;
};

export type User = {
  id: string;
  role: 'user' | 'admin'; // hoặc string nếu có nhiều vai trò khác
  first_name: string;
  last_name: string;
  Email: string;
  avatar_image: string;
  is_google_account: boolean;
  number: string;
  created_at: string; // ISO string, nếu dùng Date object thì đổi thành Date
  follow: number;
  is_verify: boolean;
};


export default function Post({ post }: { post: Post }) {
  const [current, setCurrent] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  
  const handleReply = (text: string, parentId: string) => {
    console.log("Reply to:", parentId, "with text:", text);
    // Gửi request tạo comment mới tại đây nếu có backend
  };
  const next = () => {
  if (post.media.length === 0) return;
  setTransitioning(true);
  setTimeout(() => {
    setCurrent((prev) => (prev + 1) % post.media.length);
    setTransitioning(false);
  }, 300); // thời gian khớp với CSS transition
};

const prev = () => {
  if (post.media.length === 0) return;
  setTransitioning(true);
  setTimeout(() => {
    setCurrent((prev) =>
      prev === 0 ? post.media.length - 1 : prev - 1
    );
    setTransitioning(false);
  }, 300);
};

  const currentMedia = post.media[current];
  const isVideo = currentMedia.endsWith(".mp4");
  const User = usertest.find((u) => u.id === post.user_id);
  return (
    <div className="w-[700px] flex flex-col items-start mt-5 bg-gray-100 dark:bg-[#181818] gap-5 border border-[#3d3d3d] rounded-lg p-4">
      {/* Header */}
      <div className="flex w-full items-center">
        <img
          src={ "https://i.pravatar.cc/150?img=1"} // Replace with actual avatar path
          alt="avatar"
          className="object-cover rounded-full w-[40px] h-[40px] mr-2"
        />
        <div className="flex-grow flex items-center">
          <span className="text-white font-bold mr-2">
            {User?.first_name} {User?.last_name}
          </span>
          <span className=" text-sm text-gray-300 mr-2">
                {formatTimeAgo(post.created_at)}
          </span>
          {isFollowing ? (
            <button className="text-white">Đang theo dõi</button>
          ) : (
            <button
              className="text-white hover:underline"
              onClick={() => setIsFollowing(true)}
            >
              Theo dõi
            </button>
          )}
           
        </div>
        <div className="p-2 text-white cursor-pointer">
          <AiOutlineMore size={20} />
        </div>
      </div>

      {/* Content */}
     <div className="w-full  ">
        <p className="text-md font-medium text-white">{post.text}</p>
     </div>
   

      {/* Media */}
      <div className="relative w-full  h-[400px] flex justify-center items-center overflow-hidden rounded-lg">
        <div className={`w-full  ${transitioning ? "fade fade-out" : "fade"}`}>
        {isVideo ? (
          <video controls className="w-full rounded-lg realative z-10">
            <source src={currentMedia} type="video/mp4" />
            Trình duyệt không hỗ trợ video.
          </video>
        ) : (
          <img
            src={currentMedia}
            alt="media"
            className="w-full rounded-lg "
          />
        )}
        </div>
        {/* Nút chuyển */}
        {post.media.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute z-10 left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute z-10 right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
            >
              ›
            </button>
          </>
        )}
         {post.media.length > 1 && (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
      {post.media.map((_, idx) => (
        <div
          key={idx}
          className={`w-2 h-2 rounded-full ${
            idx === current ? "bg-white" : "bg-gray-400"
          }`}
        />
      ))}
    </div>
  )}
 

      </div>
      <div>
        <div className='flex gap-5'>
            <HeartButton postId={post.id} size='text-xl'  />
        <div className='flex items-center gap-1 text-gray-300'>
          <button title='a' className='text-gray-300  h-[20px]' onClick={()=>setOpenComment(!openComment)}>
                      <FaRegComment size={20}/>
                    
                      </button>
                   <span className='text-[20px]'> {post.total_comment}</span>  
        </div>
          
        </div>
       
         {openComment && post.id==mockComments[0].post_id && (
          <CommentList postId={post.id} comments={mockComments} onReply={handleReply} />
          )}
          
         
      </div>
    </div>
  );
}
// mock/comments.ts

