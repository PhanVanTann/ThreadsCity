import React ,{useState} from 'react';
import PostList from '../components/postlist';
import Postmodel from '~/components/postmodel';

export default function Home() {
  const [openPost, setOpenPost] = useState(false);
  const handleOpenPost = () => {
    setOpenPost(true);
  };

  return (
    <div className="w-[700px] flex flex-col items-center mt-5 h-screen bg-gray-100 dark:bg-[#000] gap-5">
        <div onClick={handleOpenPost} className="w-full flex justify-center items-center p-4 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-500 transition-colors">
aa
        </div>
        <Postmodel open={openPost} onClose={() => setOpenPost(false)} />
        <PostList />
    </div>
  );
}
