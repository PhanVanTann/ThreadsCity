import React, { useEffect, useState } from 'react'
import { Dot, Info, RefreshCw } from 'lucide-react'
import Spinner from 'src/pages/loadingPost/components/Spinner'
import HeaderNoti from 'src/pages/loadingPost/components/HeaderNoti'
import { Check } from 'lucide-react'
import LoadingDot from 'src/pages/loadingPost/components/LoadingDot'
import Content from './components/Content'
import Success from './components/Success'
import toast from 'react-hot-toast'
import { Navigate, useNavigate } from 'react-router-dom'

const LoadingPost = (prop:any) => {
  let loading = prop.loading
  const navigate = useNavigate()
 useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        toast.success('tự động chuyển hướng sau 3s')

      }, 3000)
   
    navigate('/')
      return () => clearInterval(interval)
    }
  }, [loading])
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      {/* Spinner xoay tròn */}
      <Spinner loading={loading} />
      {/* Thông báo */}
      <HeaderNoti />
    
      <div className='flex flex-row items-start gap-2 mt-7 w-[500px] bg-gray-900 rounded-lg p-5'>
        <Info size={40} />
        <div className='flex flex-col '>
          <p className='font-semibold text-xl'>Tại sao cần kiểm duyệt?</p>
          <p className='text-sm text-gray-400'>
            Chúng tôi kiểm tra mọi bài đăng để đảm bảo tuân thủ quy tắc cộng đồng và tạo môi trường an toàn cho tất cả
            người dùng.
          </p>
        </div>
      </div>
      {!loading && <Success />}
    </div>
  )
}

export default LoadingPost
