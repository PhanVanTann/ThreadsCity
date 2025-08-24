'use client';
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaImages } from "react-icons/fa6";
import { FaRegSmile } from "react-icons/fa";
import { useClickOutside } from "src/hook/useClickOutside";
import { createPost,getlistPost } from "src/redux/api/apiRequestPost";
import { getUserById } from "src/redux/api/apiRequestUser";
import LoadingPost from "src/pages/loadingPost/LoadingPost";
import EmojiPopup from "./emojipick";

import { Navigate, useNavigate } from 'react-router-dom'
type Props = { open: boolean; onClose: () => void };

export default function Postmodel({ open, onClose }: Props) {
  const dispatch = useDispatch();
const navigate = useNavigate()
  const userData = useSelector((s: any) => s.user.getUserById?.data?.data || {});
  const currentUserId = useSelector(
    (s: any) => s.auth.login.currentUser?.user_id
  ) as string | undefined;



  const [files, setFiles] = useState<File[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [content, setContent] = useState("");

  const menuRef = useRef<HTMLDivElement | null>(null);

  // form "bẩn"?
  const isDirty = content.trim().length > 0 || files.length > 0;

  // modal confirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const requestClose = () => (isDirty ? setConfirmOpen(true) : onClose());
  const cancelClose  = () => setConfirmOpen(false);
  const confirmDiscard = () => {
    setConfirmOpen(false);
    setContent("");
    setFiles([]);
    onClose();
  };

  const handleEmojiClick = (emoji: any) =>
    setContent((prev) => prev + emoji.emoji);

  // chỉ báo lỗi 1 lần nếu thiếu user_id
  useEffect(() => {
    if (open && !currentUserId) toast.error("Không tìm thấy user_id, vui lòng đăng nhập lại.");
  }, [open, currentUserId]);

  // load user info khi có user_id
  useEffect(() => {
    if (currentUserId) getUserById(currentUserId, dispatch);
  }, [currentUserId, dispatch]);

  // phản hồi tạo bài
  // useEffect(() => {
  //   if (createOk) {
  //     toast.success("Đăng bài thành công!");
  //     setContent("");
  //     setFiles([]);
  //     onClose();
  //   } else if (createFail) {
  //     toast.error("Đăng bài thất bại!");
  //   }
  // }, [createOk, createFail, onClose]);
 
  // click outside/Escape
  useClickOutside([menuRef], requestClose, {
    enabled: open && !confirmOpen,
    onEscape: requestClose,
  });

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId) return;
    if (!content.trim() && files.length === 0) {
      toast.error("Vui lòng nhập nội dung hoặc chọn media");
      return;
    }
    createPost(
      { user_id: currentUserId, text: content, file: files[0] },
      dispatch,navigate
    );
    navigate('/loadingpost')
  }

  return (
   
     
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-[100]"
          onMouseDown={(e) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) requestClose();
          }}
        >
          <div
            ref={menuRef}
            className="bg-white dark:bg-[#181818] border-2 border-[#383939] rounded-lg w-[700px] shadow-lg relative"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex justify-between items-center border-b-2 border-[#383939] p-3">
              <button className="text-white cursor-pointer" onClick={requestClose}>
                Đóng
              </button>
              <h2 className="text-lg font-bold">Đăng bài mới</h2>
              <div />
            </div>

            {/* user row */}
            <div className="flex items-center p-4 border-b-2 border-[#383939]">
              <img
                src={userData.avatar || "https://i.pravatar.cc/150?img=1"}
                className="object-cover rounded-full w-10 h-10 mr-3"
              />
              <span className="text-gray-700 dark:text-white font-bold">
                {(userData.last_name || "") + " " + (userData.first_name || "")}
              </span>
            </div>

            {/* preview */}
             {files.length > 0 && (
          <div className="p-4 flex gap-4 flex-wrap">
            {files.map((file, idx) =>
              file.type.startsWith("image/") ? (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`Selected ${idx}`}
                  className="w-[150px] h-auto rounded-lg mb-4 cursor-pointer"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setFiles((files) => files.filter((_, i) => i !== idx));
                  }}
                  title="Nhấn chuột phải để xóa ảnh"
                />
              ) : file.type.startsWith("video/") ? (
                <video
                  key={idx}
                  src={URL.createObjectURL(file)}
                  controls
                  className="w-[150px] h-auto rounded-lg mb-4 cursor-pointer"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setFiles((files) => files.filter((_, i) => i !== idx));
                  }}
                  title="Nhấn chuột phải để xóa video"
                />
              //   <img key={idx} src={URL.createObjectURL(file)} className="w-[150px] rounded-lg" />
              // ) : file.type.startsWith("video/") ? (
              //   <video key={idx} src={URL.createObjectURL(file)} controls className="w-[150px] rounded-lg" />
              ) : null
            )}
          </div>
        )}

            {/* form */}
            <form onSubmit={handleSubmit}>
              <div className="flex">
                <label htmlFor="file-upload" className="flex items-center gap-2 w-[30px] m-2 cursor-pointer">
                  <FaImages size={30} />
                </label>
                <input
                  title="add image or video"
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={async (e) => {
                    const fileList = e.target.files;
                    if (!fileList || !fileList.length) return;
                    const arr = Array.from(fileList);

                    // ví dụ giới hạn video ≤ 30s
                    const valid: File[] = [];
                    for (const f of arr) {
                      if (f.type.startsWith("video/")) {
                        const url = URL.createObjectURL(f);
                        const v = document.createElement("video");
                        v.src = url;
                        await new Promise<void>((r) => {
                          v.onloadedmetadata = () => {
                            if (v.duration <= 20) valid.push(f);
                            else toast.error("Video tối đa 20 giây!");
                            URL.revokeObjectURL(url);
                            r();
                          };
                        });
                      } else valid.push(f);
                    }
                    setFiles(valid); // nếu chỉ nhận 1 file thì setFiles(valid.slice(0,1))
                  }}
                />

                <button
                  type="button"
                  className="text-xl dark:text-[#4d4d4d] cursor-pointer"
                  onClick={() => setShowPicker((v) => !v)}
                  title="Chọn emoji"
                >
                  <FaRegSmile size={28} />
                </button>
              </div>

              <textarea
                className="w-full h-24 p-2 rounded resize-none mb-4 focus:outline-none text-gray-700 dark:text-white"
                placeholder="Bạn đang nghĩ gì?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {showPicker && <EmojiPopup onEmojiClick={handleEmojiClick} />}

              <button
                type="submit"
                className="bg-black mb-4 ml-4 text-white px-4 py-2 border-2 border-[#383939] rounded-[15px] hover:bg-black/80 transition-colors"
              >
                Đăng bài
              </button>
            </form>
          </div>

          {/* Confirm hủy */}
          {confirmOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-[110] flex items-center justify-center"
              onMouseDown={(e) => {
                const box = (e.currentTarget.querySelector("#confirm-box") as HTMLDivElement) || null;
                if (box && !box.contains(e.target as Node)) cancelClose();
              }}
            >
              <div
                id="confirm-box"
                className="w-[360px] bg-white dark:bg-[#222] text-gray-900 dark:text-white rounded-xl shadow-2xl p-5"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-2">Hủy bài viết?</h3>
                <p className="text-sm mb-4">
                  Bạn đang có nội dung/ảnh/video chưa đăng. Bạn có chắc chắn muốn hủy không?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#333]"
                    onClick={cancelClose}
                  >
                    Ở lại
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    onClick={confirmDiscard}
                  >
                    Hủy bài
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    

  );
}
