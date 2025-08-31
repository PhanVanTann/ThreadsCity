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

/** MOCK dữ liệu demo UI */
const MOCK: PostWithStatus[] = [
  {
    id: '2', user_id: '102', text: 'Nội dung nhạy cảm (AI chặn)',
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    flag: true, total_love: 5, total_comment: 1, created_at: new Date().toISOString(), score: 0.85,
    status: deriveStatus(0.85), // blocked_auto
  },
  {
    id: '5', user_id: '105', text: 'Bài bị admin từ chối',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
    flag: true, total_love: 0, total_comment: 0, created_at: new Date().toISOString(), score: 0.62,
    status: 'rejected', rejectedAt: new Date().toISOString(),
  },
];

export default function NotApprovedPostsPage() {
  const [rows] = useState<PostWithStatus[]>(MOCK);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<PostWithStatus | null>(null);
  const COLS = 5;

  // Gom các bài KHÔNG được duyệt: AI chặn (blocked_auto) + admin từ chối (rejected)
  const notApproved = useMemo(
    () => rows.filter(r => r.status === 'blocked_auto' || r.status === 'rejected'),
    [rows]
  );

  // Demo refetch giả lập
  const refetch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="w-[90%] mx-auto h-[600px] bg-white dark:bg-[#181818] text-black dark:text-white flex flex-col items-center rounded-[20px] px-2 py-5">
      <div className="w-[90%] mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bài không được duyệt</h1>
        <div className="flex gap-2">
          <button onClick={refetch} className="px-3 py-1 rounded-lg border border-[#3d3d3d] hover:bg-gray-100 dark:hover:bg-[#2b2b2b]">Refetch</button>
          <div className="flex gap-2">
            <Link to="/moderation/pending" className="px-3 py-1 rounded-lg border border-[#3d3d3d] hover:bg-gray-100 dark:hover:bg-[#2b2b2b]">← Chờ xử lý</Link>
            <Link to="/moderation/approved" className="px-3 py-1 rounded-lg border border-[#3d3d3d] hover:bg-gray-100 dark:hover:bg-[#2b2b2b]">Đã duyệt →</Link>
          </div>
        </div>
      </div>

      <div className="w-full overflow-y-auto">
        <table className="w-[90%] mx-auto">
          <thead className="sticky top-0 bg-white dark:bg-[#181818] z-10">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Nội dung</th>
              <th className="px-3 py-2 text-left">Điểm AI</th>
              <th className="px-3 py-2 text-left">Lý do</th>
              <th className="px-3 py-2 text-left">Thời gian</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton rows={6} cols={COLS} />
          ) : (
            <tbody>
              {notApproved.length ? (
                notApproved.map((p) => (
                  <tr key={p.id} className="group border-b border-[#3d3d3d]">
                    <td className="px-3 py-2">{p.id}</td>
                    <td className="px-3 py-2">
                      <button
                        className="underline underline-offset-2 hover:opacity-80"
                        onClick={() => setPreview(p)}
                      >
                        {p.text}
                      </button>
                    </td>
                    <td className={`px-3 py-2 ${p.status === 'blocked_auto' ? 'text-red-600' : 'text-gray-600'}`}>
                      {p.score}
                    </td>
                    <td className="px-3 py-2">
                      {p.status === 'blocked_auto' ? 'AI chặn (≥ 0.8)' : 'Admin từ chối'}
                    </td>
                    <td className="px-3 py-2">
                      {p.status === 'rejected'
                        ? (p.rejectedAt ? new Date(p.rejectedAt).toLocaleString('vi-VN') : '-')
                        : new Date(p.created_at).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-6 text-center text-gray-500" colSpan={COLS}>
                    Không có bài bị từ chối / bị chặn.
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* Modal xem media */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setPreview(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white dark:bg-[#1d1d1d] text-black dark:text-white p-5 rounded-lg w-[min(90vw,700px)] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="text-lg font-bold">Xem bài không được duyệt</h2>
              <button
                onClick={() => setPreview(null)}
                className="px-3 py-1 bg-gray-200 dark:bg-[#2b2b2b] rounded-lg hover:bg-gray-300 dark:hover:bg-[#3b3b3b]"
              >
                Đóng
              </button>
            </div>

            <p className="mb-3"><span className="font-semibold">Nội dung:</span> {preview.text}</p>
            <p className="mb-3">
              <span className="font-semibold">Trạng thái:</span>{' '}
              {preview.status === 'blocked_auto' ? 'AI chặn (≥ 0.8)' : 'Admin từ chối'}
            </p>
            <p className="mb-3">
              <span className="font-semibold">Điểm AI:</span> {preview.score}
            </p>

            {(preview.video || preview.image) ? (
              <div className="mb-4">
                {preview.video ? (
                  <video src={preview.video} controls className="w-full max-h-[360px] rounded-lg" />
                ) : (
                  <img src={preview.image} alt="media" className="w-full max-h-[360px] object-contain rounded-lg" />
                )}
              </div>
            ) : (
              <div className="mb-4 text-sm text-gray-600 italic">Không có media đính kèm.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
