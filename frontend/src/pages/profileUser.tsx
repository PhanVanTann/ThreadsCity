import { useState } from 'react';
import Post from '../components/post';
import { mergeMediaToPosts } from '../components/postlist';
import { poststest,usertest } from '../datatest';
import { useNavigate } from 'react-router'; 


export default function ProfileUser() {
   const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
   const [isFriend, setIsFriend] = useState<boolean>(false);
   const [userId] = useState("12345");
  const navigate = useNavigate();

     const handleClick = (index: number) => {
    setSelectedIndex(index);
  };
  

  const handleFriendshipToggle = () => {
    setIsFriend((prev) => !prev); // Đảo ngược trạng thái kết bạn
  };
    const handleClickUser = (userId: string) => {
          navigate(`/profile/${userId}`);
      }
 
  const postsWithMedia = mergeMediaToPosts(poststest);
  console.log("postsWithMedia", postsWithMedia);
  return (
    <div className="w-[700px] mt-5 flex flex-col border border-[#3d3d3d] rounded-[20px] bg-gray-100 dark:bg-[#000] ">
        <div className="flex rounded-[20px] bg-black justify-between w-full items-start p-8">
               <img
                 src={ "https://i.pravatar.cc/150?img=1"} // Replace with actual avatar path
                 alt="avatar"
                 className="object-cover rounded-full w-[100px] h-[100px] "
               />
               <div className='w-[300px] flex flex-col items-start justify-center'>
                    <div className=" flex gap-5 ">
                      <span className="text-white text-xl font-bold ">
                        User name  
                      </span>
                      {/* {userId !== currentUserId && ( */}
                       <button
                            onClick={handleFriendshipToggle}
                              className={`px-2 py-1 rounded-lg ${
                                                isFriend ? 'bg-black border-3 text-white border-[#3d3d3d] hover:bg-[#1d1d1d]' : 'bg-white text-black hover:bg-white/90  '
                                              } `}                          >
                            {isFriend ? 'Hủy kết bạn' : 'Kết bạn'}
                    </button>
                     {/* )} */}
                    </div>
                    <div className='flex gap-5 text-gray-300 text-sm mt-2'>
                      <span     onClick={() => handleClick(1)} className='cursor-pointer'>21 người theo dõi</span>
                      <span onClick={() => handleClick(0)} className='cursor-pointer w-[90px]'>10 post</span>
                    </div>
                    
               </div>
              
                 <button className='border rounded-lg px-3 py-2'>chỉnh sửa</button>
             </div>
           <div className="flex sticky top-0 bg-black z-70">
                  <div
                    className={`w-1/2 cursor-pointer text-white flex items-center justify-center p-4 border-b ${
                      selectedIndex === 0 ? 'border-b-1 border-white' : 'border-[#3d3d3d]'
                    }`}
                    onClick={() => handleClick(0)}
                  >
                    Post
                  </div>
                  <div
                    className={`w-1/2 cursor-pointer text-white flex items-center justify-center p-4 border-b ${
                      selectedIndex === 1 ? 'border-b-1 border-white' : 'border-[#3d3d3d]'
                    }`}
                    onClick={() => handleClick(1)}
                  >
                    Bạn bè
                  </div>
                   
                </div>
                 {/* model */}
              <div className="">
                    {selectedIndex === 0 ? (
                      <div>
                        {postsWithMedia.map((post) => (
                                <Post key={post.id} post={post} />
                              ))}
                      </div>
                    ) : selectedIndex === 1 ? (
                      <div>
                         {usertest.map((user) => (
                                  <div key={user.id} onClick={()=>handleClickUser(user.id)} className="flex items-center p-5 border-b border-[#3d3d3d]">
                                    <img
                                      src={user.avatar_image}
                                      alt="avatar"
                                      className="object-cover rounded-full w-[40px] h-[40px] mr-2"
                                    />
                                    <div className="flex-grow">
                                      <span className="text-white font-bold">{user.first_name} {user.last_name}</span>
                                      <p className="text-gray-500 text-sm"> {user.follow} người theo dõi</p>
                                    </div>
                                    <div className="border  border-[#3d3d3d] rounded-full px-4 py-1 text-sm text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-[#3d3d3d] transition-colors">
                                      <button>nhắn tin</button>
                                    </div>
                                  </div>
                                ))}
                      </div>
                    ) : (
                      <div className="text-gray-300">Chọn một tab để xem nội dung</div>
                    )}
                  </div>
    </div>
  );
}
