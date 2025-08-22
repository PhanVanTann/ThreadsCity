import React from 'react'
import LoadingDot from './LoadingDot'
import { Check } from 'lucide-react'

const Content = ({ loading, contentText }: { loading: boolean; contentText: string }) => {
  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='w-[500px] h-[40px] bg-gray-900 rounded-lg p-3 flex flex-row items-center gap-2.5'>
        {loading ? <LoadingDot /> : <Check className='bg-green-500 rounded-full p-1' />}
        <p className='text-white'>{contentText}</p>
      </div>
    </div>
  )
}

export default Content
