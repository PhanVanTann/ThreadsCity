'use client';
import { useRef, useState ,useEffect} from "react";
import { createPost } from "src/redux/api/apiRequestPost";
import { useDispatch,useSelector} from "react-redux";
import { getUserById } from "src/redux/api/apiRequestUser";
import LoadingPost from "src/pages/loadingPost/LoadingPost";
import { FaImages } from "react-icons/fa6";
import { FaRegSmile } from "react-icons/fa";
import EmojiPopup from "./emojipick";
import toast from "react-hot-toast";
import { useClickOutside } from "src/hook/useClickOutside";

type Props = { open: boolean; onClose: () => void };

export default function Postmodel({ open, onClose }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [content, setContent] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);

  // --- xác định "form bẩn" ---
  const isDirty = content.trim().length > 0 || files.length > 0;

  // --- confirm modal ---
  const [confirmOpen, setConfirmOpen] = useState(false);
  const requestClose = () => {
    // nếu có dữ liệu -> hỏi xác nhận; ngược lại đóng luôn
    if (isDirty) setConfirmOpen(true);
    else onClose();
  };
  const cancelClose = () => setConfirmOpen(false); // Ở lại
  const confirmDiscard = () => {
    // Hủy bài: clear & đóng
    setConfirmOpen(false);
    setContent("");
    setFiles([]);
    onClose();
  };

  // Click outside/Escape => yêu cầu đóng (có thể bật confirm)
  useClickOutside([menuRef], () => requestClose(), {
    enabled: open && !confirmOpen,   // khi đang mở confirm thì KHÔNG bắt outside ở modal gốc
    onEscape: () => requestClose(),
  });

  if (!open) return null;



export default function Postmodel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [content, setContent] = useState("");
  const dispatch = useDispatch()
  const userData = useSelector((state:any)=>state.user.getUserById?.data?.data)
  const currentUserId = useSelector((state: any) => state.auth.login.currentUser?.user_id) as string | undefined;
  const isLoading   = useSelector((s:any)=> s.post.createPost?.isFetching);
  const createOk    = useSelector((s:any)=> s.post.createPost?.success);
  const createFail  = useSelector((s:any)=> s.post.createPost?.error);
 if (!currentUserId) {
        toast.error("Không tìm thấy user_id, vui lòng đăng nhập lại.");
        return;
      }

  const handleEmojiClick = (emoji: any) => setContent((prev) => prev + emoji.emoji);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() && files.length === 0) {
      toast.error("Vui lòng nhập nội dung hoặc chọn media");
      return;
    }
    // TODO: gửi fd
    const fd = new FormData();
    fd.append("content", content);
    files.forEach((f) => fd.append("files", f));
    console.log("FD files[]:", fd.getAll("files"));
    // ... gọi API ở đây
  }

  // return (
  //   <div
  //     className="fixed inset-0 bg-black/30 flex items-center justify-center z-[100]"
  //     onMouseDown={(e) => {
  //       // click nền -> yêu cầu đóng
  //       if (menuRef.current && !menuRef.current.contains(e.target as Node)) requestClose();
  //     }}
  //   >
  //     <div
  //       ref={menuRef}
  //       className="bg-white dark:bg-[#181818] border-2 border-[#383939] rounded-lg w-[700px] shadow-lg relative"
  //       onMouseDown={(e) => e.stopPropagation()} // chặn nổi bọt
  //     >
  //       <div className="flex justify-between items-center border-b-2 border-[#383939] p-3">
  //         <button className="text-white cursor-pointer" onClick={requestClose}>
  //           Đóng
  //         </button>
  //     if (!currentUserId) {
  //       toast.error("Không tìm thấy user_id, vui lòng đăng nhập lại.");
  //       return;
  //     }
  //     await createPost({"user_id":currentUserId,"text":content,"file":files[0]},dispatch)
  // }
   useEffect(()=>{
    if (createOk) {
      toast.success("Đăng bài thành công!");
      setContent("");
      setFiles([]);
      onClose();
    } else if (createFail) {
      toast.error("Đăng bài thất bại!");
    }
  }, [createOk, createFail, onClose]);
useEffect(()=>{
    getUserById(currentUserId,dispatch)
  },[])
  if (!open) return null;
 

  return (
    <>
      {isLoading?(<LoadingPost loading={isLoading}></LoadingPost>):(
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-100"
         onMouseDown={(e) => {
        // click nền -> yêu cầu đóng
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) requestClose();
      }}>
      <div className="bg-white dark:bg-[#181818] border-2 border-[#383939] rounded-lg w-[700px] shadow-lg relative">
        {/* header */}
        <div className="flex justify-between items-center border-b-2 border-[#383939] p-3">
          <button className="text-white cursor-pointer" onClick={onClose}>Đóng</button>
          <h2 className="text-lg font-bold">Đăng bài mới</h2>
          <div />
        </div>

        {/* user row */}
        <div className="flex items-center p-4 border-b-2 border-[#383939]">
          <img src={userData.avatar||"https://i.pravatar.cc/150?img=1"} className="object-cover rounded-full w-10 h-10 mr-3" />
          <span className="text-gray-700 dark:text-white font-bold">{`${userData.last_name} ${userData.first_name} `}</span>
        </div>

        {/* preview */}
        {files.length > 0 && (
          <div className="p-4 flex gap-4 flex-wrap">
            {files.map((file, idx) =>
              file.type.startsWith("image/") ? (
              //   <img
              //     key={idx}
              //     src={URL.createObjectURL(file)}
              //     alt={`Selected ${idx}`}
              //     className="w-[150px] h-auto rounded-lg mb-4 cursor-pointer"
              //     onContextMenu={(e) => {
              //       e.preventDefault();
              //       setFiles((files) => files.filter((_, i) => i !== idx));
              //     }}
              //     title="Nhấn chuột phải để xóa ảnh"
              //   />
              // ) : file.type.startsWith("video/") ? (
              //   <video
              //     key={idx}
              //     src={URL.createObjectURL(file)}
              //     controls
              //     className="w-[150px] h-auto rounded-lg mb-4 cursor-pointer"
              //     onContextMenu={(e) => {
              //       e.preventDefault();
              //       setFiles((files) => files.filter((_, i) => i !== idx));
              //     }}
              //     title="Nhấn chuột phải để xóa video"
              //   />
                <img key={idx} src={URL.createObjectURL(file)} className="w-[150px] rounded-lg" />
              ) : file.type.startsWith("video/") ? (
                <video key={idx} src={URL.createObjectURL(file)} controls className="w-[150px] rounded-lg" />
              ) : null
            )}
          </div>
        )}

        {/* // <form onSubmit={handleSubmit}>
        //   <div className="flex">
        //     <label
        //       htmlFor="file-upload"
        //       className="flex dark:text-[#4d4d4d] items-center gap-2 cursor-pointer w-[30px] m-2 rounded select-none focus:outline-none bg-[#f5f5f5] dark:bg-[#222]"
        //     > */}
        {/* form */}
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <label htmlFor="file-upload" className="flex items-center gap-2 w-[30px] m-2 cursor-pointer">
              <FaImages size={30} />
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              // multiple
              // accept="image/*,video/*"
              // title="Chọn ảnh hoặc video"
              // onChange={async (e) => {
              //   const fileList = e.target.files;
              //   if (!fileList || fileList.length === 0) return;
              //   const filesArr = Array.from(fileList);
              //   const valid: File[] = [];
              //   for (const file of filesArr) {
              //     if (file.type.startsWith("video/")) {
              //       const url = URL.createObjectURL(file);
              //       const video = document.createElement("video");
              //       video.src = url;
              //       await new Promise<void>((resolve) => {
              //         video.onloadedmetadata = () => {
              //           if (video.duration <= 10) {
              //             valid.push(file);
              //           } else {
              //             toast.error("Video chỉ được tối đa 30s!");
              //           }
              //           URL.revokeObjectURL(url);
              //           resolve();
              //         };
              //       });
              //     } else valid.push(file);
              //   }
              //   setFiles((prev) => [...prev, ...valid]);
              accept="image/*,video/*"
              onChange={async (e) => {
                const fileList = e.target.files;
                if (!fileList || !fileList.length) return;
                const arr = Array.from(fileList);

                // ví dụ: giới hạn video ≤ 30s
                const valid: File[] = [];
                for (const f of arr) {
                  if (f.type.startsWith("video/")) {
                    const url = URL.createObjectURL(f);
                    const v = document.createElement("video");
                    v.src = url;
                    await new Promise<void>((r) => {
                      v.onloadedmetadata = () => {
                        if (v.duration <= 30) valid.push(f);
                        else toast.error("Video tối đa 30 giây!");
                        URL.revokeObjectURL(url);
                        r();
                      };
                    });
                  } else {
                    valid.push(f);
                  }
                }
                setFiles(valid); // chỉ lấy file đầu tiên nếu BE chỉ nhận 1 file: setFiles(valid.slice(0,1))
              }}
            />

            <button
              type="button"
              className="text-xl dark:text-[#4d4d4d] cursor-pointer"
              onClick={() => setShowPicker((v) => !v)}
              // tabIndex={-1}
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

          {/* // {showPicker && <EmojiPopup onEmojiClick={(emoji: any) => setContent((prev) => prev + emoji.emoji)} />}

          // <button
          //   type="submit"
          //   className="bg-black mb-4 ml-4 text-white px-4 py-2 border-2 border-[#383939] rounded-[15px] hover:bg-black/80 transition-colors"
          // > */}
          {showPicker && <EmojiPopup onEmojiClick={handleEmojiClick} />}

          <button type="submit" className="bg-black mb-4 ml-4 text-white px-4 py-2 border-2 border-[#383939] rounded-[15px]">
            Đăng bài
          </button>
        </form>
      </div>

      {/* ==== Modal xác nhận hủy ==== */}
      {confirmOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[110] flex items-center justify-center"
          onMouseDown={(e) => {
            // click ngoài hộp confirm -> chỉ đóng confirm (ở lại soạn)
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
      )}
    </>
    
  );
}
}
