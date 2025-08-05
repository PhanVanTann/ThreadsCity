import React, { useState } from 'react';
import { AiOutlineMore } from 'react-icons/ai';

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

const usertest = {
  id: "64e3d54e8b7c5e3f20a1b001",
  role: "user",
  first_name: "Linh",
  last_name: "Nguyễn",
  Email: "linh.nguyen@example.com",
  avatar_image: "https://i.pravatar.cc/150?img=3",
  is_google_account: false,
  number: "0987654321",
  created_at: "2025-08-01T10:15:00Z",
  follow: 12,
  is_verify: true,
};

export default function Post({ post }: { post: Post }) {
  const [current, setCurrent] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const next = () => setCurrent((prev) => (prev + 1) % post.media.length);
  const prev = () =>
    setCurrent((prev) => (prev === 0 ? post.media.length - 1 : prev - 1));

  const currentMedia = post.media[current];
  const isVideo = currentMedia.endsWith(".mp4");

  return (
    <div className="w-[700px] flex flex-col items-center mt-5 bg-gray-100 dark:bg-[#181818] gap-5 border border-gray-300 rounded-lg p-4">
      {/* Header */}
      <div className="flex w-full items-center">
        <img
          src={usertest.avatar_image}
          alt="avatar"
          className="object-cover rounded-full w-[40px] h-[40px] mr-2"
        />
        <div className="flex-grow flex items-center">
          <span className="text-white font-bold mr-2">
            {usertest.first_name} {usertest.last_name}
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
      <p className="text-sm text-gray-300">
        {new Date(post.created_at).toLocaleString("vi-VN")}
      </p>
      <p className="text-lg font-medium text-white">{post.text}</p>

      {/* Media */}
      <div className="relative w-full">
        {isVideo ? (
          <video controls className="w-full rounded-lg">
            <source src={currentMedia} type="video/mp4" />
            Trình duyệt không hỗ trợ video.
          </video>
        ) : (
          <img
            src={currentMedia}
            alt="media"
            className="w-full rounded-lg object-cover"
          />
        )}

        {/* Nút chuyển */}
        {post.media.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
