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
import { useSelector } from 'react-redux'

const LoadingPost = () => {
  const loading = useSelector((state: any) => state.post.createPost.isFetching)
  const success = useSelector((state: any) => state.post.createPost.success)
  const navigate = useNavigate()
  useEffect(() => {
    if (success) {
      toast.success('Đăng bài thành công!')
    }
  }, [success, loading])

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
      {!loading && success && <Success />}
    </div>
  )
}

export default LoadingPost