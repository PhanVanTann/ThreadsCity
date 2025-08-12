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
        
    </div>
  );
}
