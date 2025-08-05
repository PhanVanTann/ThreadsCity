import { useState } from "react";
import { FaThreads,FaPlus,FaRegHeart } from "react-icons/fa6";
import { RiHome4Line,RiSearch2Line,RiMenu4Fill } from "react-icons/ri";
import Logout from "./logout";
import { BsPerson } from "react-icons/bs";
import { NavLink } from "react-router";
import Post from "./postmodel";
export default function Sidebar() {
    const [openPost, setOpenPost] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

  const handleOpenmenu = () => {
    setOpenMenu(!openMenu);
  }
  return (
    <div className="fixed ">
    <div className="flex flex-col  items-center justify-between  h-screen w-[80px] bg-black text-white p-5">
      <div className="">
          <NavLink to="/" end 
                >
                <div className="px-3 py-2 mt-4 rounded-lg hover:bg-[#1d1d1d] hover:text-white transition-colors">     
                   <FaThreads  className="transition duration-200 hover:scale-125"  size={40}/>
               </div>
              
            </NavLink>
          
          
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
        { openMenu && (
          <div className="absolute bottom-20 left-0 w-[200px] bg-[#262626] text-white rounded-lg shadow-lg">
            <ul className="p-2">  
              <li className="px-4 py-2 hover:bg-[#3d3d3d] cursor-pointer">Cài đặt</li>
              <li className="px-4 py-2 hover:bg-[#3d3d3d] cursor-pointer}">Trợ giúp</li>          
              <li className="px-4 py-2 hover:bg-[#3d3d3d] cursor-pointer flex"><Logout/> Đăng xuất </li>
            </ul>
          </div>
        )}
        <div onClick={handleOpenmenu} className="text-[#4d4d4d] px-3 py-2 mt-4 rounded-lg hover:bg-[#1d1d1d] hover:text-white transition-colors">     
          <RiMenu4Fill size={30} />
        </div>
    </div>
    <Post open={openPost} onClose={() => setOpenPost(false)} />
    </div>
  );
}
