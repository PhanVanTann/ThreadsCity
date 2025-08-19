import { Outlet } from "react-router";
import Header from "./components/header";

export default function dashBoardLayout() {
  return (
        <div className="relative h-screen  w-screen bg-gradient-to-br from-[#e3e5e6]   to-[#98cfe9] overflow-y">
            <div className="w-screen flex justify-center">
                    <Header/>
            </div>
            
            <div className=" flex justify-center items-center mt-28">
                <Outlet />
            </div>
                 
        </div>
  
          
         
          
  
 
  );
}
