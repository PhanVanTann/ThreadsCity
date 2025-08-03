import { useState } from "react";
import { FaThreads,FaPlus,FaRegHeart } from "react-icons/fa6";
import { RiHome4Line,RiSearch2Line,RiMenu4Fill } from "react-icons/ri";
import { BsPerson } from "react-icons/bs";
import { NavLink } from "react-router";
import Post from "../components/post";
export default function Sidebar() {
    const [openPost, setOpenPost] = useState(false);
  return (
    <>
    <div className="flex flex-col  items-center justify-between  h-screen w-[80px] bg-black text-white p-5">
      <div className="">
          <FaThreads  className="transition duration-200 hover:scale-125"  size={40}/>
      </div>      
        <nav className=" p-2">
            {/* home */}
            <NavLink to="/" end className={({ isActive, isPending, isTransitioning }) =>
                    [
                      isPending ? "pending" : "",
                      isActive ? "active" : "noactive",
                      isTransitioning ? "transitioning" : "",
                      
                    ].join(" ")
                  }
                >
                <div className="px-3 py-2 mt-4 rounded-lg hover:bg-[#1d1d1d] hover:text-white transition-colors">     
                   <RiHome4Line size={30}/> 
               </div>
              
            </NavLink>
            {/* search */}
            <NavLink to="/search"end className={({ isActive, isPending, isTransitioning }) =>
                    [
                      isPending ? "pending" : "",
                      isActive ? "active" : "noactive",
                      isTransitioning ? "transitioning" : "",
                    ].join(" ")
                  }>
               <div className="px-3 py-2 mt-4 rounded-lg hover:bg-[#1d1d1d] hover:text-white transition-colors">     
                   <RiSearch2Line   size={30}/>  
               </div>
            </NavLink>
            {/* create post */}
            <div className={"bg-[#1d1d1d] px-3 py-2  rounded-lg text-[#4d4d4d] mt-4 hover:text-white  transition-colors"} 
                 onClick={() => setOpenPost(true)}
                 >
              <FaPlus size={30}/>
            </div>
            
            {/* notification */}
            <NavLink to="/notifications"end className={({ isActive, isPending, isTransitioning }) =>
                    [
                      isPending ? "pending" : "",
                      isActive ? "active" : "noactive",
                      isTransitioning ? "transitioning" : "",
                    ].join(" ")
                  }>
               <div className="px-3 py-2 mt-4 rounded-lg hover:bg-[#1d1d1d] hover:text-white transition-colors">     
                    <FaRegHeart size={30}/> 
               </div>
            </NavLink>
            {/* profile */}
               <NavLink to="/profile"end className={({ isActive, isPending, isTransitioning }) =>
                    [
                      isPending ? "pending" : "",
                      isActive ? "active" : "noactive",
                      isTransitioning ? "transitioning" : "",
                    ].join(" ")
                  }>
               <div className="px-3 py-2 mt-4 rounded-lg hover:bg-[#1d1d1d] hover:text-white transition-colors">     
                    <BsPerson size={30}/> 
               </div>
            </NavLink>
        </nav>
        <div className="text-[#4d4d4d] px-3 py-2 mt-4 rounded-lg hover:bg-[#1d1d1d] hover:text-white transition-colors">     
          <RiMenu4Fill size={30} />
        </div>
    </div>
    <Post open={openPost} onClose={() => setOpenPost(false)} />
    </>
  );
}
