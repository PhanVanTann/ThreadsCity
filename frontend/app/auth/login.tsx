import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { NavLink } from "react-router";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-[#000] gap-5">
     <div className="w-[450px] flex flex-col items-center  p-8 border border-[#353535] rounded shadow-md">
        <div className="w-[350px] h-[120px] select-none">
            <img src="../../public/1688663419threads-logo.png" alt="logo" className="bg-white dark:bg-gray-800" />
        </div>
        <div >
           <form action="" className="flex flex-col items-center  gap-1 mt-4">
                   
                    <input
                        id="username"
                        type="text"
                        placeholder="Username, phone number or email"
                        className="w-[300px] p-2 border border-[#353535] rounded select-none focus:outline-none focus:ring-0 focus:border-[#353535]"
                    />
                   <div className="relative w-[300px]">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="w-full p-2 border border-[#353535] rounded pr-10 select-none focus:outline-none focus:ring-0 focus:border-[#353535]"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2 text-sm text-gray-500"
                          onClick={() => setShowPassword((v) => !v)}
                          tabIndex={-1}
                        >
                          {showPassword ? "Ẩn" : "Hiện"}
                        </button>
                   </div>
                      <button
                          type="submit"
                          className="w-[300px] bg-blue-600 text-white mt-[20px] select-none cursor-pointer p-2 rounded-lg hover:bg-blue-500 transition-colors">
                        Đăng nhập
                      </button>
                    <div className="flex items-center text-[12px] select-none"><div className="h-[1px] w-[100px] bg-[#5c5c5c] mr-5"></div> OR<div className="h-[1px] w-[100px] bg-[#5c5c5c] ml-5"></div></div>
             </form>
            <div className="flex items-center justify-center mt-4 select-none">
                <button  type="button" className="flex items-center cursor-pointer gap-2">
                  <FaGoogle color="#fff" size={20} />
                  <span>Đăng nhập với Google</span>
                </button>
            </div>
             
            
        </div>
     </div>
        <div className="w-[450px] flex flex-col items-center  p-6 border border-[#353535] rounded shadow-md">
            <p className="text-[18px]  text-gray-500 select-none">
              Bạn chưa có tài khoản?
              
              <span className="text-white"><NavLink to="/register" > Đăng ký </NavLink></span>
               
             
            </p>
        </div>
    </div>
  );
}
