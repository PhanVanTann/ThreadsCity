import React, { useState, useEffect } from "react";
import PostList from '../components/postlist';
import Postmodel from '../components/postmodel';
import PostSkeleton from '../components/postSkeleton';
import { getUserById } from "src/redux/api/apiRequestUser";
import { useDispatch,useSelector } from "react-redux";
export default function Home() {
  const [openPost, setOpenPost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userID = useSelector((state: any) => state.auth.login.currentUser?.user_id);
  const UserData = useSelector((state:any)=>state.user.getUserById?.data?.data)
  const dispatch = useDispatch()
  const handleOpenPost = () => {
    setOpenPost(true);
  };
  useEffect(() => {
   
    getUserById(userID,dispatch)
    setTimeout(() => setIsLoading(false), 1500);

  }, []);
  return (
     <>
     
        <div className="w-[700px] flex flex-col items-center mt-5 h-screen bg-gray-100 dark:bg-[#000] ">
        <div onClick={handleOpenPost} className="w-full dark:bg-[#181818] border border-[#3d3d3d] flex justify-between items-center p-3 text-white rounded-lg cursor-pointer  transition-colors">
           <img
          src={UserData?.avatar||"https://i.pravatar.cc/150?img=1"}
          alt="avatar"
          className="object-cover rounded-full w-[40px] h-[40px] mr-2"
        />
          <span className="text-lg font-semibold">Tạo bài viết mới</span>
          <div className='w-[40px]'></div>
        </div>
        
        <Postmodel open={openPost} onClose={() => setOpenPost(false)} />
           {isLoading ? <PostSkeleton /> 
      :
        <PostList />
           }
    </div>
    </>
   
  );
}
