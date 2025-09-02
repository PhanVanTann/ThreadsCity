'use client';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TableSkeleton from './components/TableSkeleton';

type ModerationStatus = 'approved_auto'|'pending'|'approved_manual'|'rejected'|'blocked_auto';
type Post = {
  id: string; user_id: string; text: string; image?: string; video?: string;
  flag: boolean; total_love: number; total_comment: number; created_at: string; score: number;
};
type PostWithStatus = Post & {
  status: ModerationStatus; approvedBy?: 'system'|'moderator'; approvedAt?: string; rejectedAt?: string;
};

const deriveStatus = (score: number): ModerationStatus =>
  score >= 0.8 ? 'blocked_auto' : score >= 0.6 ? 'pending' : 'approved_auto';

// Mock dữ liệu để demo UI
const MOCK: PostWithStatus[] = [
  {
    id: '1', user_id: '101', text: 'Bài viết bình thường',
    image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1200&auto=format&fit=crop',
    flag: false, total_love: 10, total_comment: 3, created_at: new Date().toISOString(), score: 0.3,
    status: deriveStatus(0.3), approvedBy: 'system', approvedAt: new Date(Date.now() - 3600_000).toISOString(), // 1h trước
  },
  {
    id: '3', user_id: '103', text: 'Bài đã duyệt tay (demo)',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
    flag: false, total_love: 2, total_comment: 0, created_at: new Date().toISOString(), score: 0.65,
    status: 'approved_manual', approvedBy: 'moderator', approvedAt: new Date().toISOString(),
  },
  {
    id: '4', user_id: '104', text: 'Bài auto an toàn khác',
    flag: false, total_love: 1, total_comment: 0, created_at: new Date().toISOString(), score: 0.2,
    status: 'approved_auto', approvedBy: 'system', approvedAt: new Date(Date.now() - 7200_000).toISOString(), // 2h trước
  },
];

export default function ApprovedPostsPage() {
  const [rows, setRows] = useState<PostWithStatus[]>(MOCK);
  const [loading, setLoading] = useState(false);
  const COLS = 5;

  // Gộp tất cả bài đã duyệt (auto + manual), sort theo approvedAt desc (mới nhất lên đầu)
  const approvedAll = useMemo(() => {
    const list = rows.filter(r => r.status === 'approved_auto' || r.status === 'approved_manual');
    return list.sort((a, b) => {
      const ta = a.approvedAt ? new Date(a.approvedAt).getTime() : 0;
      const tb = b.approvedAt ? new Date(b.approvedAt).getTime() : 0;
      return tb - ta;
    });
  }, [rows]);

  // Demo “Refetch”: giả lập loading 800ms
  const refetch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="w-[90%] mx-auto h-[600px] bg-white dark:bg-[#181818] text-black dark:text-white flex flex-col items-center rounded-[20px] px-2 py-5 mt-9">
      <div className="w-[90%] mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Danh sách bài đã duyệt</h1>
        <div className="flex gap-2">
          <button onClick={refetch} className="px-3 py-1 rounded-lg border border-[#3d3d3d] hover:bg-gray-100 dark:hover:bg-[#2b2b2b]">Refetch</button>
          <Link to="/moderation/pending" className="px-3 py-1 rounded-lg border border-[#3d3d3d] hover:bg-gray-100 dark:hover:bg-[#2b2b2b]">Trang chờ xử lý →</Link>
        </div>
      </div>

      <div className="w-full overflow-y-auto">
        <table className="w-[90%] mx-auto">
          <thead className="sticky top-0 bg-white dark:bg-[#181818] z-10">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Nội dung</th>
              <th className="px-3 py-2 text-left">Điểm AI</th>
              <th className="px-3 py-2 text-left">Cách duyệt</th>
              <th className="px-3 py-2 text-left">Thời gian duyệt</th>
            </tr>
          </thead>

        {loading ? (
          <TableSkeleton rows={6} cols={COLS} />
        ) : (
          <tbody>
            {approvedAll.length ? (
              approvedAll.map((p) => (
                <tr key={p.id} className="group border-b border-[#3d3d3d]">
                  <td className="px-3 py-2">{p.id}</td>
                  <td className="px-3 py-2">{p.text}</td>
                  <td className="px-3 py-2 text-green-600">{p.score}</td>
                  <td className="px-3 py-2">
                    {p.status === 'approved_manual' ? 'Admin (Duyệt tay)' : 'Hệ thống (Tự động)'}
                  </td>
                  <td className="px-3 py-2">
                    {p.approvedAt ? new Date(p.approvedAt).toLocaleString('vi-VN') : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={COLS}>
                  Chưa có bài đã duyệt.
                </td>
              </tr>
            )}
          </tbody>
        )}
        </table>
      </div>
    </div>
  );
}
