'use client';
import React, { useState } from 'react';

type Post = {
  id: string;
  user_id: string;
  text: string;
  image?: string;
  video?: string;
  flag: boolean;            // trạng thái đã bị gắn cờ
  total_love: number;
  total_comment: number;
  created_at: string;
  score: number;            // điểm kiểm duyệt từ backend
};

export default function PostProcessing() {
  // fake data
  const posts: Post[] = [
    {
      id: "1",
      user_id: "101",
      text: "Bài viết bình thường",
      flag: false,
      total_love: 10,
      total_comment: 3,
      created_at: new Date().toISOString(),
      score: 0.3,
    },
    {
      id: "2",
      user_id: "102",
      text: "Nội dung nhạy cảm",
      flag: true,
      total_love: 5,
      total_comment: 1,
      created_at: new Date().toISOString(),
      score: 0.85,
    },
    {
      id: "3",
      user_id: "103",
      text: "Nội dung cần xem xét thêm",
      flag: false,
      total_love: 0,
      total_comment: 0,
      created_at: new Date().toISOString(),
      score: 0.65,
    },
  ];

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const getStatus = (score: number) => {
    if (score >= 0.8) return "Tự động kiểm duyệt (AI)";
    if (score >= 0.6) return "Chờ duyệt tay";
    return "An toàn";
  };

  return (
    <div className="w-[90%] mx-auto h-[600px] bg-white flex flex-col items-center rounded-[20px] px-2 py-5">
      <div className="w-full overflow-y-auto">
        <table className="w-[90%] text-black">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Nội dung</th>
              <th className="px-3 py-2 text-left">Trạng thái</th>
              <th className="px-3 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="group">
                <td className="px-3 py-2 rounded-l-[20px]">{p.id}</td>
                <td className="px-3 py-2">{p.text}</td>
                <td
                  className={`px-3 py-2 ${
                    p.score >= 0.8
                      ? "text-red-600"
                      : p.score >= 0.6
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {getStatus(p.score)}
                </td>
                <td className="px-3 py-2 rounded-r-[20px]">
                  {p.score >= 0.6 && p.score < 0.8 && (
                    <button
                      onClick={() => setSelectedPost(p)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Xem lý do
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal kiểm duyệt tay */}
      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-5 rounded-lg w-[400px]">
            <h2 className="text-lg font-bold mb-3">Kiểm duyệt bài viết</h2>
            <p className="mb-3">Nội dung: {selectedPost.text}</p>
            <p className="mb-3 text-yellow-600">
              Điểm AI: {selectedPost.score} → cần admin kiểm duyệt
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  alert("Đã chấp nhận bài viết ✅");
                  setSelectedPost(null);
                }}
                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Chấp nhận
              </button>
              <button
                onClick={() => {
                  alert("Bài viết bị từ chối ❌");
                  setSelectedPost(null);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
