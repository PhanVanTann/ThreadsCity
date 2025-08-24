import React from 'react'
import { useNavigate } from 'react-router-dom'

const Falid = () => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/')
  }
  return (
    <>
      <div className='mt-10 p-6 flex items-center justify-center w-[500px] rounded-lg border border-red-800 bg-red-900/50'>
        <p className='text-white/80 font-semibold'>Bài đăng của bạn Phát hiện vi phạm. chúng tôi sẽ không chấp nhận bài đăng bị vi phạm!</p>
      </div>
      <button className='mt-5 w-[500px] bg-[#2563eb] rounded-lg p-5 hover:cursor-pointer' onClick={handleClick}>
        Quay lại trang chủ
      </button>
    </>
  )
}

export default Falid