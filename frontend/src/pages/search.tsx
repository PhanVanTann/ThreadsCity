import { RiSearch2Line } from "react-icons/ri";
import {usertest } from '../datatest'; 
import { useDispatch, useSelector } from "react-redux";
import { useEffect ,useState,useMemo} from 'react';
import { getListUser } from "src/redux/api/apiRequestUser";
import { isFriendUser } from "src/redux/api/apiRequestFriend";
import {useNavigate} from 'react-router-dom'
import SearchSkeleton from "src/components/SearchSkeleton";
function normalizeVN(s = "") {
  // Bỏ dấu, đưa về lower-case, chuẩn hóa khoảng trắng
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tổ hợp
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}
export default function Search() {
    const [q, setQ] = useState("");       // từ khóa người dùng gõ
    const [debouncedQ, setDebouncedQ] = useState("");
    const currentUserId = useSelector((state: any) => state.auth.login.currentUser?.user_id) as string | undefined;
    const listUserState = useSelector((state: any) => state.user.getListUser?.data);
   const [isLoading, setIsLoading] = useState(true);
    const listUser :any [] = Array.isArray(listUserState?.data)?listUserState?.data:[]
 
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(()=>{
      getListUser(currentUserId as string,dispatch)
      setTimeout(() => setIsLoading(false), 1500);
    },[currentUserId,dispatch])  
     const handleClickUser = (userId: string) => {
          navigate(`/profile/${userId}`);
      }
    
    useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 250);
    return () => clearTimeout(t);
  }, [q]);
  const displayUsers = useMemo(() => {
    if (!debouncedQ) return listUser.filter(u => u._id !== currentUserId);
    const key = normalizeVN(debouncedQ);

    return listUser.filter((u) => {
      if (u._id === currentUserId) return false;
      const full = `${u.first_name ?? ""} ${u.last_name ?? ""}`;
      const username = u.username ?? "";
      // so sánh không dấu, không phân biệt hoa/thường
      return (
        normalizeVN(full).includes(key) ||
        normalizeVN(username).includes(key)
      );
    });
  }, [debouncedQ, listUser, currentUserId]);
    const onSubmit = (e: React.FormEvent) => e.preventDefault();
    

  return (
   <>{isLoading?<SearchSkeleton />:
    <div className="w-[700px] mt-5 flex flex-col border border-[#3d3d3d] rounded-[20px] h-full bg-gray-100 dark:bg-[#181818] gap-5">
     
        <form className="w-full h-[60px] p-5" onSubmit={onSubmit}>
        <div className="relative w-full">
          <RiSearch2Line size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc username..."
            className="w-full pl-10 pr-3 py-2 border border-[#3d3d3d] rounded-[20px] bg-transparent text-white placeholder-gray-400"
          />
        </div>
      </form>
        <span className="ml-5">Gợi ý theo dõi</span>
        {displayUsers.map((user) => (
           currentUserId!==user._id&&(
            <div key={user._id}  onClick={()=>{handleClickUser(user._id)}} className="cursor-pointer flex items-center p-5 border-b border-[#3d3d3d]">
            <img
              src={user.avatar}
             
              alt="avatar"
              className="object-cover rounded-full w-[40px] h-[40px] mr-2 cursor-pointer"
              
            />
            <div className="w-[530px]">
              <span className="text-white font-bold">{user.last_name} {user.first_name}</span>
              <p className="text-gray-400 text-sm">Đề xuất cho bạn</p>
            </div>
            {user.is_friend === 'friend'&& (
              <div className="h-full w-[120px] border  border-[#3d3d3d] rounded-full px-4 py-1 text-sm text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-[#3d3d3d] transition-colors flex items-center justify-center">
              <button>Bạn bè</button>
              </div>
              )
              }
              {user.is_friend === 'nofollow'&&(
               <div className="bg-white/80 h-full w-[120px] border  border-[#3d3d3d] rounded-full px-4 py-1 text-sm text-black cursor-pointer hover:bg-gray-200 dark:hover:bg-[#3d3d3d] transition-colors flex items-center justify-center">
             
               <button className="cursor-pointer">Theo Dõi</button>
               </div>
               )}

              {user.is_friend === 'follower'&& 
              
              <div className="bg-white h-full w-[120px] border  border-[#3d3d3d] rounded-full px-4 py-1 text-sm text-black cursor-pointer hover:bg-gray-200 dark:hover:bg-[#3d3d3d] transition-colors flex items-center justify-center">
             
               <button className="cursor-pointer">Theo Dõi Lại</button>
               </div>
              }

              {user.is_friend === 'following'&&
               <div className="h-full w-[120px] border  border-[#3d3d3d] rounded-full px-4 py-1 text-sm text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-[#3d3d3d] transition-colors flex items-center justify-center">
             
               <button className="cursor-pointer" >Huỷ Theo Dõi</button>
               </div>
               }

            
          </div>
           )
         
        ))}

      
    </div>
}
    </>
  );

}
