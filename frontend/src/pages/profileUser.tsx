import { useState } from 'react';
import Post from '../components/post';
import { mergeMediaToPosts } from '../components/postlist';
import { poststest,usertest } from '../datatest';
import { useNavigate } from 'react-router'; 
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { getUserById } from 'src/redux/api/apiRequestUser';
import { getFollowsByUserId } from 'src/redux/api/apiRequestFriend';
import { useParams } from "react-router-dom";

export default function ProfileUser() {
   const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
   const [isFriend, setIsFriend] = useState<boolean>(false);
   const {userId} = useParams<{ userId: string }>()
   const currentUserId = useSelector((state: any) => state.auth.login.currentUser?.user_id) as string | undefined;
    const userData = useSelector((state:any)=>state.user.getUserById?.data?.data)
   
  const navigate = useNavigate();
  const dispatch = useDispatch()

  if (!userId){
      navigate(`/`)
   }
     const handleClick = (index: number) => {
    setSelectedIndex(index);
  };
  

  const handleFriendshipToggle = () => {
    setIsFriend((prev) => !prev); 
  };
    const handleClickUser = (userId: string) => {
          navigate(`/profile/${userId}`);
      }
 
  const postsWithMedia = mergeMediaToPosts(poststest);
  console.log("postsWithMedia", postsWithMedia);
  useEffect(()=>{
    if (userId){
      getUserById(userId,dispatch)
      getFollowsByUserId(userId,dispatch)
    }
  
  },[])
   const followersState = useSelector((s:any)=> s.friend.getFollowsByUserId?.data);
const followers: any[] = Array.isArray(followersState?.flowers)
  ? followersState.flowers
  : Array.isArray(followersState?.data)
  ? followersState.data
  : [];

console.log("followers", followers.length);
  return (
    <div className="w-[700px] mt-5 flex flex-col border border-[#3d3d3d] rounded-[20px] bg-gray-100 dark:bg-[#000] ">
        <div className="flex rounded-[20px] bg-black justify-between w-full items-start p-8">
               <img
                 src={userData?.avatar|| "https://i.pravatar.cc/150?img=1"} // Replace with actual avatar path
                 alt="avatar"
                 className="object-cover rounded-full w-[100px] h-[100px] "
               />
               <div className='w-[300px] flex flex-col items-start justify-center'>
                    <div className=" flex gap-5 ">
                      <span className="text-white text-xl font-bold ">
                        {`${userData?.last_name} ${userData?.first_name} `}
                      </span>
                      {userId !== currentUserId && (
                       <button
                            onClick={handleFriendshipToggle}
                              className={`px-2 py-1 rounded-lg ${
                                                isFriend ? 'bg-black border-3 text-white border-[#3d3d3d] hover:bg-[#1d1d1d]' : 'bg-white text-black hover:bg-white/90  '
                                              } `}                          >
                            {isFriend ? 'Hủy kết bạn' : 'Kết bạn'}
                    </button>
                     )} 
                    </div>
                    <div className='flex gap-5 text-gray-300 text-sm mt-2'>
                      <span     onClick={() => handleClick(1)} className='cursor-pointer'>{followers.length} Người Theo Dõi</span>
                      <span onClick={() => handleClick(0)} className='cursor-pointer w-[90px]'>10 post</span>
                    </div>
                    
               </div>
              
                 <button className='border rounded-lg px-3 py-2'>chỉnh sửa</button>
             </div>
           <div className="flex sticky top-0 bg-black z-30">
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
