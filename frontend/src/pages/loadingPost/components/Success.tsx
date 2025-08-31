import React from 'react'
import { useNavigate } from 'react-router-dom'

const Success = () => {
  const navigate = useNavigate()
  const handleClick = () => {
    window.location.href = "/";
  }
  return (
    <>
      <div className='mt-10 p-6 flex items-center justify-center w-[500px] rounded-lg border border-green-800 bg-green-900/50'>
        <p className='text-green-400 font-semibold'>Bài đăng đã được phê duyệt!</p>
      </div>
      <button className='mt-5 w-[500px] bg-[#2563eb] rounded-lg p-5 hover:cursor-pointer' onClick={handleClick}>
        Quay lại trang chủ
      </button>
    </>
  )
}

export default Success