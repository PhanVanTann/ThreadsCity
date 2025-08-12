import React ,{useState} from 'react';
import PostList from '../components/postlist';
import Postmodel from '~/components/postmodel';
import { useAuth } from "../context/authContext";
export default function Home() {
  const [openPost, setOpenPost] = useState(false);
  const handleOpenPost = () => {
    setOpenPost(true);
  };

  return (
    <div className="w-[700px] flex flex-col items-center mt-5 h-screen bg-gray-100 dark:bg-[#000] ">
        <div onClick={handleOpenPost} className="w-full dark:bg-[#181818] border border-[#3d3d3d] flex justify-between items-center p-3 text-white rounded-lg cursor-pointer  transition-colors">
           <img
          src={ "https://i.pravatar.cc/150?img=1"} // Replace with actual avatar path
          alt="avatar"
          className="object-cover rounded-full w-[40px] h-[40px] mr-2"
        />
          <span className="text-lg font-semibold">Tạo bài viết mới</span>
          <div className='w-[40px]'></div>
        </div>
        <Postmodel open={openPost} onClose={() => setOpenPost(false)} />
        <PostList />
    </div>
  );
}
