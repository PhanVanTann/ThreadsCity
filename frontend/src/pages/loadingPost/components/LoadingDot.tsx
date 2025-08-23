import React from 'react'

const LoadingDot = () => {
  return (
    <div className='border-2 border-gray-700 rounded-full p-1 w-[24px] h-[24px] flex items-center justify-center'>
      <div className='bg-[#2563eb] p-1 rounded-full animate-pulse'></div>
    </div>
  )
}

export default LoadingDot
