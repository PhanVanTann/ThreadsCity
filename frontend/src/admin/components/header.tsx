import React, { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router";
import Logout from "src/auth/logout";

export default function ADHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  // Khai báo các tab và đường dẫn tương ứng
  const tabs = [
    { label: "Người dùng", path: "dashboard" },
    { label: "Xử lý bài đăng", path: "postprocessing" },
  ];

  // Xác định tab đang active theo URL hiện tại


const handleNavigate = (index: number) => {
  setActiveIndex(index);
  navigate(tabs[index].path);
};


  return (
    <div className="fixed w-[90%] z-10 mt-5 text-black flex justify-between items-center">
      <div className="flex gap-1   rounded-tl-[30px] rounded-tr-[30px] ">
        <div className="text-[30px] font-bold mr-8">Dashboard</div>

        {tabs.map((t, i) => (
          <button
            key={t.path}
            onClick={() => handleNavigate(i)}
            className={`px-3 py-2 rounded-[20px] transition
              ${activeIndex === i ? "bg-black text-white" : "bg-[#e3e5e6]"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <button
        className="w-[40px] h-[40px] p-1 rounded-full cursor-pointer hover:bg-[#e3e5e6]"
       // tùy flow của bạn
        aria-label="Đăng xuất"
        title="Đăng xuất"
      >
        <BiLogOut size={24} />
        <Logout/>
      </button>
    </div>
  );
}
