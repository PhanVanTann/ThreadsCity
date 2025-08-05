import { RiSearch2Line } from "react-icons/ri";


export default function Search() {
 
  const usertest =[
  {
    "id": "64e3d54e8b7c5e3f20a1b001",
    "role": "user",
    "first_name": "Linh",
    "last_name": "Nguyễn",
    "Email": "linh.nguyen@example.com",
    "avatar_image": "https://i.pravatar.cc/150?img=3",
    "is_google_account": false,
    "number": "0987654321",
    "created_at": "2025-08-01T10:15:00Z",
    "follow": 12,
    "is_verify": true
  },
  {
    "id": "64e3d54e8b7c5e3f20a1b002",
    "role": "admin",
    "first_name": "Tuấn",
    "last_name": "Phạm",
    "Email": "tuan.pham@example.com",
    "avatar_image": "https://i.pravatar.cc/150?img=5",
    "is_google_account": true,
    "number": "0912345678",
    "created_at": "2025-07-15T14:00:00Z",
    "follow": 105,
    "is_verify": true
  },
  {
    "id": "64e3d54e8b7c5e3f20a1b003",
    "role": "user",
    "first_name": "Minh",
    "last_name": "Lê",
    "Email": "minh.le@example.com",
    "avatar_image": "https://i.pravatar.cc/150?img=8",
    "is_google_account": false,
    "number": "0934567890",
    "created_at": "2025-08-03T09:30:00Z",
    "follow": 34,
    "is_verify": false
  }
]

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
