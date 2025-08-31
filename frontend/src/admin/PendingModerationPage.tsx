'use client';
import React, { useEffect, useMemo, useState } from 'react';
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

// mock dữ liệu cho UI
const MOCK: PostWithStatus[] = [
  {
    id: '1', user_id: '101', text: 'Bài viết bình thường',
    image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1200&auto=format&fit=crop',
    flag: false, total_love: 10, total_comment: 3, created_at: new Date().toISOString(), score: 0.3,
    status: deriveStatus(0.3), approvedBy: 'system', approvedAt: new Date().toISOString(),
  },
  {
    id: '2', user_id: '102', text: 'Nội dung nhạy cảm',
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    flag: true, total_love: 5, total_comment: 1, created_at: new Date().toISOString(), score: 0.85,
    status: deriveStatus(0.85),
  },
  {
    id: '3', user_id: '103', text: 'Nội dung cần xem xét thêm',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
    flag: false, total_love: 0, total_comment: 0, created_at: new Date().toISOString(), score: 0.65,
    status: deriveStatus(0.65),
  },
];

export default function PendingModerationPage() {
  const [rows, setRows] = useState<PostWithStatus[]>(MOCK);
  const [selected, setSelected] = useState<PostWithStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const COLS = 4;

  // chỉ hiển thị bài đang chờ duyệt tay (0.6 ≤ score < 0.8)
  const pendingRows = useMemo(() => rows.filter(r => r.status === 'pending'), [rows]);

  // demo “Refetch”: giả lập loading 800ms
  const refetch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const approveLocal = (id: string) =>
    setRows(prev => prev.map(p => p.id === id ? { ...p, status: 'approved_manual', approvedBy: 'moderator', approvedAt: new Date().toISOString() } : p));

  const rejectLocal = (id: string) =>
    setRows(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected', rejectedAt: new Date().toISOString() } : p));

  return (
    <div className="w-[90%] mx-auto h-[600px] bg-white dark:bg-[#181818] text-black dark:text-white flex flex-col items-center rounded-[20px] px-2 py-5">
      <div className="w-[90%] mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bài đăng đang chờ xử lý</h1>
        <div className="flex gap-2">
          <button onClick={refetch} className="px-3 py-1 rounded-lg border border-[#3d3d3d] hover:bg-gray-100 dark:hover:bg-[#2b2b2b]">Refetch</button>
          <Link to="/moderation/pending" className="px-3 py-1 rounded-lg border border-[#3d3d3d] hover:bg-gray-100 dark:hover:bg-[#2b2b2b]">← Bài đăng vi phạm</Link>
          <Link to="/moderation/approved" className="px-3 py-1 rounded-lg border border-[#3d3d3d] hover:bg-gray-100 dark:hover:bg-[#2b2b2b]">Trang bài đã duyệt →</Link>
        </div>
      </div>

      <div className="w-full overflow-y-auto">
        <table className="w-[90%] mx-auto">
          <thead className="sticky top-0 bg-white dark:bg-[#181818] z-10">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Nội dung</th>
              <th className="px-3 py-2 text-left">Điểm AI</th>
              <th className="px-3 py-2 text-left">Hành động</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton rows={5} cols={COLS} />
          ) : (
            <tbody>
              {pendingRows.length ? (
                pendingRows.map((p) => (
                  <tr key={p.id} className="group border-b border-[#3d3d3d]">
                    <td className="px-3 py-2">{p.id}</td>
                    <td className="px-3 py-2">{p.text}</td>
                    <td className="px-3 py-2 text-yellow-600">{p.score}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button onClick={() => setSelected(p)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                          Xem lý do / Media
                        </button>
                        <button onClick={() => approveLocal(p.id)} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">
                          Chấp nhận
                        </button>
                        <button onClick={() => rejectLocal(p.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">
                          Từ chối
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-6 text-center text-gray-500" colSpan={COLS}>Không có bài chờ duyệt.</td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* Modal media */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelected(null)} role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-[#1d1d1d] text-black dark:text-white p-5 rounded-lg w-[min(90vw,700px)] max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="text-lg font-bold">Kiểm duyệt bài viết</h2>
              <button onClick={() => setSelected(null)} className="px-3 py-1 bg-gray-200 dark:bg-[#2b2b2b] rounded-lg hover:bg-gray-300 dark:hover:bg-[#3b3b3b]">Đóng</button>
            </div>

            <p className="mb-3"><span className="font-semibold">Nội dung:</span> {selected.text}</p>
            <p className="mb-3 text-yellow-600">Điểm AI: <span className="font-semibold">{selected.score}</span> → cần admin kiểm duyệt</p>

            {(selected.video || selected.image) ? (
              <div className="mb-4">
                {selected.video ? (
                  <video src={selected.video} controls className="w-full max-h-[360px] rounded-lg" />
                ) : (
                  <img src={selected.image} alt="media" className="w-full max-h-[360px] object-contain rounded-lg" />
                )}
              </div>
            ) : (
              <div className="mb-4 text-sm text-gray-600 italic">Không có media đính kèm.</div>
            )}

            <div className="flex justify-end gap-3">
              <button onClick={() => { approveLocal(selected.id); setSelected(null); }} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">Chấp nhận</button>
              <button onClick={() => { rejectLocal(selected.id); setSelected(null); }} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">Từ chối</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
