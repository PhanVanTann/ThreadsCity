// layout.tsx (dashboard layout)

import React from 'react';
import { Outlet } from 'react-router-dom';
import BlockSkeleton from './components/BlockSkeleton';
import Logout from 'src/admin/components/adLogout';
export default function DashBoardLayout() {
  // ví dụ: nếu bạn muốn hiển thị skeleton ở layout
  const showingSkeleton = false; // đổi theo logic của bạn

  return (
    <div className="relative w-full h-full">
      {/* header / sidebar ... */}

      <div className="w-screen flex justify-center">
        {showingSkeleton ? (
          <BlockSkeleton rows={6} cols={5} /> // ✅ hợp lệ trong <div>
        ) : null}
      </div>
      <div className='absolute top-5 right-5'>
              <button
        className="w-[40px] h-[40px] p-1 rounded-full cursor-pointer hover:bg-[#e3e5e6]"
        // tùy flow của bạn
        aria-label="Đăng xuất"
        title="Đăng xuất"
      >
        
        <Logout/>
      </button>
      </div>
      {/* nội dung route con */}

      <Outlet />
    </div>
  );
}
