// layout.tsx (dashboard layout)

import React from 'react';
import { Outlet } from 'react-router-dom';
import TableSkeleton from './components/TableSkeleton';
import BlockSkeleton from './components/BlockSkeleton';
import Logout from 'src/auth/logout';
export default function DashBoardLayout() {
  // ví dụ: nếu bạn muốn hiển thị skeleton ở layout
  const showingSkeleton = false; // đổi theo logic của bạn

  return (
    <div className="relative h-full">
      {/* header / sidebar ... */}

      <div className="w-screen flex justify-center">
        {showingSkeleton ? (
          <BlockSkeleton rows={6} cols={5} /> // ✅ hợp lệ trong <div>
        ) : null}
      </div>
      <div className='absolute top-5 right-5'>
          <Logout/>
      </div>
      {/* nội dung route con */}

      <Outlet />
    </div>
  );
}
