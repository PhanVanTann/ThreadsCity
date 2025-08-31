'use client';
import React from 'react';
import { useModeration } from './moderation-store';
import { Link } from 'react-router-dom';
import TableSkeleton from './components/TableSkeleton';

export default function ApprovedPostsPage() {
  const { approvedAutoPosts, approvedManualPosts, loading, error, refetch } = useModeration();
  const COLS = 5;

  return (
    <div className="w-[90%] mx-auto h-[600px] bg-white dark:bg-[#181818] text-black dark:text-white flex flex-col items-center rounded-[20px] px-2 py-5">
      <div className="w-[90%] mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Danh sách bài đã được duyệt</h1>
        <div className="flex gap-2">
          <button onClick={refetch} className="px-3 py-1 rounded-lg border border-[#3d3d3d] hover:bg-gray-100 dark:hover:bg-[#2b2b2b]">Refetch</button>
          <Link to="/moderation/pending" className="px-3 py-1 rounded-lg border border-[#3d3d3d] hover:bg-gray-100 dark:hover:bg-[#2b2b2b]">← Trang chờ xử lý</Link>
        </div>
      </div>

      {error && <div className="w-[90%] mb-2 text-red-500 text-sm">Lỗi: {error}</div>}

      {/* Duyệt tự động */}
      <section className="w-full mb-6">
        <h2 className="w-[90%] mx-auto mb-2 font-semibold">Duyệt tự động (AI)</h2>
        <div className="w-full overflow-y-auto">
          <table className="w-[90%] mx-auto">
            <thead className="sticky top-0 bg-white dark:bg-[#181818] z-10">
              <tr>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Nội dung</th>
                <th className="px-3 py-2 text-left">Điểm AI</th>
                <th className="px-3 py-2 text-left">Người duyệt</th>
                <th className="px-3 py-2 text-left">Thời gian</th>
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton rows={4} cols={COLS} />
            ) : (
              <tbody>
                {approvedAutoPosts.length ? (
                  approvedAutoPosts.map((p) => (
                    <tr key={p.id} className="group border-b border-[#3d3d3d]">
                      <td className="px-3 py-2">{p.id}</td>
                      <td className="px-3 py-2">{p.text}</td>
                      <td className="px-3 py-2 text-green-600">{p.score}</td>
                      <td className="px-3 py-2">Hệ thống</td>
                      <td className="px-3 py-2">{p.approvedAt ? new Date(p.approvedAt).toLocaleString('vi-VN') : '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-6 text-center text-gray-500" colSpan={COLS}>
                      Chưa có bài được duyệt tự động.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </section>

      {/* Duyệt tay */}
      <section className="w-full">
        <h2 className="w-[90%] mx-auto mb-2 font-semibold">Duyệt tay (Admin)</h2>
        <div className="w-full overflow-y-auto">
          <table className="w-[90%] mx-auto">
            <thead className="sticky top-0 bg-white dark:bg-[#181818] z-10">
              <tr>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Nội dung</th>
                <th className="px-3 py-2 text-left">Điểm AI</th>
                <th className="px-3 py-2 text-left">Người duyệt</th>
                <th className="px-3 py-2 text-left">Thời gian</th>
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton rows={4} cols={COLS} />
            ) : (
              <tbody>
                {approvedManualPosts.length ? (
                  approvedManualPosts.map((p) => (
                    <tr key={p.id} className="group border-b border-[#3d3d3d]">
                      <td className="px-3 py-2">{p.id}</td>
                      <td className="px-3 py-2">{p.text}</td>
                      <td className="px-3 py-2 text-green-600">{p.score}</td>
                      <td className="px-3 py-2">Admin</td>
                      <td className="px-3 py-2">{p.approvedAt ? new Date(p.approvedAt).toLocaleString('vi-VN') : '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-6 text-center text-gray-500" colSpan={COLS}>
                      Chưa có bài được duyệt tay.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </section>
    </div>
  );
}
