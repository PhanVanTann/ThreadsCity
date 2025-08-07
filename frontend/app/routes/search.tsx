import { RiSearch2Line } from "react-icons/ri";
import {usertest } from '../datatest'; // Adjust the import path as necessary

export default function Search() {
 
  

  return (
    <div className="w-[600px] mt-5 flex flex-col border border-[#3d3d3d] rounded-[20px] h-screen bg-gray-100 dark:bg-[#181818] gap-5">
     
        <form className=" w-full h-[60px] p-5">
             <div className="relative w-full">
                  <RiSearch2Line
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full pl-10 pr-3 py-2 border border-[#3d3d3d] rounded-[20px] bg-transparent text-white placeholder-gray-400"
                  />
                </div>
            
        </form>
        <span className="ml-5">Gợi ý theo dõi</span>
        {usertest.map((user) => (
          <div key={user.id} className="flex items-center p-5 border-b border-[#3d3d3d]">
            <img
              src={user.avatar_image}
              alt="avatar"
              className="object-cover rounded-full w-[40px] h-[40px] mr-2"
            />
            <div className="w-[430px]">
              <span className="text-white font-bold">{user.first_name} {user.last_name}</span>
              <p className="text-gray-400 text-sm">Đề xuất cho bạn</p>
              <p className="text-gray-500 text-sm"> {user.follow} người theo dõi</p>
            </div>
            <div className="border  border-[#3d3d3d] rounded-full px-4 py-1 text-sm text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-[#3d3d3d] transition-colors">
              <button>kết bạn</button>
            </div>
          </div>
        ))}

      
    </div>
  );
}
