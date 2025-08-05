import React from 'react';
import Post from "../components/postlist";
import PostList from '../components/postlist';

export default function Home() {
  return (
    <div className="w-[700px] flex flex-col items-center mt-5 h-screen bg-gray-100 dark:bg-[#000] gap-5">
       
        <PostList />
    </div>
  );
}
