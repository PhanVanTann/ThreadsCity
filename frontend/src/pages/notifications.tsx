import { useState,useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FaRegCommentDots, FaUserPlus, FaEnvelope ,FaHeart} from "react-icons/fa";
import { getListNotification,markAsReadNotification } from "src/redux/api/apiRequestNotification";
import { FaRegCommentAlt } from "react-icons/fa";




const mockData: Notification[] = [];

export default function Notifications() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isFetching } = useSelector((s:any)=> s.notification.getListNotification);
  const currentUser = useSelector((s: any) => s.auth.login.currentUser?.user_id);
   useEffect(() => {
    getListNotification(currentUser,dispatch);
  }, [dispatch]);
  const getIcon = (type: "comment" | "like" | "follow" | "message") => {
    switch (type) {
      case "comment": return <FaRegCommentDots className="text-blue-500" />;
      case "message": return <FaRegCommentAlt className="text-green-500" />;
      case "follow":  return <FaUserPlus className="text-pink-500" />;
      case "like": return <FaHeart className="text-red-500" />;
      default: return null;
    }
  };


  const handleClick = (n:any) => {
    console.log(n,"notification");
    if(!n.is_read){
      markAsReadNotification({notification_id: n.id,user_id: currentUser},dispatch);

    }
    if (n.type === "follow") {
      navigate(`/profile/${n.actor.actor_id}`);
    }
    else if (n.type === "post" || n.type === "comment" || n.type === "like") {
      navigate(`/postcomment/${n.resource_id}`);
    }

  };

  return (
    <div className="w-[700px] mt-5 flex flex-col border border-[#3d3d3d] rounded-[20px] h-screen bg-gray-100 dark:bg-[#181818]">
      <div className="p-4 text-lg font-semibold border-b border-[#3d3d3d]">
        Thông báo
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll">
        {data.map((n:any) => (
          <div
            key={n.id}
            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#2b2b2b] transition-colors ${
              !n.is_read ? "bg-blue-50 dark:bg-[#1f2a37]" : ""
            }`}
            onClick={() => handleClick(n)}
          >
            <img
              src={n.actor.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {getIcon(n.type)}
                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                  <strong>{n.actor.name}</strong> {n.message}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(n.created_at).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {!n.is_read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        ))}
        {data.length === 0 && (
          <div className="p-4 text-sm text-gray-500 text-center">
            Chưa có thông báo
          </div>
        )}
      </div>
    </div>
  );
}
