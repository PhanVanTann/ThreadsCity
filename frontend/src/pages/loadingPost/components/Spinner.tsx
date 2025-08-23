import { Check, RefreshCw } from 'lucide-react'
import React from 'react'

const Spinner = ({ loading }: { loading: boolean }) => {
  return (
    <div className='relative'>
      {/* Gợn sóng tỏa ra */}
      <div className='absolute inset-0  rounded-full animate-ping border border-[#2563eb] '></div>
      {/* Spinner chính */}
      {loading ? (
        <div className='relative bg-[#2563eb] rounded-full p-4 animate-spin z-10'>
          <RefreshCw size={30} color='white' />
        </div>
      ) : (
        <div className='relative bg-[#2563eb] rounded-full p-4 z-10'>
          <Check size={30} color='#4ade80' />
        </div>
      )}
    </div>
  )
}

export default Spinner
