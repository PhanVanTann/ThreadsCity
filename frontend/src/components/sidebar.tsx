'use client';
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { FaThreads, FaPlus, FaRegHeart } from "react-icons/fa6";
import { RiHome4Line, RiSearch2Line, RiMenu4Fill } from "react-icons/ri";
import Logout from "../auth/logout";
import { BsPerson } from "react-icons/bs";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Post from "./postmodel";
import { FaRegSnowflake } from "react-icons/fa";
import { getListNotification } from "src/redux/api/apiRequestNotification";

type Noti = {
  id?: string | number;
  _id?: string;
  is_read?: boolean | 0 | "0" | "false" | null | undefined;
  created_at?: string;
  createdAt?: string;
};

export default function Sidebar() {
  const [openPost, setOpenPost] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchedRef = useRef(false);

  const dispatch = useDispatch();
  const { data = [], isFetching } = useSelector(
    (s: any) => s.notification.getListNotification || { data: [], isFetching: false }
  ) as { data: Noti[]; isFetching: boolean };

  const userId = useSelector((state: any) => state.auth.login.currentUser?.user_id);

  // --- Fetch thông báo khi Sidebar mount (một lần) ---
  useEffect(() => {
    if (!userId) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getListNotification(userId, dispatch);
  }, [userId, dispatch]);

  // --- Khi rời trang /notifications → re-fetch để cập nhật is_read trong store ---
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    const prev = prevPathRef.current;
    const now = location.pathname;
    const wasOnNoti = prev.startsWith("/notifications");
    const isOnNoti = now.startsWith("/notifications");

    if (wasOnNoti && !isOnNoti && userId) {
      // vừa rời trang thông báo → tải lại danh sách để badge phản ánh đúng
      getListNotification(userId, dispatch);
    }
    prevPathRef.current = now;
  }, [location.pathname, userId, dispatch]);

  // Chuẩn hoá unread
  const isUnread = useCallback((n: Noti) => {
    const v = n?.is_read;
    if (v === false) return true;
    if (v === 0) return true;
    if (v === "0") return true;
    if (v === "false") return true;
    if (v === null || typeof v === "undefined") return true;
    return false;
  }, []);

  // Danh sách ID chưa đọc
  const unreadIds = useMemo(() => {
    if (!Array.isArray(data)) return [] as string[];
    return data
      .filter(isUnread)
      .map((n) => String(n.id ?? n._id ?? ""))
      .filter(Boolean);
  }, [data, isUnread]);

  // Ẩn badge khi đang ở /notifications; còn lại hiển thị nếu còn unread
  const onNotiPage = location.pathname.startsWith("/notifications");
  const showBadge = !onNotiPage && unreadIds.length > 0;

  



  // Click notifications: nếu đang ở đúng route thì reload route hiện tại
  const handleNotificationsClick = useCallback(
    (e: React.MouseEvent) => {
      const path = "/notifications";
      if (window.location.pathname === path) {
        e.preventDefault();
        navigate(0);
      }
    },
    [navigate]
  );

  return (
    <div className="fixed z-50">
      <div className="flex flex-col items-center justify-between h-screen w-[80px] bg-black text-white p-5">
        <div>
          <NavLink
            to="/"
            end
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                navigate(0);
              }
            }}
          >
            <div className="px-3 py-2 rounded-lg hover:text-white transition-colors">
              <FaRegSnowflake className="transition duration-200 hover:scale-125" size={40} />
            </div>
          </NavLink>
        </div>

        <nav className="p-2">
          {/* home */}
          <NavLink
            to="/"
            end
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                navigate(0);
              }
            }}
            className={({ isActive, isPending, isTransitioning }) =>
              [isPending ? "pending" : "", isActive ? "active" : "noactive", isTransitioning ? "transitioning" : ""].join(" ")
            }
          >
            <div className="px-3 py-2 mt-4 rounded-lg hover:bg-[#1d1d1d] hover:text-white transition-colors">
              <RiHome4Line size={30} />
            </div>
          </NavLink>

          {/* search */}
          <NavLink
            to="/search"
            end
            onClick={(e) => {
              if (window.location.pathname === "/search") {
                e.preventDefault();
                navigate(0);
              }
            }}
            className={({ isActive, isPending, isTransitioning }) =>
              [isPending ? "pending" : "", isActive ? "active" : "noactive", isTransitioning ? "transitioning" : ""].join(" ")
            }
          >
            <div className="px-3 py-2 mt-4 rounded-lg hover:bg-[#1d1d1d] hover:text-white transition-colors">
              <RiSearch2Line size={30} />
            </div>
          </NavLink>

          {/* create post */}
          <div
            className="bg-[#1d1d1d] px-3 py-2 rounded-lg text-[#4d4d4d] mt-4 hover:text-white transition-colors"
            onClick={() => setOpenPost(true)}
          >
            <FaPlus size={30} />
          </div>

          {/* notification */}
          <NavLink
            to="/notifications"
            end
            onClick={handleNotificationsClick}
            className={({ isActive, isPending, isTransitioning }) =>
              [isPending ? "pending" : "", isActive ? "active" : "noactive", isTransitioning ? "transitioning" : ""].join(" ")
            }
          >
            <div className="px-3 py-2 mt-4 rounded-lg hover:bg-[#1d1d1d] hover:text-white transition-colors relative">
              <FaRegHeart size={30} />
              {showBadge && (
                <div className="w-[8px] h-[8px] rounded-full top-2 right-3 bg-[#ff0000] absolute z-20" />
              )}
            </div>
          </NavLink>

          {/* profile */}
          <NavLink
            to={`/profile/${userId}`}
            end
            onClick={(e) => {
              if (window.location.pathname === `/profile/${userId}`) {
                e.preventDefault();
                navigate(0);
              }
            }}
            className={({ isActive, isPending, isTransitioning }) =>
              [isPending ? "pending" : "", isActive ? "active" : "noactive", isTransitioning ? "transitioning" : ""].join(" ")
            }
          >
            <div className="px-3 py-2 mt-4 rounded-lg hover:bg-[#1d1d1d] hover:text-white transition-colors">
              <BsPerson size={30} />
            </div>
          </NavLink>
        </nav>

        
    

        {/* nút mở menu */}
        <div
       
         
          className="text-[#4d4d4d] px-3 py-2 mt-4 rounded-lg hover:bg-[#1d1d1d] hover:text-white transition-colors"
        >
           <Logout />
        </div>
      </div>

      <Post open={openPost} onClose={() => setOpenPost(false)} />
    </div>
  );
}
