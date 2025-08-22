'use client';
import { useEffect, useState } from "react";
import { FaImages } from "react-icons/fa6";
import { FaRegSmile } from "react-icons/fa";
import EmojiPopup from "./emojipick";
import toast from "react-hot-toast";
import { createPost } from "src/redux/api/apiRequestPost";
import { useDispatch,useSelector} from "react-redux";
import { getUserById } from "src/redux/api/apiRequestUser";


export default function Postmodel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [content, setContent] = useState("");
  const dispatch = useDispatch()
  
  const userData = useSelector((state:any)=>state.user.getUserById?.data?.data)
const currentUserId = useSelector((state: any) => state.auth.login.currentUser?.user_id) as string | undefined;
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
      if (!currentUserId) {
        toast.error("Không tìm thấy user_id, vui lòng đăng nhập lại.");
        return;
      }
    try {

      createPost({"user_id":currentUserId,"text":content,"file":files[0]},dispatch)

      toast.success("Đăng bài thành công!");
      setContent("");
      setFiles([]);
      onClose();
      
    } catch (err) {
      console.error(err);
      toast.error("Đăng bài thất bại!");
    }
  }
useEffect(()=>{
    getUserById(currentUserId,dispatch)
  },[])
  if (!open) return null;
 

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-100">
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
                <img key={idx} src={URL.createObjectURL(file)} className="w-[150px] rounded-lg" />
              ) : file.type.startsWith("video/") ? (
                <video key={idx} src={URL.createObjectURL(file)} controls className="w-[150px] rounded-lg" />
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
              id="file-upload"
              type="file"
              className="hidden"
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

          <button type="submit" className="bg-black mb-4 ml-4 text-white px-4 py-2 border-2 border-[#383939] rounded-[15px]">
            Đăng bài
          </button>
        </form>
      </div>
    </div>
  );
}