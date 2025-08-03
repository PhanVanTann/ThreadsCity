import { useState } from "react";
import { FaImages } from "react-icons/fa6";
import { FaRegSmile } from "react-icons/fa";
import EmojiPicker from "../../app/components/emojipick";

import toast from "react-hot-toast";
export default function Post({ open, onClose }: { open: boolean; onClose: () => void }) {
      const [files, setFiles] = useState<File[]>([]);
      const [showPicker, setShowPicker] = useState(false);
      const [content, setContent] = useState("");
        
      
      const handleEmojiClick = (emoji: any) => {
            setContent((prev) => prev + emoji.emoji);
        };
    
    
    
    if (!open) return null;


    return (
   <div className="fixed inset-0 bg-black/30 bg-blend-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#181818] border-2 border-[#383939] rounded-lg w-[700px] shadow-lg relative">
        <div className="flex justify-between items-center border-b-2  border-[#383939] p-3">
            <button
                    className=" text-white cursor-pointer"
                    onClick={onClose}
                    >
                    Đóng
            </button>
            <h2 className="text-lg font-bold ">Đăng bài mới</h2>
            <div></div>
        </div>
          <div className="flex items-center p-4 border-b-2 border-[#383939]">
                <img
                src="../../public/z4278794679219_881d17bfbc15d3071b7720cfd3f0283c.jpg" // Replace with actual avatar path
                alt="avatar"
                className="object-cover rounded-[50%] w-[40px] h-[40px]  mr-3"
                />
                <span className="text-gray-700 dark:text-white font-bold">Username</span>
                
            </div>
        {files.length > 0 && (
            <div className="p-4 flex gap-4 flex-wrap">
                {files.map((file, idx) =>
                file.type.startsWith("image/") ? (
                    <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${idx}`}
                    className="w-[150px] h-auto rounded-lg mb-4 cursor-pointer"
                    onContextMenu={e => {
                        e.preventDefault();
                        setFiles(files => files.filter((_, i) => i !== idx));
                    }}
                    title="Nhấn chuột phải để xóa ảnh"
                    />
                ) : file.type.startsWith("video/") ? (
                    <video
                    key={idx}
                    src={URL.createObjectURL(file)}
                    controls
                    className="w-[150px] h-auto rounded-lg mb-4 cursor-pointer"
                    onContextMenu={e => {
                        e.preventDefault();
                        setFiles(files => files.filter((_, i) => i !== idx));
                    }}
                    title="Nhấn chuột phải để xóa video"
                    />
                ) : null
                )}
            </div>
            )}
        <form>
            <div className="flex">   
                     <label
                    htmlFor="file-upload"
                    className="flex  dark:text-[#4d4d4d] cursor-pointer items-center gap-2 cursor-pointer w-[30px] m-2  rounded select-none focus:outline-none focus:ring-0 focus:border-[#353535] bg-[#f5f5f5] dark:bg-[#222]"
                        >
                        <FaImages size={30} />
                    
                </label>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            multiple
                              title="Chọn ảnh hoặc video"
                            onChange={async (e) => {
                                const fileList = e.target.files;
                                if (fileList && fileList.length > 0) {
                                    const filesArr = Array.from(fileList);
                                    const validFiles: File[] = [];
                                    for (const file of filesArr) {
                                    if (file.type.startsWith("video/")) {
                                        const url = URL.createObjectURL(file);
                                        const video = document.createElement("video");
                                        video.src = url;
                                        await new Promise<void>((resolve) => {
                                        video.onloadedmetadata = () => {
                                            if (video.duration <= 10) { // Giới hạn 30 giây
                                            validFiles.push(file);
                                            } else {
                                            toast.error("video chỉ được tối đa 30s!");
                                            }
                                            URL.revokeObjectURL(url);
                                            resolve();
                                        };
                                        });
                                    } else {
                                        validFiles.push(file);
                                    }
                                    }
                                    setFiles(prev => [...prev, ...validFiles]);
                                }
                            }}
                        />
            <button
                    type="button"
                    className=" text-xl dark:text-[#4d4d4d] cursor-pointer"
                    onClick={() => setShowPicker(v => !v)}
                    tabIndex={-1}
                    title="Chọn emoji"
                    >
                    <FaRegSmile size={28}/>
            </button>
            </div>
               
          <textarea
            className="w-full h-24 p-2  rounded resize-none mb-4 focus:outline-none focus:ring-0 focus:border-[#353535]   text-gray-700 dark:text-white"
            placeholder="Bạn đang nghĩ gì?"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
           {/* {showPicker && (
            
            <div className="absolute right-[-400px] bottom-0 z-10">
                <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme="dark"
                width={500}
                height={450}
                />

            </div>
            
            )} */}
            {showPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
          <button
            type="submit"
            className="bg-black mb-4 ml-4 text-white px-4 py-2 border-2 border-[#383939] rounded-[15px] hover:bg-black/80 transition-colors"
          >
            Đăng bài
          </button>
        </form>
      </div>
    </div>
  );
}
