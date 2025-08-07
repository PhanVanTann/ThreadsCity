import { useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { usertest,mockComments } from '../datatest';
import { formatTimeAgo } from '../utils/formatIimeAgo'; // Adjust the import path as necessary
import Heart from "./heart";
interface CommentProps {
  comment: {
    _id: string;
    post_id: string;
    user_id: string;
    parent_id?: string | null;
    text: string;
    created_at: string;
    interact: number;
  };
  onReply?: (text: string, parentId: string) => void;
}
// type User = {
//    id: string,
//     role: string,
//     first_name: string,
//     last_name: string,
//     Email:  string,
//     avatar_image:  string,
//     is_google_account: boolean,
//     number:  string,
//     created_at: string,
//     follow: number,
//     is_verify: boolean
// };
export default function Comment({ comment, onReply }: CommentProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [getNameRep, setGetNameRep] = useState("");
  
  const handleReplySubmit = () => {
    if (replyText.trim() && onReply) {
      onReply(replyText, comment._id);
      setReplyText("");
      setShowReply(false);
    }
  };
        const handleGetNameRep = (name: string) => {
        setGetNameRep(name);
        setShowReply(true); // mở khung reply
        };
    const user = usertest.find((u) => u.id === comment.user_id);

  return (
    <div className="w-full p-2 ">
     {/* Header */}
          <div className="flex w-full justify-start items-center">
            <img
              src={user?.avatar_image}
              alt="avatar"
              className="object-cover rounded-full w-[40px] h-[40px] mr-2"
            />
            <div className=" flex items-center">
              <span className="text-white font-bold mr-2">
                {user?.first_name} {user?.last_name}
              </span>
              <span className=" text-sm text-gray-300 mr-2">
                    {formatTimeAgo(comment.created_at)}
              </span>
           
               
            </div>
            <div className="p-2 text-white cursor-pointer">
              <AiOutlineMore size={20} />
            </div>
          </div>
      <p className="text-sm text-white">{comment.text}</p>
      <div className="text-sm text-white mt-1 flex gap-2">
        <Heart postId={comment.post_id} size="text-xs" userId={comment.user_id}/>
       
      
          <button
                className=" text-xs"
                onClick={() => setShowReply(!showReply)}
            >
                Trả lời
            </button>
             { comment.interact > 0 &&(
                 <span  onClick={() => handleGetNameRep( user?.first_name ,user?.last_name)}>{comment.interact} phản hồi</span>
        )}
      </div>
    

      {showReply && (
        <div className="mt-2 flex flex-col">
          <textarea
            className="w-full  p-2  rounded resize-none mb-4 focus:outline-none focus:ring-0 focus:border-[#353535]   text-gray-700 dark:text-white"         
            placeholder={getNameRep ? `Trả lời @${getNameRep}` : "Nhập phản hồi..."}
            value={ replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            className="text-white bg-blue-500 rounded mt-1 px-2 py-1 text-xs w-fit"
            onClick={handleReplySubmit}
          >
            Gửi phản hồi
          </button>
        </div>
      )}
    </div>
  );
}
