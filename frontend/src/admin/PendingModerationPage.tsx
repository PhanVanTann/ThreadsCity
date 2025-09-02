'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TableSkeleton from './components/TableSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { getPostAwaitingCensorship ,getCenterPostById,updatePostStatus} from 'src/redux/api/apiRequestAdminPost';


type ModerationStatus = 'approved_auto'|'pending'|'approved_manual'|'rejected'|'blocked_auto';
type censorships = []
type Post = {
  _id: string; user_id: string; text: string; image_url?: string;
  flag: boolean; total_love: number; created_at: string; confidence: number;
};
type PostWithStatus = Post & {
  status: ModerationStatus; approvedBy?: 'system'|'moderator'; approvedAt?: string; rejectedAt?: string; censorships?:censorships
};


export default function PendingModerationPage() {
  const [selected, setSelected] = useState<PostWithStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const COLS = 4;
  const dispatch = useDispatch();
  const  cursor  = useSelector((state: any) => state.adminPost.getPostAwaitingCensorship?.data);
 
  const data:any = Array.isArray(cursor.data)? cursor.data : [];
  const dataPost:any = useSelector((state: any) => state.adminPost.getCenterPostById?.data?.data);

  useEffect(() => {
    getPostAwaitingCensorship(dispatch);
  }, [dispatch]);
 console.log(data,"data");
 console.log(cursor,"cursor");

  const refetch = async () => {
  setLoading(true);
  try {
    await getPostAwaitingCensorship(dispatch);   // 👈 gọi lại API
  } finally {
    setLoading(false);
  }
};
  const handlePost = async(post_id:string) => {
    await getCenterPostById(post_id,dispatch)
    
  }
  const handleUpdateStatus = async(post_id:string,status:string) => {
    console.log(post_id,status,"post_id,status");
    await updatePostStatus({post_id:post_id,status:status},dispatch)
    await getPostAwaitingCensorship(dispatch);
    setSelected(null);
  }
  useEffect(() => {
  if (dataPost) {
    setSelected(dataPost);
    console.log("ss", dataPost);
  }
}, [dataPost]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  

  return (
    <div className="w-[90%] mx-auto h-[600px] bg-white dark:bg-[#181818] text-black dark:text-white flex flex-col items-center rounded-[20px] px-2 py-5 mt-9">
      <div className="w-[90%] mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bài đăng đang chờ xử lý</h1>
        <div className="flex gap-2">
          <button onClick={refetch} className="px-3 py-1 rounded-lg border border-[#3d3d3d] hover:bg-gray-100 dark:hover:bg-[#2b2b2b]">Refetch</button>
          {/* <Link to="/moderation/approved" className="px-3 py-1 rounded-lg border border-[#3d3d3d] hover:bg-gray-100 dark:hover:bg-[#2b2b2b]">Trang bài đã duyệt →</Link> */}
        </div>
      </div>

      <div className="w-full overflow-y-auto">
        <table className="w-[90%] mx-auto">
          <thead className="sticky top-0 bg-white dark:bg-[#181818] z-10">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Tên người đăng</th>
              <th className="px-3 py-2 text-left">Nội dung</th>
              <th className="px-3 py-2 text-left">Hành động</th>
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton rows={5} cols={COLS} />
          ) : (
            <tbody>
              {data?.length ? (
                data?.map((p:any) => (
                  <tr key={p._id} className="group border-b border-[#3d3d3d]">
                    <td className="px-3 py-2">{p._id}</td>
                    <td className="px-3 py-2">{p.last_name} {p.first_name}</td>
                    <td className="px-3 py-2">Nội dung cần xem xét thêm</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button onClick={() => handlePost(p._id) } className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                          Xem lý do / Media
                        </button>
                        <button onClick={() =>handleUpdateStatus(p._id,'valid') } className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">
                          Chấp nhận
                        </button>
                        <button onClick={() => handleUpdateStatus(p._id,'not valid')} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">
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
            {selected?.censorships?.map((item:any) => (
              <div className="" key={item._id}>
              <p className="mb-3 text-yellow-600">Điểm AI: <span className="font-semibold">{item.confidence}</span> → cần admin kiểm duyệt</p>

            
              <div className="mb-4">   
                  <img src={item.image_url} alt="media" className="w-full max-h-[360px] object-contain rounded-lg" />
              </div>
          

            <div className="flex justify-end gap-3">
              <button onClick={() => handleUpdateStatus(item.post_id,'valid')} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">Chấp nhận</button>
              <button onClick={() => handleUpdateStatus(item.post_id,'not valid')} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">Từ chối</button>
            </div>
            </div>
       ))}
          </div>
        </div>
      )}
    </div>
  );
}
